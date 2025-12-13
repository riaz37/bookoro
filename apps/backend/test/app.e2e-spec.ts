import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { MailService } from './../src/mail/mail.service';

// Set JWT_SECRET BEFORE module compilation
process.env.JWT_SECRET = 'test-secret-key';

describe('Bookoro App (e2e)', () => {
    let app: INestApplication;
    let authToken: string;
    let userId: string;
    let flightId: string;
    let bookingId: string;

    const mockMailService = {
        sendVerificationEmail: jest.fn().mockResolvedValue(true),
        sendOtpEmail: jest.fn().mockResolvedValue(true),
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

        // 1. Create a Seed Flight
        const flightRes = await request(app.getHttpServer())
            .post('/flights')
            .send({
                origin: 'Test Origin',
                destination: 'Test Dest',
                departureTime: new Date().toISOString(),
                arrivalTime: new Date().toISOString(),
                price: 100,
                seats: 5,
            });
        flightId = flightRes.body.id;
    }, 30000);

    afterAll(async () => {
        await app.close();
    });

    describe('Auth Flow', () => {
        const email = `test.user.${Date.now()}@example.com`;
        const password = 'SecurePass123';
        let verificationToken: string;

        it('/auth/signup (POST) should register and trigger email', async () => {
            const res = await request(app.getHttpServer())
                .post('/auth/signup')
                .send({
                    email,
                    password,
                    name: 'Test User'
                })
                .expect(201);

            expect(res.body.user).toBeDefined();
            // Verification token is not returned in response body for security
            // expect(res.body.user.verificationToken).toBeDefined(); 

            // Should call sendOtpEmail instead of sendVerificationEmail
            expect(mockMailService.sendOtpEmail).toHaveBeenCalled();

            // Capture the OTP from the mock call arguments
            // sendOtpEmail(name, email, otp)
            const sendOtpCall = mockMailService.sendOtpEmail.mock.calls[0];
            expect(sendOtpCall[1]).toBe(email);
            verificationToken = sendOtpCall[2]; // Capture the OTP

            userId = res.body.user.id;
        });

        it('/auth/verify (POST) should verify email', async () => {
            await request(app.getHttpServer())
                .post('/auth/verify')
                .send({ email, otp: verificationToken })
                .expect(201);
        });

        it('/auth/login (POST) should return access and refresh tokens', async () => {
            const res = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email, password })
                .expect(201);

            expect(res.body.access_token).toBeDefined();
            expect(res.body.refresh_token).toBeDefined();
            authToken = res.body.access_token;
        });
    });

    describe('Flight Search', () => {
        it('/flights (GET) with filters', async () => {
            await request(app.getHttpServer())
                .get('/flights')
                .query({ origin: 'Test Origin' })
                .expect(200)
                .expect((res: any) => {
                    expect(res.body.length).toBeGreaterThan(0);
                    expect(res.body[0].origin).toBe('Test Origin');
                });
        });
    });

    describe('Booking Flow', () => {
        it('/bookings (POST) should create booking and decrement seats', async () => {
            const res = await request(app.getHttpServer())
                .post('/bookings')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ flightId })
                .expect(201);

            bookingId = res.body.id;
            expect(mockMailService.sendBookingConfirmation).toHaveBeenCalled();

            // Check seats decremented
            const flight = await request(app.getHttpServer()).get('/flights').expect(200);
            const targetFlight = flight.body.find((f: any) => f.id === flightId);
            expect(targetFlight.availableSeats).toBe(4);
        });

        it('/bookings/me (GET) should retrieve user bookings', async () => {
            const res = await request(app.getHttpServer())
                .get('/bookings/me')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
            expect(res.body[0].id).toBe(bookingId);
        });

        it('/bookings/:id (DELETE) should cancel booking and restore seats', async () => {
            await request(app.getHttpServer())
                .delete(`/bookings/${bookingId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            // Verify status is Cancelled
            const myBookings = await request(app.getHttpServer())
                .get('/bookings/me')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            const myBooking = myBookings.body.find((b: any) => b.id === bookingId);
            expect(myBooking.status).toBe('CANCELLED');

            // Verify seats restored
            const flight = await request(app.getHttpServer()).get('/flights').expect(200);
            const targetFlight = flight.body.find((f: any) => f.id === flightId);
            expect(targetFlight.availableSeats).toBe(5);
        });
    });
});
