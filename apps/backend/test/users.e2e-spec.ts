import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('UsersController (e2e)', () => {
    let app: INestApplication;
    const email = `test.user.${Date.now()}@example.com`;

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

    it('/users (POST) - create user', () => {
        return request(app.getHttpServer())
            .post('/users')
            .send({
                email,
                password: 'password123',
                name: 'Test User',
            })
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('id');
                expect(res.body.email).toEqual(email);
                expect(res.body).not.toHaveProperty('password');
            });
    });
});
