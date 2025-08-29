import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common"
import { Model } from "mongoose"
import  { JwtService } from "@nestjs/jwt"
import { InjectModel } from "@nestjs/mongoose"
import * as bcrypt from "bcryptjs"
import { User, UserDocument } from "../schemas/user.schema"
import  { RegisterDto, LoginDto } from "../dto/auth.dto"

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password } = registerDto

    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      throw new ConflictException("User with this email or username already exists")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = new this.userModel({
      username,
      email,
      password: hashedPassword,
    })

    await user.save()

    // Generate JWT token
    const payload = { sub: user._id, username: user.username }
    const token = this.jwtService.sign(payload)

    return {
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followersCount: user.followersCount,
        followingCount: user.followingCount,
      },
    }
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto

    // Find user
    const user = await this.userModel.findOne({ username })
    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials")
    }

    // Generate JWT token
    const payload = { sub: user._id, username: user.username }
    const token = this.jwtService.sign(payload)

    return {
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        followersCount: user.followersCount,
        followingCount: user.followingCount,
      },
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username })
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject()
      return result
    }
    return null
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).select("-password")
  }
}
