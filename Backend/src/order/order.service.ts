import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity, OrderStatus } from './order.entity';

import { CreateItemOrderDto, CreateOrderDto } from './order.dto';
import { ItemEntity } from './../fetch-products/item.entity';
import { OrderItemEntity } from './order.item.entity';
import { CartItemEntity } from './../cart/cart.entity';
import { DataSource, IsNull, Like, Repository } from 'typeorm';
import { generateInvoiceXML } from '../tally/invoice-xml-generator';
import axios from 'axios';
import { Invoice, InvoiceStatus } from './../invoice/invoice.entity';
import { EmailService } from './../service/email.service';
import { UserEntity } from './../user/users.entity';
import { AddressEntity } from './../addresses/addresses.entity';
import * as fs from 'fs';
import * as path from 'path';
import { FirebaseService } from './../service/firebase.service';
import { Cron } from '@nestjs/schedule';
import { TallySettings } from 'settings/setting.entity';


@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(AddressEntity)
        private readonly addressRepository: Repository<AddressEntity>,

        @InjectRepository(TallySettings)
        private readonly TallySettingsService: Repository<TallySettings>,

        @InjectRepository(ItemEntity)
        private readonly productRepository: Repository<ItemEntity>,
        @InjectRepository(OrderItemEntity)
        private readonly orderItemRepository: Repository<OrderItemEntity>,

        @InjectRepository(CartItemEntity)
        private readonly cartRepository: Repository<CartItemEntity>,

        @InjectRepository(Invoice)
        private readonly invoiceRepository: Repository<Invoice>,

        private firebaseService: FirebaseService, // Inject Firebase service

        private readonly dataSource: DataSource
    ) { }

    async getAllOrders(): Promise<OrderEntity[]> {
        return this.orderRepository.find({
            relations: ['address', 'user', 'orderItems.product'],
        });
    }

    async getMonthlyProductCounts(): Promise<Array<{ month: string; status: string; count: number }>> {
        // Fetch monthly data and group by month and status
        const monthlyData = await this.orderRepository
            .createQueryBuilder('order')
            .select("TO_CHAR(order.createdAt, 'YYYY-MM')", 'month')
            .addSelect('order.status', 'status')
            .addSelect('COUNT(order.id)', 'count')
            .where('order.status != :status', { status: OrderStatus.Cancelled }) // Exclude canceled orders
            .groupBy("TO_CHAR(order.createdAt, 'YYYY-MM'), order.status")
            .orderBy('month', 'ASC')
            .getRawMany();

        // Ensure the count is returned as a number
        return monthlyData.map((data) => ({
            month: data.month,
            status: data.status,
            count: Number(data.count),
        }));
    }


    async findAllCompleted(): Promise<OrderEntity[]> {
        return this.orderRepository.find({ where: { status: OrderStatus.SUCCESS } });
    }

    async createOrder(userId: string, createOrderDto: CreateOrderDto): Promise<OrderEntity> {
        const { addressId, totalPrice, totalQuantity, finalAmount, discount, delivery } = createOrderDto;

        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const address = await this.addressRepository.findOne({ where: { id: addressId } });
        if (!address) {
            throw new NotFoundException('Address not found');
        }

        // Generate a unique order number (e.g., #12345)
        const orderNo = await this.generateUniqueOrderNumber();

        const order = this.orderRepository.create({
            orderNo,
            user,
            address,
            totalPrice,
            discount,
            finalAmount,
            totalQuantity,
            delivery
        });


        return this.orderRepository.save(order);
    }
    // Helper function to generate a unique order number
    private async generateUniqueOrderNumber(): Promise<string> {
        try {
            // Get the current year
            const currentYear = new Date().getFullYear();

            // Retrieve the highest order number for the current year
            const lastOrder = await this.orderRepository.find({
                where: { orderNo: Like(`${currentYear}%`) },
                select: ['orderNo'],
                order: { orderNo: 'DESC' },
                take: 1,
            });

            let nextOrderNo: string;

            if (lastOrder.length > 0) {
                // Extract the numeric part of the last order number and increment it
                const lastSequentialNumber = parseInt(lastOrder[0].orderNo.slice(5), 10); // Extract the numeric part after the year and hyphen
                const nextSequentialNumber = lastSequentialNumber + 1;
                nextOrderNo = `${currentYear}-${nextSequentialNumber.toString().padStart(4, '0')}`; // Pad to 4 digits
            } else {
                // If no orders exist for the current year, start with 0001
                nextOrderNo = `${currentYear}-0001`;
            }

            // Return the formatted order number
            return nextOrderNo;
        } catch (error) {
            throw new InternalServerErrorException('Error generating unique order number');
        }
    }




    async getOrdersByUserId(userId: string): Promise<any> {

        const orders = await this.orderRepository.find({
            where: { user: { id: userId } },
            relations: ['address', 'user', 'orderItems.product'],
        });

        // Aggregate counts of orders by status using QueryBuilder
        const statusCounts = await this.orderRepository
            .createQueryBuilder('order')
            .select('order.status', 'status')
            .addSelect('COUNT(order.id)', 'count')
            .where('order.userId = :userId', { userId })
            .groupBy('order.status')
            .getRawMany();

        // Convert query result into an easy-to-use object
        const statusSummary = statusCounts.reduce((acc, { status, count }) => {
            acc[status] = parseInt(count, 10);
            return acc;
        }, {});

        const totalOrders = orders.length;

        // Fetch monthly data and group by month and status
        const monthlyData = await this.orderRepository
            .createQueryBuilder('order')
            .select("TO_CHAR(order.createdAt, 'YYYY-MM')", 'month')
            .addSelect('order.status', 'status')
            .addSelect('COUNT(order.id)', 'count')
            .where('order.userId = :userId', { userId })
            .groupBy("TO_CHAR(order.createdAt, 'YYYY-MM'), order.status")
            .orderBy('month', 'ASC')
            .getRawMany();

        // Transform the monthly data into an array format
        const monthlySummary = this.transformMonthlyData(monthlyData);

        return {
            orders,
            statusSummary: {
                totalOrders,
                pending: statusSummary[OrderStatus.PENDING] || 0,
                completed: statusSummary[OrderStatus.SUCCESS] || 0,
                cancelled: statusSummary[OrderStatus.Cancelled] || 0,
            },
            monthlyData: monthlySummary, // Include the monthly summary here
        };
    }


    private transformMonthlyData(
        data: { month: string; status: string; count: string }[]
    ): { month: string; total: number; pending: number; completed: number; cancelled: number }[] {
        // Define the type for the summary object
        const summary: Record<
            string,
            { month: string; total: number; pending: number; completed: number; cancelled: number }
        > = {};

        // Helper function to map database statuses to object keys
        const mapStatus = (status: string): 'pending' | 'completed' | 'cancelled' => {
            switch (status) {
                case OrderStatus.PENDING:
                    return 'pending';
                case OrderStatus.SUCCESS:
                    return 'completed';
                case OrderStatus.Cancelled:
                    return 'cancelled';
                default:
                    throw new Error(`Unknown status: ${status}`);
            }
        };

        // Group data by month and accumulate status counts and total orders
        data.forEach(({ month, status, count }) => {
            if (!summary[month]) {
                summary[month] = { month, total: 0, pending: 0, completed: 0, cancelled: 0 };
            }
            const key = mapStatus(status);
            const parsedCount = parseInt(count, 10);

            // Accumulate counts for each status and the total
            summary[month][key] += parsedCount;
            summary[month].total += parsedCount;
        });

        // Convert the summary object into an array
        return Object.values(summary);
    }





    async getOrderById(orderId: string): Promise<OrderEntity> {
        try {
            const order = await this.orderRepository.findOne({
                where: { id: orderId },
                relations: ['address', 'user', 'orderItems.product'],
            });
            if (!order) {
                throw new NotFoundException(`order  not found`);
            }
            return order;
        } catch (error: any) {
            throw error
        }
    }



    async deleteOrder(orderId: string): Promise<void> {
        const order = await this.orderRepository.findOne({ where: { id: orderId } });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        await this.orderRepository.remove(order);
    }

    async deleteMultiple(ids: string[]): Promise<{ message: string }> {
        const notFoundIds: string[] = [];

        for (const id of ids) {
            try {
                await this.deleteOrder(id);  // attempt to delete the order
            } catch (error) {
                notFoundIds.push(id);  // if an error occurs, track the not found ID
                continue;  // skip to the next ID
            }
        }
        if (notFoundIds.length > 0) {
            throw new NotFoundException(`orders with ids ${notFoundIds.join(', ')} not found`);
        }

        return { message: 'orders deleted successfully' };
    }


    // order item

    async addItemToOrder(createItemOrderDto: CreateItemOrderDto, adminState: string): Promise<OrderItemEntity[]> {
        const { orderId, products } = createItemOrderDto;

        // Find the order by orderId and load relations for User and Address
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['user', 'address'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        const savedOrderItems: OrderItemEntity[] = [];

        // Loop through each product in the list and add them to the order
        for (const productOrder of products) {
            const { productId, quantity } = productOrder;

            // Find the product by productId
            const product = await this.productRepository.findOne({ where: { id: productId } });
            if (!product) {
                throw new NotFoundException(`Product with ID ${productId} not found`);
            }

            // Create and save each OrderItem
            const orderItem = this.orderItemRepository.create({
                order,
                product,
                quantity,
            });
            const savedOrderItem = await this.orderItemRepository.save(orderItem);
            savedOrderItems.push(savedOrderItem);
        }
        // Clear the cart for this user once all items are added
        await this.cartRepository.delete({ userId: order.user.id });

        // Fetch Tally settings data
        const tallySettings = await this.TallySettingsService.find();
        if (!tallySettings || tallySettings.length === 0) {
            throw new NotFoundException('Tally settings not found');
        }
        // Attempt to post the invoice to Tally
        try {
            await this.postToTally(order, savedOrderItems, adminState,tallySettings);
            console.log('Invoice posted to Tally successfully');
        } catch (error) {
            console.error('Failed to post invoice to Tally:', error);
            // Log error and continue without blocking order creation
        }



        return savedOrderItems;
    }

    private async savePendingInvoice(order: OrderEntity, xmlContent: string): Promise<void> {
        const unsentInvoice = new Invoice();
        unsentInvoice.orderId = order.id;
        unsentInvoice.xmlContent = xmlContent;
        unsentInvoice.userId = order?.user?.id;
        unsentInvoice.status = InvoiceStatus.PENDING;
        await this.invoiceRepository.save(unsentInvoice);
    }

    async postToTally(order: OrderEntity, savedOrderItems: OrderItemEntity[], adminState: string | null , tallySettings : TallySettings[]): Promise<void> {
        const xml = generateInvoiceXML(order, savedOrderItems, adminState,tallySettings);
        let isInvoiceSaved = false;

        try {
            const response = await axios.post(process.env.TALLY_URL as string, xml, {
                headers: {
                    'Content-Type': 'application/xml',
                },
            });

            if (response.data.includes('<LINEERROR>')) {
                await this.savePendingInvoice(order, xml);
                isInvoiceSaved = true;
                throw new Error(`Failed to post invoice to Tally due to line error.`);
            }

        } catch (error) {
            console.log("General error during Tally posting");
            if (!isInvoiceSaved) {
                await this.savePendingInvoice(order, xml);
            }

            throw new Error('Failed to post invoice to Tally. It will be retried later.');
        }
    }


    async getAll(): Promise<OrderItemEntity[]> {
        const address = await this.orderItemRepository.find();
        return address
    }


    async deleteOrderItemById(orderItemId: string): Promise<{ message: string }> {
        // Find the order item by orderItemId
        const orderItem = await this.orderItemRepository.findOne({ where: { id: orderItemId } });

        if (!orderItem) {
            throw new NotFoundException('Order item not found');
        }
        // Delete the order item
        await this.orderItemRepository.delete(orderItemId);

        return { message: 'Order item deleted successfully' };
    }

    @Cron('0 * * * *') // hour
    async uploadAllInvoices(): Promise<void> {
        console.log('Complete log cleanup started:', new Date().toISOString());
        const localFolderPath = 'C:\\Tally\\Data\\Invoice'; // Local folder path
        const orderRepository = this.dataSource.getRepository(OrderEntity);

        try {
            // Fetch all orders where invoicePdf is null (i.e., orders without an invoice)
            const orders = await orderRepository.find({
                where: { invoicePdf: IsNull() }, // Check for orders without an invoice PDF
            });

            if (orders.length === 0) {
                console.log('No orders without an invoice PDF.');
                return;
            }

            // Iterate through all orders and upload their invoices if they exist
            for (const order of orders) {
                const pdfFileName = `${order.orderNo}.pdf`; // Generate PDF filename based on order number
                const pdfFilePath = path.join(localFolderPath, pdfFileName); // Create file path for local PDF file

                if (fs.existsSync(pdfFilePath)) {
                    // If the file exists, upload to Firebase
                    const firebaseUrl = await this.firebaseService.uploadFileToFirebase('invoices', pdfFilePath, pdfFileName);

                    // Save the Firebase URL in the database
                    order.invoicePdf = firebaseUrl;
                    await orderRepository.save(order);
                    console.log(`Invoice for order ${order.orderNo} uploaded successfully.`);
                } else {
                    // If the file does not exist, log a message
                    console.log(`PDF file ${pdfFileName} for order ${order.orderNo} does not exist.`);
                }
            }
        } catch (error) {
            console.error('Error uploading invoices:', error);
        }
    }
}