import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString, IsArray } from 'class-validator';

export class ItemDto {
    @IsOptional()
    @IsString()
    itemName?: string;

    @IsOptional()
    @IsString()
    alias?: string;

    @IsOptional()
    @IsString()
    partNo?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsString()
    group!: string;

    @IsOptional()
    @IsString()
    subGroup1?: string;

    @IsOptional()
    @IsString()
    subGroup2?: string;

    @IsOptional()
    @IsString()
    baseUnit?: string;

    @IsOptional()
    @IsString()
    alternateUnit?: string;

    @IsOptional()
    @IsString()
    conversion?: string;

    @IsOptional()
    @IsNumber()
    denominator?: number;

    @IsOptional()
    @IsDateString()
    sellingPriceDate?: string;

    @IsOptional()
    @IsNumber()
    sellingPrice?: number;

    @IsOptional()
    @IsString()
    gstApplicable?: string;

    @IsOptional()
    @IsDateString()
    gstApplicableDate?: string;

    @IsOptional()
    @IsString()
    taxability?: string;

    @IsOptional()
    @IsNumber()
    gstRate?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true }) // Validate that each entry in the array is a string
    productImages?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true }) // Validate that each entry in the array is a string
    dimensionalFiles?: string[];
}
