import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { MailerModule } from '../mailer/mailer.module';
import { SocketGateway } from '../socket/socket.gateway';
@Module({ imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), MailerModule], providers: [UsersService, SocketGateway], controllers: [UsersController], exports: [UsersService, MongooseModule], })
export class UsersModule {}
