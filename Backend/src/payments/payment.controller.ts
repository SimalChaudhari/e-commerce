import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    Put,
    Delete,
    ParseUUIDPipe,
    UseInterceptors,
    UploadedFiles,
    UseGuards,
} from '@nestjs/common';
import { BankAccountService } from './payment.service';
import { BankAccountDto } from './payment.dto';
import { BankAccountEntity } from './payment.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './../jwt/jwt-auth.guard';
import { SessionGuard } from './../jwt/session.guard';

@Controller('bank-accounts')
@UseGuards(SessionGuard,JwtAuthGuard)
export class BankAccountController {
    constructor(private readonly bankAccountService: BankAccountService) { }

    @Post('create')
    @UseInterceptors(FilesInterceptor('qrCodeImageUrl', 10)) // Allow up to 10 files
    async createBankAccount(
        @Body() dto: BankAccountDto,
        @UploadedFiles() files: Express.Multer.File[], // Handle uploaded files
    ): Promise<BankAccountEntity> {
        return this.bankAccountService.createBankAccount(dto, files);
    }


    @Get('get')
    async getAllBankAccounts(): Promise<BankAccountEntity[]> {
        return this.bankAccountService.getAllBankAccounts();
    }

    @Get('get/:id')
    async getBankAccountDetails(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<BankAccountEntity> {
        return this.bankAccountService.getBankAccountDetails(id);
    }

    @Put('update/:id')
    @UseInterceptors(FilesInterceptor('qrCodeImageUrl', 10)) // Allow up to 10 files
    async updateBankAccount(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: BankAccountDto,
        @UploadedFiles() files: Express.Multer.File[], // Handle uploaded files
    ): Promise<BankAccountEntity> {
        return this.bankAccountService.updateBankAccount(id, dto, files);
    }


    @Delete('delete/:id')
    async deleteBankAccount(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<{ message: string }> {
        return this.bankAccountService.deleteBankAccount(id);
    }

    @Delete('remove-qr-image/:id')
    async removeQrImage(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
        return this.bankAccountService.removeQrImage(id);
    }

}
