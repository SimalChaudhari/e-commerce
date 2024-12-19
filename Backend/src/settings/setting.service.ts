// src/faq/faq.service.ts

import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {  Banner, ContactUs, Faq, PrivacyPolicy, SyncControlSettings, TallySettings, TermsConditions } from './setting.entity';
import {  CreateBannerDto, CreateContactDto, CreateFaqDto, CreateLogoDto, CreatePrivacyPolicyDto, CreateTermsConditionsDto, UpdateBannerDto, UpdateFaqDto, UpdateLogoDto, UpdateSyncControlSettingsDto, UpdateTallySettingsDto } from './setting.dto';
import { FirebaseService } from './../service/firebase.service';

@Injectable()
export class FaqService {
    constructor(
        @InjectRepository(Faq)
        private faqRepository: Repository<Faq>
    ) { }

    async create(createFaqDto: CreateFaqDto): Promise<{ message: string, data: Faq }> {
        try {
            const faq = this.faqRepository.create(createFaqDto);
            const data = await this.faqRepository.save(faq);
            return { message: 'FAQ Create successfully', data: data };
        } catch (error: any) {
            throw new InternalServerErrorException('Error creating FAQ', error.message);
        }
    }

    async findAll(): Promise<Faq[]> {
        try {
            return await this.faqRepository.find();

        } catch (error: any) {
            throw new InternalServerErrorException('Error retrieving FAQs', error.message);
        }
    }

    async findOne(id: string): Promise<Faq> {
        try {
            const faq = await this.faqRepository.findOneBy({ id });
            if (!faq) {
                throw new NotFoundException(`FAQ with ID ${id} not found`);
            }
            return faq;
        } catch (error: any) {
            throw error
        }
    }

    async update(id: string, updateFaqDto: UpdateFaqDto): Promise<{ message: string, data: Faq }> {
        try {
            const faq = await this.findOne(id); // This will throw if not found
            Object.assign(faq, updateFaqDto);
            const result = await this.faqRepository.save(faq);
            return { message: 'FAQ Updated successfully', data: result };

        } catch (error: any) {
            if (error instanceof NotFoundException) {
                throw error; // Re-throw the not found exception
            }
            throw new InternalServerErrorException('Error updating FAQ', error.message);
        }
    }

    async remove(id: string): Promise<{ message: string }> {
        try {
            const faq = await this.findOne(id); // This will throw if not found
            await this.faqRepository.delete(faq.id);
            return { message: 'FAQ deleted successfully' };
        } catch (error: any) {
            if (error instanceof NotFoundException) {
                throw error; // Re-throw the not found exception
            }
            throw new InternalServerErrorException('Error deleting FAQ', error.message);
        }
    }
}
// Privacy policy

@Injectable()
export class PrivacyPolicyService {
    constructor(
        @InjectRepository(PrivacyPolicy)
        private privacyPolicyRepository: Repository<PrivacyPolicy>
    ) { }

    async create(createPrivacyPolicyDto: CreatePrivacyPolicyDto): Promise<{ message: string; data: PrivacyPolicy }> {
        try {
            const privacyPolicy = this.privacyPolicyRepository.create(createPrivacyPolicyDto);
            const savedPolicy = await this.privacyPolicyRepository.save(privacyPolicy);
            return { message: 'Privacy Policy created successfully', data: savedPolicy };
        } catch (error: any) {
            throw new InternalServerErrorException('Error creating privacy policy', error.message);
        }
    }

    async findAll(): Promise<PrivacyPolicy[]> {
        try {
            return await this.privacyPolicyRepository.find();
        } catch (error: any) {
            throw new InternalServerErrorException('Error retrieving privacy policies', error.message);
        }
    }

    async findOne(id: string): Promise<PrivacyPolicy> {
        try {
            const privacyPolicy = await this.privacyPolicyRepository.findOneBy({ id });
            if (!privacyPolicy) {
                throw new NotFoundException(`Privacy Policy with ID ${id} not found`);
            }
            return privacyPolicy;
        } catch (error: any) {
            throw new InternalServerErrorException('Error retrieving the privacy policy', error.message);
        }
    }

    async update(id: string, updatePrivacyPolicyDto: CreatePrivacyPolicyDto): Promise<{ message: string; data: PrivacyPolicy }> {
        try {
            const privacyPolicy = await this.findOne(id); // This will throw if not found

            // Merge and save updated privacy policy
            const updatedPolicy = this.privacyPolicyRepository.merge(privacyPolicy, updatePrivacyPolicyDto);
            const result = await this.privacyPolicyRepository.save(updatedPolicy);

            return { message: 'Privacy Policy updated successfully', data: result };
        } catch (error: any) {
            if (error instanceof NotFoundException) {
                throw error; // Re-throw the not found exception
            }
            throw new InternalServerErrorException('Error updating privacy policy', error.message);
        }
    }

