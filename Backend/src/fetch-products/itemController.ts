import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemDto } from './item.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  // Create a new item
  @Post('/create')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'productImages', maxCount: 10 },
      { name: 'dimensionalFiles', maxCount: 10 },
    ]),
  )
  async createItem(
    @UploadedFiles() files: { productImages?: Express.Multer.File[]; dimensionalFiles?: Express.Multer.File[] },
    @Body() createItemDto: ItemDto,
  ) {
    return this.itemService.createItem(
      files.productImages || [],
      files.dimensionalFiles || [],
      createItemDto,
    );
  }

  // Update an existing item
  @Put('/update/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'productImages', maxCount: 10 },
      { name: 'dimensionalFiles', maxCount: 10 },
    ]),
  )
  async updateItem(
    @Param('id') id: string,
    @UploadedFiles() files: { productImages?: Express.Multer.File[]; dimensionalFiles?: Express.Multer.File[] },
    @Body() updateItemDto: ItemDto,
  ) {
    return this.itemService.updateItem(
      id,
      files.productImages || [],
      files.dimensionalFiles || [],
      updateItemDto,
    );
  }

  // Get all items
  @Get('/all')
  async getAllItems() {
    return this.itemService.getAllItems();
  }

  // Get an item by ID
  @Get('/:id')
  async getItemById(@Param('id') id: string) {
    return this.itemService.getItemById(id);
  }

  // Delete an item
  @Delete('/delete/:id')
  async deleteItem(@Param('id') id: string) {
    return this.itemService.deleteItem(id);
  }
}
