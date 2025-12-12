import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { MailService } from '../src/mail/mail.service';

// Set JWT_SECRET before module compilation
process.env.JWT_SECRET = 'test-secret-key';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    const email = `test${Date.now()}@example.com`;
    const password = 'SecurePass123';
    let verificationToken: string;

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
    }, 30000);

    afterAll(async () => {
        await app.close();
    });

    it('/auth/signup (POST) - success', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email, password, name: 'Test User' })
            .expect(201);

        expect(res.body).toHaveProperty('user');
        expect(res.body.user).toHaveProperty('verificationToken');
        verificationToken = res.body.user.verificationToken;
    });

    it('/auth/verify (GET) - verify email', () => {
        return request(app.getHttpServer())
            .get(`/auth/verify?token=${verificationToken}`)
            .expect(200);
    });

    it('/auth/login (POST) - success', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ email, password })
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('access_token');
            });
    });

    it('/auth/login (POST) - failure', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ email, password: 'wrongpassword' })
            .expect(401);
    });
});