    async remove(id: string): Promise<{ message: string }> {
        try {
            const privacyPolicy = await this.findOne(id); // This will throw if not found
            await this.privacyPolicyRepository.delete(privacyPolicy.id);
            return { message: 'content deleted successfully' };
        } catch (error: any) {
            throw new InternalServerErrorException('Error deleting privacy policy', error.message);
        }
    }
}

// term And Condition

@Injectable()
export class TermsConditionsService {
    constructor(
        @InjectRepository(TermsConditions)
        private termsConditionsRepository: Repository<TermsConditions>
    ) { }

    async getOrShow(): Promise<TermsConditions | null> {
        try {
            // Use `find` with `take: 1` to get the first Terms and Conditions entry
            const [termsConditions] = await this.termsConditionsRepository.find({
                take: 1,
                order: { id: 'ASC' } // Adjust ordering if necessary
            });

            return termsConditions || null; // Return null if no entry is found
        } catch (error: any) {
            throw new InternalServerErrorException('Error retrieving terms and conditions', error.message);
        }
    }


    async createOrUpdate(createTermsConditionsDto: CreateTermsConditionsDto): Promise<{ message: string; data: TermsConditions }> {
        try {
            // Use `find` with `take: 1` to get the first Terms and Conditions entry
            const [termsConditions] = await this.termsConditionsRepository.find({
                take: 1,
                order: { id: 'ASC' } // Adjust ordering if necessary
            });

            if (termsConditions) {
                // Update existing Terms and Conditions
                const updatedTerms = this.termsConditionsRepository.merge(termsConditions, createTermsConditionsDto);
                const result = await this.termsConditionsRepository.save(updatedTerms);
                return { message: 'Terms and Conditions updated successfully', data: result };
            } else {
                // Create new Terms and Conditions if none exists
                const newTerms = this.termsConditionsRepository.create(createTermsConditionsDto);
                const result = await this.termsConditionsRepository.save(newTerms);
                return { message: 'Terms and Conditions created successfully', data: result };
            }
        } catch (error: any) {
            throw new InternalServerErrorException('Error creating or updating terms and conditions', error.message);
        }
    }
}

// Contact as

@Injectable()
export class ContactUsService {
    constructor(
        @InjectRepository(ContactUs)
        private contactRepository: Repository<ContactUs>
    ) { }

    async getOrShow(): Promise<ContactUs | null> {
        try {
            // Use `find` with `take: 1` to get the first Terms and Conditions entry
            const [contactUs] = await this.contactRepository.find({
                take: 1,
                order: { id: 'ASC' } // Adjust ordering if necessary
            });

            return contactUs || null; // Return null if no entry is found
        } catch (error: any) {
            throw new InternalServerErrorException('Error retrieving contact', error.message);
        }
    }


    async createOrUpdate(createContactDto: CreateContactDto): Promise<{ message: string; data: ContactUs }> {
        try {
            // Use `find` with `take: 1` to get the first contact entry
            const [contactUs] = await this.contactRepository.find({
                take: 1,
                order: { id: 'ASC' } // Adjust ordering if necessary
            });

            if (contactUs) {
                // Update existing contact
                const update = this.contactRepository.merge(contactUs, createContactDto);
                const result = await this.contactRepository.save(update);
                return { message: 'contact updated successfully', data: result };
            } else {
                // Create new contact if none exists
                const newContact = this.contactRepository.create(createContactDto);
                const result = await this.contactRepository.save(newContact);
                return { message: 'contact created successfully', data: result };
            }
        } catch (error: any) {
            throw new InternalServerErrorException('Error creating or updating contact', error.message);
        }
    }
}


@Injectable()
export class BannerService {
    constructor(
        @InjectRepository(Banner)
        private bannerRepository: Repository<Banner>,
        private firebaseService: FirebaseService
    ) { }

    async createBannerWithImages(
        bannerImages: Express.Multer.File[],
        createBannerDto: CreateBannerDto
    ): Promise<Banner> {
        const imageUrls: string[] = []; // Array to hold uploaded image URLs

        for (const file of bannerImages) {
            const filePath = `banners/${Date.now()}-${file.originalname}`;
            const imageUrl = await this.firebaseService.uploadFile(filePath, file.buffer);
            imageUrls.push(imageUrl); // Collect the uploaded image URL
        }

        const newBanner = this.bannerRepository.create({
            name: createBannerDto.name,
            BannerImages: imageUrls, // Store all uploaded image URLs in the banner
        });

        return await this.bannerRepository.save(newBanner); // Save the new banner entity
    }

