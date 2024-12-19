// src/faq/faq.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqController, PrivacyPolicyController, TermsConditionsController, ContactUsController, BannerController, SyncControlSettingsController, TallySettingsController } from './setting.controller';
import { FaqService, PrivacyPolicyService, TermsConditionsService, ContactUsService, BannerService, SyncControlSettingsService, TallySettingsService } from './setting.service';
import { Faq, PrivacyPolicy, TermsConditions, ContactUs, Banner, SyncControlSettings, TallySettings } from './setting.entity';
import { FirebaseService } from './../service/firebase.service';
@Module({
    imports: [TypeOrmModule.forFeature([Faq, PrivacyPolicy, TermsConditions, ContactUs,Banner,SyncControlSettings,TallySettings])
],
    controllers: [FaqController, PrivacyPolicyController, TermsConditionsController, ContactUsController,BannerController,SyncControlSettingsController,TallySettingsController],
    providers: [FaqService, PrivacyPolicyService, TermsConditionsService, ContactUsService,BannerService,FirebaseService,SyncControlSettingsService,TallySettingsService],
})
export class SettingModule { }
