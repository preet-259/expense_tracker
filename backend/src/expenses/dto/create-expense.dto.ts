import { IsNotEmpty, IsString, IsNumber, IsPositive, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { PaymentMethod } from '../expense.entity';

export class CreateExpenseDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  title!: string;

  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber({}, { message: 'Amount must be a number' })
  @IsPositive({ message: 'Amount must be greater than zero' })
  amount!: number;

  @IsNotEmpty({ message: 'Expense date is required' })
  @IsDateString({}, { message: 'Date must be a valid format (YYYY-MM-DD)' })
  expense_date!: string;

  @IsNotEmpty({ message: 'Payment method is required' })
  @IsEnum(PaymentMethod, { message: 'Payment method must be Cash, Card, UPI, Bank Transfer, or Other' })
  payment_method!: PaymentMethod;

  @IsNotEmpty({ message: 'Category ID is required' })
  @IsNumber()
  category_id!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}