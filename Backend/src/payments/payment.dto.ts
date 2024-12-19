import { IsNotEmpty, IsString, IsEnum, ValidateIf } from 'class-validator';


export enum PaymentType {
    BANK = 'Bank',
    UPIType = 'UPI',
    PAYPAL = 'Paypal',
}

export enum UpiProvider {
    GOOGLE_PAY = 'Google Pay',
    PHONE_PE = 'PhonePe',
    OTHER = 'Other',
}


export class BankAccountDto {
    @IsNotEmpty()
    @IsEnum(PaymentType, { message: 'Type must be bank, upi, or paypal' })
    type!: PaymentType;

    @ValidateIf((o) => o.type === PaymentType.BANK)
    @IsNotEmpty()
    @IsString()
    accountName?: string;

    @ValidateIf((o) => o.type === PaymentType.BANK)
    @IsNotEmpty()
    @IsString()
    accountNumber?: string;

    @ValidateIf((o) => o.type === PaymentType.BANK)
    @IsNotEmpty()
    @IsString()
    ifscCode?: string;

    @ValidateIf((o) => o.type === PaymentType.UPIType)
    @IsNotEmpty()
    @IsEnum(UpiProvider, { message: 'UPIType Provider must be google_pay, phone_pe, or other' })
    upiProvider?: UpiProvider;

    @ValidateIf((o) => o.type === PaymentType.UPIType)
    @IsNotEmpty()
    @IsString()
    upiId?: string;

    @ValidateIf((o) => o.type === PaymentType.UPIType)
    @IsString()
    qrCodeImageUrl?: string;

    @ValidateIf((o) => o.type === PaymentType.PAYPAL)
    @IsNotEmpty()
    @IsString()
    paypalEmail?: string;
}
