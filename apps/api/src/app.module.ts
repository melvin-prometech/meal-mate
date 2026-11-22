
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module.js';
import { RecipesModule } from './modules/recipes/recipes.module.js';
import { HouseholdsModule } from './modules/households/households.module.js';
import { HouseholdRecipesModule } from './modules/household-recipes/household-recipes.module.js';
import { MealsModule } from './modules/meals/meals.module.js';
import { AuthModule } from './modules/auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql' as const,
        host: config.getOrThrow<string>('DB_HOST'),
        port: config.getOrThrow<number>('DB_PORT'),
        username: config.getOrThrow<string>('DB_USERNAME'),
        password: config.getOrThrow<string>('DB_PASSWORD'),
        database: config.getOrThrow<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    UsersModule,
    RecipesModule,
    HouseholdsModule,
    HouseholdRecipesModule,
    MealsModule,
    AuthModule,
  ],
})
export class AppModule {}
