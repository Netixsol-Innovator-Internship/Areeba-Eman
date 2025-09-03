import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum } from 'class-validator';
import { Role } from '../../common/enums/role.enum'; //this is enum for roles

export class UpdateRolesDto {
  @ApiProperty({ enum: ['user', 'admin', 'superadmin'], isArray: true })
  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];
}
