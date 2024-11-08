export interface User {
    id?: number;
    email: String;
    username: String;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
    googleID?: string;

    avatar?: string;
    businessName?: string;
    phoneNumber?: string;
    roles?: string[];
    active?: boolean;

    refreshToken?: string[];
    accessToken?: string[];
    githubToken?: string[];
    googleToken?: string[];
}
