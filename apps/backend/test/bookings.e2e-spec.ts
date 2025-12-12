import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { MailService } from '../src/mail/mail.service';

// Set JWT_SECRET before importing AppModule
process.env.JWT_SECRET = 'test-secret-key';

describe('BookingsController (e2e)', () => {
    let app: INestApplication;
    let token: string;
    let flightId: string;
    const email = `bookings.test.${Date.now()}@example.com`;

    const mockMailService = {
        sendVerificationEmail: jest.fn().mockResolvedValue(true),
        sendBookingConfirmation: jest.fn().mockResolvedValue(true),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(MailService)
            .useValue(mockMailService)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        // Create a test flight (no auth required now)
        const flightRes = await request(app.getHttpServer())
            .post('/flights')
            .send({
                origin: 'NYC',
                destination: 'LA',
                departureTime: new Date().toISOString(),
                arrivalTime: new Date().toISOString(),
                price: 200,
                seats: 10,
            });
        flightId = flightRes.body.id;

        // Create and verify user
        const signupRes = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email, password: 'SecurePass123', name: 'Test User' });

        const verificationToken = signupRes.body.user.verificationToken;

        // Verify email
        await request(app.getHttpServer())
            .get(`/auth/verify?token=${verificationToken}`);

        // Login to get token
        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email, password: 'SecurePass123' });
        token = loginRes.body.access_token;
    }, 30000); // 30 second timeout

    afterAll(async () => {
        await app.close();
    });

    it('/bookings (POST) - create booking', async () => {
        const res = await request(app.getHttpServer())
            .post('/bookings')
            .set('Authorization', `Bearer ${token}`)
            .send({ flightId })
            .expect(201);

        expect(res.body).toHaveProperty('id');
        expect(res.body.flightId).toEqual(flightId);
    });

    it('/bookings (POST) - fail without auth', () => {
        return request(app.getHttpServer())
            .post('/bookings')
            .send({ flightId })
            .expect(401);
    });
});
