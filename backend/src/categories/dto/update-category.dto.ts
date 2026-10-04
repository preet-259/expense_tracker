import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Category name cannot be empty' })
  @MaxLength(50, { message: 'Category name is too long' })
  name!: string;
}