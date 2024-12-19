// src/faq/entities/faq.entity.ts

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum FAQStatus {
    Active = 'Active',
    Inactive = 'Inactive',
}


@Entity('faqs')
export class Faq {
    @PrimaryGeneratedColumn('uuid') // Use UUID for unique ID
    id!: string;

    @Column()
    question!: string;

    @Column()
    answer!: string;

    @Column({ type: 'enum', enum: FAQStatus, default: FAQStatus.Active })
    status!: FAQStatus; // Status field

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}

@Entity('privacy_policies')
export class PrivacyPolicy {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('text')
    content!: string; // The content of the privacy policy

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}


@Entity('terms_conditions')
export class TermsConditions {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('text')
    content!: string; // The content of the terms and conditions

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

@Entity('contact_us')
export class ContactUs {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column('text')
    message!: string; // The message sent by the user

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

@Entity('banner')
export class Banner {
    @PrimaryGeneratedColumn('uuid')
    id!: string;


    @Column()
    name!: string;

    @Column('text', { array: true })
    BannerImages!: string[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

@Entity('sync_control_settings')
export class SyncControlSettings {
    @PrimaryGeneratedColumn('uuid')
    id!: number;

    @Column()
    moduleName!: string; // E.g., 'Products', 'Orders', etc.

    @Column({ default: false })
    isAutoSyncEnabled!: boolean; // Auto Sync status

    @Column({ default: false })
    isManualSyncEnabled!: boolean; // Manual Sync status
    
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}

@Entity('tally_settings')
export class TallySettings {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string; // Name of the ledger (e.g., "Central Tax Ledger")

  @Column({ nullable: true })
  value!: string; // Value of the ledger (default: empty)

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
