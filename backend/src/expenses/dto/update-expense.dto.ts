import { PartialType } from '@nestjs/mapped-types';
import { CreateExpenseDto } from './create-expense.dto';

// This automatically copies all rules from CreateExpenseDto but makes them optional!
export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}