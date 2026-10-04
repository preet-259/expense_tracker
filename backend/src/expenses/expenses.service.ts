import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './expense.entity';
import { Category } from '../categories/category.entity';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
    constructor(
        @InjectRepository(Expense)
        private expensesRepository: Repository<Expense>,
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ){}

    // POST: new expense linked to a user
    async create(createExpenseDto: CreateExpenseDto, userId: number): Promise<Expense> {
        // 1. FIX IDOR: Verify the category exists AND belongs to this user
        const category = await this.categoriesRepository.findOne({
            where: { 
                id: createExpenseDto.category_id, 
                user: { id: userId } 
            }
        });

        if (!category) {
            throw new NotFoundException('Category not found or does not belong to you.');
        }

        //Explicitly map fields
        const expense = this.expensesRepository.create({
            title: createExpenseDto.title,
            amount: createExpenseDto.amount,
            expense_date: createExpenseDto.expense_date,
            payment_method: createExpenseDto.payment_method,
            notes: createExpenseDto.notes,
            category: category, 
            user: { id: userId }, 
        });
        
        return this.expensesRepository.save(expense);
    }


    async getSummary(userId: number) {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        const result = await this.expensesRepository
        .createQueryBuilder('expense')
        .select('SUM(expense.amount)', 'totalAmount')
        .addSelect('COUNT(expense.id)', 'totalCount')
        .where('expense.user.id = :userId', { userId })
        .andWhere('MONTH(expense.expense_date) = :month', { month: currentMonth })
        .andWhere('YEAR(expense.expense_date) = :year', { year: currentYear })
        .getRawOne();

        return {
        totalAmount: parseFloat(result.totalAmount) || 0,
        totalCount: parseInt(result.totalCount) || 0,
        };
    }

    //The Filter & Sort Logic
    async findAll(userId: number, query: any) {
        const qb = this.expensesRepository.createQueryBuilder('expense')
        .leftJoinAndSelect('expense.category', 'category')
        .where('expense.user.id = :userId', { userId });

        // Dynamically add WHERE clauses only if the user provided the filter
        if (query.search) {
            qb.andWhere('expense.title LIKE :search', { search: `%${query.search}%` });
        }
        if (query.category) {
            qb.andWhere('expense.category.id = :categoryId', { categoryId: query.category });
        }
        if (query.payment_method) {
            qb.andWhere('expense.payment_method = :method', { method: query.payment_method });
        }
        if (query.start_date) {
            qb.andWhere('expense.expense_date >= :startDate', { startDate: query.start_date });
        }
        if (query.end_date) {
            qb.andWhere('expense.expense_date <= :endDate', { endDate: query.end_date });
        }

        // Handle Sorting
        const sortOrder = query.sort_order === 'asc' ? 'ASC' : 'DESC'; 
        
        if (query.sort_by === 'amount') {
            qb.orderBy('expense.amount', sortOrder);
        } else if (query.sort_by === 'created') {
            qb.orderBy('expense.id', sortOrder); 
        } else {
            qb.orderBy('expense.expense_date', sortOrder);
        }

        return qb.getMany();
    }

    // GET: Fetch a single expense, ensuring the user owns it
    async findOne(id: number, userId: number): Promise<Expense> {
        const expense = await this.expensesRepository.findOne({
            where: { id, user: { id: userId } },
            relations: { category: true }, 
        });

        if (!expense) {
            throw new NotFoundException('Expense not found or you do not have permission to view it');
        }
        return expense;
    }

    // PATCH: Update an expense
    async update(id: number, updateExpenseDto: UpdateExpenseDto, userId: number): Promise<Expense> {
        // call findOne first. If they don't own it, findOne throws an error immediately!
        const expense = await this.findOne(id, userId);

        // FIX IDOR ON UPDATE: Verify new category ownership if they are changing it
        if (updateExpenseDto.category_id) {
            const category = await this.categoriesRepository.findOne({
                where: { 
                    id: updateExpenseDto.category_id, 
                    user: { id: userId } 
                }
            });
            
            if (!category) {
                throw new NotFoundException('Category not found or does not belong to you.');
            }
            expense.category = category;
        }

        // FIX MASS ASSIGNMENT ON UPDATE: Explicitly assign instead of Object.assign()
        if (updateExpenseDto.title) expense.title = updateExpenseDto.title;
        if (updateExpenseDto.amount) expense.amount = updateExpenseDto.amount;
        if (updateExpenseDto.expense_date) expense.expense_date = updateExpenseDto.expense_date;
        if (updateExpenseDto.payment_method) expense.payment_method = updateExpenseDto.payment_method;
        if (updateExpenseDto.notes !== undefined) expense.notes = updateExpenseDto.notes;

        return this.expensesRepository.save(expense);
    }

    // DELETE: Remove an expense (relies on findOne for security)
    async remove(id: number, userId: number): Promise<void> {
        const expense = await this.findOne(id, userId);
        await this.expensesRepository.remove(expense);
    }
}
