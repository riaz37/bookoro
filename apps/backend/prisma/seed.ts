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
    console.log('🌍 Seeding flights...');

    const flights = [
        // North America ↔ Europe
        {
            origin: 'New York (JFK)',
            destination: 'London (LHR)',
            departureTime: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000),
            price: 450.00,
            seats: 200,
            availableSeats: 180,
        },
        {
            origin: 'London (LHR)',
            destination: 'New York (JFK)',
            departureTime: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
            price: 480.50,
            seats: 200,
            availableSeats: 150,
        },
        {
            origin: 'Los Angeles (LAX)',
            destination: 'Paris (CDG)',
            departureTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000),
            price: 650.00,
            seats: 280,
            availableSeats: 200,
        },
        {
            origin: 'Paris (CDG)',
            destination: 'Los Angeles (LAX)',
            departureTime: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000 + 11 * 60 * 60 * 1000 + 30 * 60 * 1000),
            price: 620.00,
            seats: 280,
            availableSeats: 250,
        },

        // Middle East ↔ Europe
        {
            origin: 'Dubai (DXB)',
            destination: 'Paris (CDG)',
            departureTime: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000 + 30 * 60 * 1000),
            price: 350.00,
            seats: 300,
            availableSeats: 290,
        },
        {
            origin: 'Paris (CDG)',
            destination: 'Dubai (DXB)',
            departureTime: new Date(new Date().getTime() + 12 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 12 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000),
            price: 360.00,
            seats: 300,
            availableSeats: 200,
        },

        // Asia ↔ North America
        {
            origin: 'Tokyo (HND)',
            destination: 'San Francisco (SFO)',
            departureTime: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000),
            price: 950.00,
            seats: 250,
            availableSeats: 20,
        },
        {
            origin: 'San Francisco (SFO)',
            destination: 'Tokyo (HND)',
            departureTime: new Date(new Date().getTime() + 20 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 20 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000),
            price: 920.00,
            seats: 250,
            availableSeats: 250,
        },
        {
            origin: 'Singapore (SIN)',
            destination: 'Los Angeles (LAX)',
            departureTime: new Date(new Date().getTime() + 18 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 18 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000),
            price: 1100.00,
            seats: 320,
            availableSeats: 280,
        },

        // Australia ↔ North America
        {
            origin: 'Los Angeles (LAX)',
            destination: 'Sydney (SYD)',
            departureTime: new Date(new Date().getTime() + 25 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 25 * 24 * 60 * 60 * 1000 + 15 * 60 * 60 * 1000),
            price: 1200.00,
            seats: 350,
            availableSeats: 300,
        },
        {
            origin: 'Sydney (SYD)',
            destination: 'Los Angeles (LAX)',
            departureTime: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),
            price: 1150.00,
            seats: 350,
            availableSeats: 340,
        },

        // Domestic US
        {
            origin: 'New York (JFK)',
            destination: 'Miami (MIA)',
            departureTime: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
            price: 120.00,
            seats: 150,
            availableSeats: 50,
        },
        {
            origin: 'Miami (MIA)',
            destination: 'New York (JFK)',
            departureTime: new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
            price: 130.00,
            seats: 150,
            availableSeats: 100,
        },
        {
            origin: 'San Francisco (SFO)',
            destination: 'Seattle (SEA)',
            departureTime: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
            price: 95.00,
            seats: 120,
            availableSeats: 80,
        },

        // South America
        {
            origin: 'Miami (MIA)',
            destination: 'Rio de Janeiro (GIG)',
            departureTime: new Date(new Date().getTime() + 8 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 8 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
            price: 600.00,
            seats: 180,
            availableSeats: 180,
        },
        {
            origin: 'Rio de Janeiro (GIG)',
            destination: 'Miami (MIA)',
            departureTime: new Date(new Date().getTime() + 16 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 16 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000 + 30 * 60 * 1000),
            price: 580.00,
            seats: 180,
            availableSeats: 120,
        },

        // Europe Internal
        {
            origin: 'London (LHR)',
            destination: 'Rome (FCO)',
            departureTime: new Date(new Date().getTime() + 9 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 9 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000 + 30 * 60 * 1000),
            price: 180.00,
            seats: 160,
            availableSeats: 140,
        },
        {
            origin: 'Rome (FCO)',
            destination: 'London (LHR)',
            departureTime: new Date(new Date().getTime() + 11 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 11 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000 + 45 * 60 * 1000),
            price: 190.00,
            seats: 160,
            availableSeats: 100,
        },

        // Asia Internal
        {
            origin: 'Tokyo (HND)',
            destination: 'Singapore (SIN)',
            departureTime: new Date(new Date().getTime() + 13 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 13 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000),
            price: 420.00,
            seats: 200,
            availableSeats: 150,
        },
        {
            origin: 'Singapore (SIN)',
            destination: 'Tokyo (HND)',
            departureTime: new Date(new Date().getTime() + 21 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 21 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000 + 45 * 60 * 1000),
            price: 410.00,
            seats: 200,
            availableSeats: 180,
        },

        // Africa ↔ Europe
        {
            origin: 'Cairo (CAI)',
            destination: 'London (LHR)',
            departureTime: new Date(new Date().getTime() + 11 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 11 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000 + 10 * 60 * 1000),
            price: 400.00,
            seats: 180,
            availableSeats: 150,
        },
        {
            origin: 'London (LHR)',
            destination: 'Cairo (CAI)',
            departureTime: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000),
            price: 390.00,
            seats: 180,
            availableSeats: 160,
        },

        // India ↔ Middle East
        {
            origin: 'Mumbai (BOM)',
            destination: 'Dubai (DXB)',
            departureTime: new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
            price: 250.00,
            seats: 220,
            availableSeats: 200,
        },
        {
            origin: 'Dubai (DXB)',
            destination: 'Mumbai (BOM)',
            departureTime: new Date(new Date().getTime() + 9 * 24 * 60 * 60 * 1000),
            arrivalTime: new Date(new Date().getTime() + 9 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 15 * 60 * 1000),
            price: 240.00,
            seats: 220,
            availableSeats: 190,
        },
    ];

    for (const flight of flights) {
        await prisma.flight.create({
            data: flight,
        });
    }

    console.log(`✅ Seeded ${flights.length} flights successfully!`);
    console.log('📍 Routes include:');
    console.log('   - North America ↔ Europe');
    console.log('   - Middle East ↔ Europe');
    console.log('   - Asia ↔ North America');
    console.log('   - Australia ↔ North America');
    console.log('   - Domestic US flights');
    console.log('   - South America connections');
    console.log('   - European internal flights');
    console.log('   - Asian internal flights');
    console.log('   - Africa ↔ Europe');
    console.log('   - India ↔ Middle East');

    // Create a sample verified user
    const sampleUser = {
        email: 'traveler@bookoro.com',
        name: 'Sample Traveler',
        password: await import('bcrypt').then(m => m.hash('Bookoro2025!', 10)),
        isVerified: true,
    };

    const existingUser = await prisma.user.findUnique({
        where: { email: sampleUser.email },
    });

    if (!existingUser) {
        await prisma.user.create({
            data: sampleUser,
        });
        console.log(`👤 Created sample user: ${sampleUser.email}`);
    } else {
        console.log(`👤 Sample user already exists: ${sampleUser.email}`);
    }
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
