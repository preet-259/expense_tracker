import { Body, Controller, Request, Get, Post, UseGuards, Delete, Param, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';


@UseGuards(AuthGuard('jwt'))
@Controller('categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService : CategoriesService
    ){}

    //Post (custom category)
    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto, @Request() req: any ) {
        return this.categoriesService.create(createCategoryDto, req.user.id);
    }

    @Get()
    findAll(@Request() req: any) {
        return this.categoriesService.findAll(req.user.id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string, 
        @Body() updateCategoryDto: UpdateCategoryDto,
        @Request() req: any
    ) {
        return this.categoriesService.update(+id, updateCategoryDto.name, req.user.id);
    }

    //Delete a custom category safely
    @Delete(':id')
    remove(@Param('id') id: string, @Request() req: any) {
        return this.categoriesService.remove(+id, req.user.id);
    }

    
}
