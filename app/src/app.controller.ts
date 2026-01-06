import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('login')
  login(@Body() body: { username: string; role: string; password?: string }) {
    const { username, role, password } = body;
    const isLoggedIn = this.appService.checkLogin(username, role, password);

    if (!isLoggedIn) {
      return {
        ok: false,
        message: 'Nom d’utilisateur ou mot de passe invalide',
      };
    }

    return { ok: true, message: 'Connexion réussie', username, role };
  }
}
