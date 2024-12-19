import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemEntity } from './item.entity';
import { ItemDto } from './item.dto';
import { FirebaseService } from '../service/firebase.service';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(ItemEntity)
    private readonly itemRepository: Repository<ItemEntity>,
    private readonly firebaseService: FirebaseService,
  ) {}

  // Create a new item with images and dimensional files
  async createItem(
    productImages: Express.Multer.File[],
    dimensionalFiles: Express.Multer.File[],
    createItemDto: ItemDto,
  ): Promise<ItemEntity> {
    const imageUrls: string[] = [];
    const dimensionalUrls: string[] = [];

    // Upload product images
    for (const file of productImages) {
      const filePath = `items/images/${Date.now()}-${file.originalname}`;
      const imageUrl = await this.firebaseService.uploadFile(filePath, file.buffer);
      imageUrls.push(imageUrl);
    }

    // Upload dimensional files
    for (const file of dimensionalFiles) {
      const filePath = `items/dimensions/${Date.now()}-${file.originalname}`;
      const dimensionalUrl = await this.firebaseService.uploadFile(filePath, file.buffer);
      dimensionalUrls.push(dimensionalUrl);
    }

    const newItem = this.itemRepository.create({
      ...createItemDto,
      productImages: imageUrls,
      dimensionalFiles: dimensionalUrls,
    });

    return await this.itemRepository.save(newItem);
  }

  // Update an existing item with new images and dimensional files
  async updateItem(
    itemId: string,
    productImages: Express.Multer.File[],
    dimensionalFiles: Express.Multer.File[],
    updateItemDto: ItemDto,
  ): Promise<ItemEntity> {
    const item = await this.itemRepository.findOne({ where: { id: itemId } });
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    // Delete old images and files if they exist
    if (item.productImages) {
      await this.firebaseService.deleteImage(item.productImages);
    }
    if (item.dimensionalFiles) {
      await this.firebaseService.deleteImage(item.dimensionalFiles);
    }

    const newImageUrls: string[] = [];
    const newDimensionalUrls: string[] = [];

    // Upload new product images
    for (const file of productImages) {
      const filePath = `items/images/${Date.now()}-${file.originalname}`;
      const imageUrl = await this.firebaseService.uploadFile(filePath, file.buffer);
      newImageUrls.push(imageUrl);
    }

    // Upload new dimensional files
    for (const file of dimensionalFiles) {
      const filePath = `items/dimensions/${Date.now()}-${file.originalname}`;
      const dimensionalUrl = await this.firebaseService.uploadFile(filePath, file.buffer);
      newDimensionalUrls.push(dimensionalUrl);
    }

    // Update item fields
    Object.assign(item, updateItemDto);
    item.productImages = newImageUrls;
    item.dimensionalFiles = newDimensionalUrls;

    return await this.itemRepository.save(item);
  }

  // Get all items
  async findAll(): Promise<ItemEntity[]> {
    return await this.itemRepository.find();
  }
  async getAllItems(): Promise<{ data: ItemEntity[] }> {
    const items = await this.itemRepository.find();
    return { data: items || [] }; // Wrap the data in a `data` property
  }

  // Get an item by ID
  async getItemById(itemId: string): Promise<ItemEntity> {
    const item = await this.itemRepository.findOne({ where: { id: itemId } });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return item;
  }

  // Delete an item and associated images/files
  async deleteItem(itemId: string): Promise<{ message: string }> {
    const item = await this.itemRepository.findOne({ where: { id: itemId } });
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    // Delete associated images and files
    if (item.productImages) {
      await this.firebaseService.deleteImage(item.productImages);
    }
    if (item.dimensionalFiles) {
      await this.firebaseService.deleteImage(item.dimensionalFiles);
    }

    await this.itemRepository.delete(itemId);
    return { message: 'Item deleted successfully' };
  }
}
