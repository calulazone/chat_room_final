import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  checkLogin(username: string, role: string, password?: string): boolean {
    if (!username) return false;
    if (role === 'admin') {
      return password === process.env.ADMIN_PASSWORD;
    }
    return true;
  }
}