    async updateBannerImages(
        bannerId: string, newBannerImages: Express.Multer.File[], updateBannerDto: UpdateBannerDto): Promise<Banner> {
        // Find the existing banner
        const banner = await this.bannerRepository.findOne({ where: { id: bannerId } });
        if (!banner) {
            throw new NotFoundException('Banner not found');
        }

        // Delete all old images from Firebase if they exist
        if (banner.BannerImages && banner.BannerImages.length > 0) {
            await this.firebaseService.deleteImage(banner.BannerImages);
        }

        // Upload new BannerImages if provided, otherwise clear the BannerImages array
        let newImageUrls: string[] = [];
        if (newBannerImages && newBannerImages.length > 0) {
            newImageUrls = await Promise.all(
                newBannerImages.map(async (file) => {
                    const filePath = `banners/${Date.now()}-${file.originalname}`;
                    return await this.firebaseService.uploadFile(filePath, file.buffer);
                })
            );
        }

        // Update the name and BannerImages array
        banner.name = updateBannerDto.name || banner.name;
        // Update the banner entity with the new image URLs (or empty array)
        banner.BannerImages = newImageUrls;

        // Save the updated banner entity
        return await this.bannerRepository.save(banner);
    }

    // Get all banners
    async getAllBanners(): Promise<Banner[]> {
        return await this.bannerRepository.find();
    }

    // Get a specific banner by ID
    async getBannerById(bannerId: string): Promise<Banner> {
        const banner = await this.bannerRepository.findOne({ where: { id: bannerId } });
        if (!banner) {
            throw new NotFoundException('Banner not found');
        }
        return banner;
    }

    async deleteBanner(bannerId: string): Promise<{ message: string }> {
        // Find the banner by ID
        const banner = await this.bannerRepository.findOne({ where: { id: bannerId } });
        if (!banner) {
            throw new NotFoundException('Banner not found');
        }

        // Check if the banner has associated images and delete them from Firebase Storage
        if (banner.BannerImages && banner.BannerImages.length > 0) {
            try {
                await this.firebaseService.deleteImage(banner.BannerImages);

            } catch (error) {

                throw new Error('Failed to delete associated images from Firebase');
            }
        }
        // Finally, delete the banner from the database
        await this.bannerRepository.delete(bannerId);
        // Return a success message
        return { message: `Banner image has been deleted successfully.` }

    }
}

@Injectable()
export class SyncControlSettingsService {
  constructor(
    @InjectRepository(SyncControlSettings)
    private readonly repository: Repository<SyncControlSettings>,
  ) {}

  async createOrUpdate(dto: UpdateSyncControlSettingsDto): Promise<SyncControlSettings> {
    const { moduleName, isAutoSyncEnabled, isManualSyncEnabled } = dto;

    let setting = await this.repository.findOne({ where: { moduleName } });
    if (!setting) {
      setting = this.repository.create({ moduleName, isAutoSyncEnabled, isManualSyncEnabled });
    } else {
      setting.isAutoSyncEnabled = isAutoSyncEnabled;
      setting.isManualSyncEnabled = isManualSyncEnabled;
    }

    return this.repository.save(setting);
  }

  async findAll(): Promise<SyncControlSettings[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<SyncControlSettings> {
    const setting = await this.repository.findOne({ where: { id } });
    if (!setting) {
      throw new NotFoundException('Sync setting not found');
    }
    return setting;
  }

  async delete(id: number): Promise<void> {
    const setting = await this.findById(id);
    await this.repository.remove(setting);
  }
}


@Injectable()
export class TallySettingsService {
  constructor(
    @InjectRepository(TallySettings)
    private readonly repository: Repository<TallySettings>,
  ) {}

  async createOrUpdate(dto: UpdateTallySettingsDto): Promise<TallySettings> {
    const { name, value } = dto;

    let setting = await this.repository.findOne({ where: { name } });
    if (!setting) {
      setting = this.repository.create({ name, value });
    } else {
      setting.value = value ?? setting.value;
    }

    return this.repository.save(setting);
  }

  async findAll(): Promise<TallySettings[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<TallySettings> {
    const setting = await this.repository.findOne({ where: { id } });
    if (!setting) {
      throw new NotFoundException('Tally setting not found');
    }
    return setting;
  }

  async delete(id: string): Promise<void> {
    const setting = await this.findById(id);
    await this.repository.remove(setting);
  }
}

