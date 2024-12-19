// Item.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemService } from './item.service';
import { ItemEntity } from './item.entity';
import { ItemController } from './itemController';
import { FirebaseService } from './../service/firebase.service';
import { SyncControlSettings } from './../settings/setting.entity';
import { SyncLogEntity } from './../sync-log/sync-log.entity';
import { SyncLogService } from './../sync-log/sync-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([ItemEntity,SyncLogEntity,SyncControlSettings])],
  controllers: [ItemController],
  providers: [ItemService,FirebaseService,SyncLogService],
  exports: [ItemService], // Exporting ItemService
})
export class ItemModule {}
