import { Controller, Get, UseGuards, Param, Query, Patch, Body, Delete, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SocketGateway } from '../socket/socket.gateway';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private users: UsersService,
    private readonly socketGateway: SocketGateway
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    const user = req.user;
    return this.users.getOne(user?.sub);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get()
  async all(@Query() q: any) {
    return this.users.listAll(q);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get(':id')
  async one(@Param('id') id: string) {
    return this.users.getOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Patch(':id')
  async patch(@Param('id') id: string, @Body() body: any) {
    let updatedUser;

    // If roles are being updated, use updateRoles
    if (body.roles) {
      updatedUser = await this.users.updateRoles(id, body.roles);

      // Emit socket event so frontend updates in real-time
      this.socketGateway.server.emit('userUpdated', updatedUser);
    } else {
      updatedUser = await this.users.patch(id, body);
    }

    return updatedUser;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPERADMIN)
  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    return this.users.softDelete(id);
  }
}
