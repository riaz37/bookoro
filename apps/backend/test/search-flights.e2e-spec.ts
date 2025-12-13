import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Flight Search (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    const uniqueOrigin = `Origin_${Date.now()}`;
    const uniqueDest = `Dest_${Date.now()}`;

    const flightData = {
        origin: uniqueOrigin,
        destination: uniqueDest,
        departureTime: new Date(Date.now() + 86400000).toISOString(),
        arrivalTime: new Date(Date.now() + 86400000 + 7200000).toISOString(),
        price: 300,
        seats: 50,
    };

    it('should create a flight and then find it by origin', async () => {
        // 1. Create Flight
        await request(app.getHttpServer())
            .post('/flights')
            .send(flightData)
            .expect(201);

        // 2. Search by Origin
        const response = await request(app.getHttpServer())
            .get(`/flights?origin=${uniqueOrigin}`)
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body[0].origin).toEqual(uniqueOrigin);
        expect(response.body[0].destination).toEqual(uniqueDest);
    });

    it('should return empty list when no flights match filter', async () => {
        const response = await request(app.getHttpServer())
            .get(`/flights?origin=NonExistentPlace_${Date.now()}`)
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
    });
});
