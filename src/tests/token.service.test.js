const tokenService = require('../services/token.service');
const jwt = require('jsonwebtoken');
const moment = require('moment');

jest.mock('jsonwebtoken',() =>{
    return {
        sign: jest.fn()
    }
});

jest.mock('moment', () => {
    return jest.fn(() => ({
        add: jest.fn().mockReturnThis(), 
        unix: jest.fn().mockReturnValue(1234567890), 
        toDate: jest.fn().mockReturnValue(new Date(2025, 1, 2)),
    }));
});

describe("Token Service", () => {

    describe("generateToken", () => {
        it("should generate a token", async () => {
            const userId = 1234;
            const expires = moment().add(1, 'day');
            const type = "access";
            const secret = "mySecret";

            const expectedPayload = {
                sub: userId,
                iat: expect.any(Number),
                exp: expires.unix(),
                type
            };

            jwt.sign.mockReturnValue("token");

            const result = tokenService.generateToken(userId, expires, type, secret);

            expect(result).toBe("token");
            expect(jwt.sign).toHaveBeenCalledWith(expectedPayload, secret);
        });
    });

    describe("generateAuthTokens", () => {
        it('should generate auth tokens', async () => {
            const userId = 1234;
            const accessToken = 'token';
            const accessTokenExpiry = moment().add(1, 'hour');
            const expectedExpires = accessTokenExpiry.toDate(); 
        
            // Mock jwt.sign to return the fixed token
            jest.mock('jsonwebtoken', () => ({
                sign: jest.fn(() => accessToken),
            }));
        
            const result = await tokenService.generateAuthTokens(userId);

            expect(result.access.token).toBe(accessToken);
            expect(result.access.expires).toEqual(expectedExpires);
        });
        
    });
})