// src/faq/dto/create-faq.dto.ts

import { IsNotEmpty, IsString, IsIn, IsEnum, IsOptional, IsEmail, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { FAQStatus } from './setting.entity';

export class CreateFaqDto {
    @IsNotEmpty()
    @IsString()
    question!: string;

    @IsNotEmpty()
    @IsString()
    answer!: string;

    @IsEnum(FAQStatus)
    @IsOptional()
    status?: FAQStatus; // Status field
}

export class UpdateFaqDto extends PartialType(CreateFaqDto) { }

export class CreateLogoDto {
    @IsNotEmpty()
    @IsString()
    logoImage!: string; // URL/path to the logo image
}

export class UpdateLogoDto extends PartialType(CreateLogoDto) { }


export class CreatePrivacyPolicyDto {
    @IsNotEmpty()
    @IsString()
    content!: string; // Content of the privacy policy

}

export class CreateTermsConditionsDto {
    @IsString()
    readonly id?: string; // Optional for creation, required for updates

    @IsNotEmpty()
    @IsString()
    readonly content?: string;
}

export class CreateContactDto {

    @IsString()
    readonly id?: string; // Optional for creation, required for updates

    @IsNotEmpty()
    @IsString()
    readonly message?: string;

}

export class CreateBannerDto {
    @IsNotEmpty()
    @IsString()
    name!: string; // URL/path to the logo image
}
export class UpdateBannerDto extends PartialType(CreateBannerDto) { }

// DTO: api_control_settings.dto.ts
export class UpdateSyncControlSettingsDto {
    @IsNotEmpty()
    @IsString()
    moduleName!: string; // E.g., 'Products', 'Orders'
  
    @IsNotEmpty()
    @IsBoolean()
    isAutoSyncEnabled!: boolean; // Auto Sync status
  
    @IsNotEmpty()
    @IsBoolean()
    isManualSyncEnabled!: boolean; // Manual Sync status
  }

  export class UpdateTallySettingsDto {
    @IsNotEmpty()
    @IsString()
    name!: string; // Name of the ledger
  
    @IsOptional()
    @IsString()
    value?: string; // Value of the ledger
  }
  