import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { AuthGuard } from '@nestjs/passport';

// Protect all routes in this controller using the JWT token
@UseGuards(AuthGuard('jwt'))
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto, @Request() req: any) {
    return this.expensesService.create(createExpenseDto, req.user.id);
  }

  // GET /expenses/summary
  @Get('summary')
  getSummary(@Request() req: any) {
    return this.expensesService.getSummary(req.user.id);
  }

 @Get()
  findAll(@Request() req: any, @Query() query: any) {
    return this.expensesService.findAll(req.user.id, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.expensesService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto, @Request() req: any) {
    return this.expensesService.update(+id, updateExpenseDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.expensesService.remove(+id, req.user.id);
  }
}