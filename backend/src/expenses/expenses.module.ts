import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './expense.entity';
import { Category } from '../categories/category.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Expense,Category])
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService]
})
export class ExpensesModule {}
