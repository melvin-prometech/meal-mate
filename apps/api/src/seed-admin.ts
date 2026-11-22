import { CreateUserSchema, UserRole } from '@meal-mate/schemas';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { UsersService } from './modules/users/users.service.js';

const app = await NestFactory.createApplicationContext(AppModule);

try {
  const config = app.get(ConfigService);
  const admin = CreateUserSchema.safeParse({
    firstName: 'Meal Mate',
    lastName: 'Admin',
    email: config.get<string>('INITIAL_ADMIN_EMAIL'),
    password: config.get<string>('INITIAL_ADMIN_PASSWORD'),
    role: UserRole.ADMIN,
  });

  if (!admin.success || Buffer.byteLength(admin.data.password, 'utf8') > 72) {
    throw new Error(
      'Set INITIAL_ADMIN_EMAIL to a valid email and INITIAL_ADMIN_PASSWORD to at least 8 characters and at most 72 UTF-8 bytes.',
    );
  }

  await app.get(UsersService).create(admin.data);
  console.log('Created the administrator.');
} finally {
  await app.close();
}
