import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding flights...');

    const flights = [
        {
            origin: 'JFK',
            destination: 'LHR',
            departureTime: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            arrivalTime: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000), // +7 hours
            price: 450.00,
            seats: 200,
            availableSeats: 180,
        },
        {
            origin: 'LHR',
            destination: 'JFK',
            departureTime: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
            price: 480.50,
            seats: 200,
            availableSeats: 150,
        },
        {
            origin: 'DXB',
            destination: 'CDG',
            departureTime: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000 + 30 * 60 * 1000),
            price: 350.00,
            seats: 300,
            availableSeats: 290,
        },
        {
            origin: 'CDG',
            destination: 'DXB',
            departureTime: new Date(new Date().getTime() + 12 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 12 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000),
            price: 360.00,
            seats: 300,
            availableSeats: 200,
        },
        {
            origin: 'HND',
            destination: 'SFO',
            departureTime: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000),
            price: 950.00,
            seats: 250,
            availableSeats: 20,
        },
        {
            origin: 'SFO',
            destination: 'HND',
            departureTime: new Date(new Date().getTime() + 20 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 20 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000),
            price: 920.00,
            seats: 250,
            availableSeats: 250,
        },
        {
            origin: 'LAX',
            destination: 'SYD',
            departureTime: new Date(new Date().getTime() + 25 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 25 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000),
            price: 1200.00,
            seats: 350,
            availableSeats: 300,
        },
        {
            origin: 'SYD',
            destination: 'LAX',
            departureTime: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),
            price: 1150.00,
            seats: 350,
            availableSeats: 340,
        },
        {
            origin: 'JFK',
            destination: 'MIA',
            departureTime: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
            price: 120.00,
            seats: 150,
            availableSeats: 50,
        },
        {
            origin: 'MIA',
            destination: 'RIO',
            departureTime: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
            price: 600.00,
            seats: 180,
            availableSeats: 180,
        },
    ];

    for (const flight of flights) {
        await prisma.flight.create({
            data: flight,
        });
    }

    console.log(`Seeded ${flights.length} flights.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
