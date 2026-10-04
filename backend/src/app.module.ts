import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/category.entity';
import { ExpensesModule } from './expenses/expenses.module';
import { Expense } from './expenses/expense.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      //port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_DATABASE,
      entities: [User, Category, Expense], 
      synchronize: true,
    }),

    UsersModule,

    AuthModule,

    CategoriesModule,

    ExpensesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
