import { Controller, Get, UseGuards } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';
import { AuthGuard } from './auth/auth.guard';
import { CurrentUser } from './auth/user.decorator';

@Controller()
export class AppController {
  @Get()
  getHealth(): { status: string } {
    return { status: 'ok' };
  }

  @Get('health')
  healthCheck(): { status: string } {
    return { status: 'healthy' };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@CurrentUser() user: DecodedIdToken): { uid: string; email: string | undefined } {
    return {
      uid: user.uid,
      email: user.email,
    };
  }
}
