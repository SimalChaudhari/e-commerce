import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccountEntity } from './payment.entity';
import { BankAccountDto, PaymentType } from './payment.dto';
import { FirebaseService } from './../service/firebase.service';

@Injectable()
export class BankAccountService {
  
    constructor(
        @InjectRepository(BankAccountEntity)
        private readonly bankAccountRepository: Repository<BankAccountEntity>,
        private readonly firebaseService: FirebaseService,
    ) {}
  

    async createBankAccount(dto: BankAccountDto, files?: Express.Multer.File[]): Promise<BankAccountEntity> {
        const imageUrls: string[] = [];
    
        // Upload files to Firebase if present
        if (files && files.length > 0) {
            for (const file of files) {
                const filePath = `qr-codes/${Date.now()}-${file.originalname}`;
                const imageUrl = await this.firebaseService.uploadFile(filePath, file.buffer);
                imageUrls.push(imageUrl);
            }
        }
    
        // Validation for UPI type
        if (dto.type === PaymentType.UPIType) {
            if (!dto.upiProvider) {
                throw new Error('UPI Provider is required for UPI type.');
            }
            if (!dto.upiId && imageUrls.length === 0) {
                throw new Error('For UPI, either "upiId" or a QR code image must be provided.');
            }
        }
    
        const bankAccount = this.bankAccountRepository.create({
            ...dto,
            qrCodeImageUrl: imageUrls.join(','), // Save the uploaded QR code image URLs
        });
    
        return this.bankAccountRepository.save(bankAccount);
    }
    

    async getBankAccountDetails(id: string): Promise<BankAccountEntity> {
        const account = await this.bankAccountRepository.findOne({ where: { id } });
        if (!account) {
            throw new NotFoundException('Bank account not found');
        }
        return account;
    }

    async getAllBankAccounts(): Promise<BankAccountEntity[]> {
        return this.bankAccountRepository.find();
    }

    async updateBankAccount(
        id: string,
        dto: BankAccountDto,
        files?: Express.Multer.File[],
    ): Promise<BankAccountEntity> {
        // Find the existing bank account
        const existingAccount = await this.bankAccountRepository.findOne({ where: { id } });
        if (!existingAccount) {
            throw new NotFoundException('Bank account not found');
        }
    
        const newImageUrls: string[] = [];
    
        // Upload new files if provided
        if (files && files.length > 0) {
            for (const file of files) {
                const filePath = `qr-codes/${Date.now()}-${file.originalname}`;
                const imageUrl = await this.firebaseService.uploadFile(filePath, file.buffer);
                newImageUrls.push(imageUrl);
            }
        }
    
        // Handle image replacement logic
        if (newImageUrls.length > 0) {
            // Remove old images if new ones are uploaded
            const oldImageUrls = existingAccount.qrCodeImageUrl
                ? existingAccount.qrCodeImageUrl.split(',')
                : [];
    
            for (const oldImageUrl of oldImageUrls) {
                await this.firebaseService.deleteSingleImage(oldImageUrl); // Delete each old image
            }
    
            existingAccount.qrCodeImageUrl = newImageUrls.join(',');
        }
    
        // Validation for UPI type
        if (dto.type === PaymentType.UPIType) {
            if (!dto.upiProvider) {
                throw new Error('UPI Provider is required for UPI type.');
            }
            if (!dto.upiId && newImageUrls.length === 0 && !existingAccount.qrCodeImageUrl) {
                throw new Error('For UPI, either "upiId" or a QR code image must be provided.');
            }
        }
    
        // Update the account details
        Object.assign(existingAccount, dto);
    
        return this.bankAccountRepository.save(existingAccount);
    }
    

    async deleteBankAccount(id: string): Promise<{ message: string }> {
        // Retrieve the account details
        const account = await this.getBankAccountDetails(id);
    
        if (!account) {
            throw new NotFoundException('Bank account not found');
        }
    
        // Delete the associated single image from Firebase if it exists
        if (account.qrCodeImageUrl) {
            await this.firebaseService.deleteSingleImage(account.qrCodeImageUrl); // Delete the image
        }
    
        // Remove the bank account from the database
        await this.bankAccountRepository.remove(account);
    
        return { message: 'Bank account and associated image deleted successfully' };
    }

    async removeQrImage(id: string): Promise<{ message: string }> {
        // Retrieve the account details
        const account = await this.getBankAccountDetails(id);
    
        if (!account) {
            throw new NotFoundException('Bank account not found');
        }
    
        // Delete the associated image from Firebase if it exists
        if (account.qrCodeImageUrl) {
            await this.firebaseService.deleteSingleImage(account.qrCodeImageUrl); // Delete the image
            account.qrCodeImageUrl = null; // Remove the image URL from the account
            await this.bankAccountRepository.save(account); // Save the updated account
        } else {
            return { message: 'No QR image found to delete' };
        }
    
        return { message: 'QR image removed successfully' };
    }
    
    
}
