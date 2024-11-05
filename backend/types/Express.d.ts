declare namespace Express {
    interface Request {
        user?: {
            _id: string;
            firstName: string;
            lastName?: string;
            email: string;
            isEmailVerified: boolean;
            provider: string;
            roles: string[];
            googleID?: string;
            username: string;
            refreshToken: string[];
        };
    }
}
