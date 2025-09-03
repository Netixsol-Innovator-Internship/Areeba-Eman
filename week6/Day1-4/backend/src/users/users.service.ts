import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { generateOtp } from '../common/utils/otp';
import { MailerService } from '../mailer/mailer.service';
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private RESEND_COOLDOWN_SECONDS = Number(process.env.RESEND_COOLDOWN_SECONDS || 60);
  private RESEND_MAX_PER_HOUR = Number(process.env.RESEND_MAX_PER_HOUR || 5);
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private mailer: MailerService) {}
  async create(dto: CreateUserDto) {
    const exists = await this.userModel.findOne({ $or: [{ email: dto.email }, { username: dto.username }] });
    if (exists) throw new BadRequestException('Email or username already in use');
    const hash = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel({ ...dto, password: hash });
    const otp = generateOtp();
    user.otpCode = otp;
    user.otpExpiresAt = new Date(Date.now() + Number(process.env.OTP_EXPIRY_MINUTES || 7) * 60 * 1000);
    user.lastOtpSentAt = new Date();
    user.otpResendCount = 0;
    user.otpResendWindowStart = new Date();
    await user.save();
    if (process.env.NODE_ENV !== 'production') this.logger.log(`OTP for ${user.email}: ${otp}`);
    await this.mailer.sendOtpEmail(user.email, otp);
    return { id: user._id, email: user.email, username: user.username };
  }
  async findByEmail(email: string) { return this.userModel.findOne({ email, isDeleted: { $ne: true } }); }
  async findById(id: string) {
    const u = await this.userModel.findOne({ _id: id, isDeleted: { $ne: true } });
    if (!u) throw new NotFoundException('User not found');
    return u;
  }
  async verifyOtp(email: string, code: string) {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    if (user.verified) return { message: 'Already verified' };
    if (!user.otpCode || !user.otpExpiresAt) throw new BadRequestException('No OTP pending');
    if (user.otpExpiresAt.getTime() < Date.now()) throw new BadRequestException('OTP expired');
    if (user.otpCode !== code) throw new BadRequestException('Invalid OTP');
    user.verified = true;
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    await user.save();
    return { message: 'Email verified' };
  }
  async resendOtp(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');
    if (user.verified) throw new BadRequestException('Already verified');
    const now = Date.now();
    if (user.lastOtpSentAt && now - user.lastOtpSentAt.getTime() < this.RESEND_COOLDOWN_SECONDS * 1000) {
      throw new BadRequestException(`Please wait ${this.RESEND_COOLDOWN_SECONDS} seconds before requesting another OTP`);
    }
    const windowStart = user.otpResendWindowStart ? user.otpResendWindowStart.getTime() : 0;
    const windowElapsed = now - windowStart;
    if (!user.otpResendWindowStart || windowElapsed > 60 * 60 * 1000) {
      user.otpResendWindowStart = new Date(now);
      user.otpResendCount = 0;
    }
    if ((user.otpResendCount || 0) >= this.RESEND_MAX_PER_HOUR) {
      throw new BadRequestException('Exceeded OTP resend limit for this hour');
    }
    const otp = generateOtp();
    user.otpCode = otp;
    user.otpExpiresAt = new Date(now + Number(process.env.OTP_EXPIRY_MINUTES || 7) * 60 * 1000);
    user.lastOtpSentAt = new Date();
    user.otpResendCount = (user.otpResendCount || 0) + 1;
    await user.save();
    if (process.env.NODE_ENV !== 'production') this.logger.log(`Resent OTP for ${user.email}: ${otp}`);
    await this.mailer.sendOtpEmail(user.email, otp);
    return { message: 'OTP resent' };
  }
  async setResetOtp(email: string) {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    const otp = generateOtp();
    user.resetOtpCode = otp;
    user.resetOtpExpiresAt = new Date(Date.now() + Number(process.env.OTP_EXPIRY_MINUTES || 7) * 60 * 1000);
    await user.save();
    if (process.env.NODE_ENV !== 'production') this.logger.log(`Reset OTP for ${user.email}: ${otp}`);
    await this.mailer.sendResetEmail(email, otp);
    return { message: 'Reset OTP sent' };
  }
  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    if (!user.resetOtpCode || !user.resetOtpExpiresAt) throw new BadRequestException('No reset pending');
    if (user.resetOtpExpiresAt.getTime() < Date.now()) throw new BadRequestException('Reset OTP expired');
    if (user.resetOtpCode !== code) throw new BadRequestException('Invalid code');
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtpCode = undefined;
    user.resetOtpExpiresAt = undefined;
    await user.save();
    return { message: 'Password updated' };
  }
  async listAll(filter: any = {}) {
    const q: any = { isDeleted: { $ne: true } };
    if (filter.role) q.roles = filter.role;
    if (filter.q) q.$or = [{ email: { $regex: filter.q, $options: 'i' } }, { username: { $regex: filter.q, $options: 'i' } }, { fullName: { $regex: filter.q, $options: 'i' } }];
    const page = Number(filter.page || 1);
    const limit = Math.min(100, Number(filter.limit || 50));
    const skip = (page - 1) * limit;
    const items = await this.userModel.find(q).select('-password -otpCode -resetOtpCode').skip(skip).limit(limit);
    const total = await this.userModel.countDocuments(q);
    return { items, total, page, limit };
  }
  async updateRoles(userId: string, roles: string[]) { return this.userModel.findByIdAndUpdate(userId, { roles }, { new: true }).select('-password'); }
  async getOne(userId: string) { return this.userModel.findById(userId).select('-password -otpCode -resetOtpCode'); }
  async patch(userId: string, payload: any) { const allowed = ['fullName', 'email', 'username']; const update: any = {};
   for (const k of allowed) if (payload[k]) update[k] = payload[k]; return this.userModel.findByIdAndUpdate(userId, update, { new: true }).select('-password'); }
  async softDelete(userId: string) { return this.userModel.findByIdAndUpdate(userId, { isDeleted: true }, { new: true }).select('-password'); }
}
