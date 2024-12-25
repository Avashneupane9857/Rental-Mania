// custom.d.ts

declare namespace Express {
    interface Request {
        userId?: string;
        email?: string;
    }
}
