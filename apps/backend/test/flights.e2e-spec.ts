import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('FlightsController (e2e)', () => {
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

    const flightData = {
        origin: 'New York',
        destination: 'London',
        departureTime: new Date(Date.now() + 86400000).toISOString(),
        arrivalTime: new Date(Date.now() + 86400000 + 25200000).toISOString(),
        price: 500,
        seats: 100,
    };

    it('/flights (POST) - create flight', () => {
        return request(app.getHttpServer())
            .post('/flights')
            .send(flightData)
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('id');
                expect(res.body.origin).toEqual(flightData.origin);
            });
    });

    it('/flights (GET) - list flights', () => {
        return request(app.getHttpServer())
            .get('/flights')
            .expect(200)
            .expect((res) => {
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBeGreaterThan(0);
                const flight = res.body.find((f: any) => f.origin === flightData.origin && f.destination === flightData.destination);
                expect(flight).toBeDefined();
            });
    });
});
