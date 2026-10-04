import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    private dataSource: DataSource,
  ) {}

  async create(createCategoryDto: any, userId: number): Promise<Category> {
    const normalizedName = createCategoryDto.name.trim();

    //Fetch all user categories to check for case-insensitive duplicates
    const existingCategories = await this.categoriesRepository.find({
      where: { user: { id: userId } },
    });

    const isDuplicate = existingCategories.some(
      (cat) => cat.name.toLowerCase() === normalizedName.toLowerCase()
    );

    if (isDuplicate) {
      throw new ConflictException('A category with this name already exists.');
    }

    const category = this.categoriesRepository.create({
      name: normalizedName, 
      user: { id: userId }, 
    });
    return this.categoriesRepository.save(category);
  }

  async findAll(userId: number): Promise<Category[]> {
    const categories = await this.categoriesRepository.find({
      where: { user: { id: userId } },
    });

    if (categories.length === 0) {
      const defaultCategories = ['Food', 'Travel', 'Shopping', 'Bills', 'Health'];
      
      const newCategories = defaultCategories.map(name => 
        this.categoriesRepository.create({ name, user: { id: userId } })
      );
      
      return this.categoriesRepository.save(newCategories);
    }

    return categories;
  }

  //Rename a category
  async update(id: number, name: string, userId: number): Promise<Category> {
    const normalizedName = name.trim();
    
    const category = await this.categoriesRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!category) {
      throw new NotFoundException('Category not found or you do not have permission to edit it');
    }

    const existingCategories = await this.categoriesRepository.find({
      where: { user: { id: userId } },
    });

    const isDuplicate = existingCategories.some(
      (cat) => cat.name.toLowerCase() === normalizedName.toLowerCase() && cat.id !== id
    );

    if (isDuplicate) {
      throw new ConflictException('A category with this name already exists.');
    }

    category.name = normalizedName;
    return this.categoriesRepository.save(category);
  }

  async remove(id: number, userId: number): Promise<void> {
    const category = await this.categoriesRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!category) {
      throw new NotFoundException('Category not found or you do not have permission to delete it');
    }

    const linkedExpensesCount = await this.dataSource
      .getRepository('Expense')
      .count({ where: { category: { id: id } } });

    if (linkedExpensesCount > 0) {
      throw new ConflictException(
        'Warning: Cannot delete this category because it is currently linked to an expense. Please delete or update the linked expenses first.'
      );
    }

    await this.categoriesRepository.delete(id);
  }
}
