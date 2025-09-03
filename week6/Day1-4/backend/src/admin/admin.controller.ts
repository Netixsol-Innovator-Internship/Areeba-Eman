import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { UpdateRolesDto } from './dto/update-role.dto';

@ApiTags('admin') @ApiBearerAuth() @UseGuards(JwtAuthGuard, RolesGuard) @Roles(Role.SUPERADMIN) @Controller('admin')
export class AdminController {
  constructor(private users: UsersService) {}
@Patch('users/:id/roles')
  setRoles(@Param('id') id: string, @Body() updateRolesDto: UpdateRolesDto) {
    return this.users.updateRoles(id, updateRolesDto.roles);
  }
}
