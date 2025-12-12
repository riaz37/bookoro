import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        const connectionString = process.env.DATABASE_URL;
        const pool = new Pool({
            connectionString,
            // Increase connection timeout for Neon serverless
            connectionTimeoutMillis: 10000,
            idleTimeoutMillis: 30000,
        });
        const adapter = new PrismaPg(pool);
        super({
            adapter,
            transactionOptions: {
                maxWait: 10000, // 10 seconds max wait for transaction
                timeout: 30000, // 30 seconds transaction timeout
            }
        });
    }

    async onModuleInit() {
        await this.$connect();
    }
}
