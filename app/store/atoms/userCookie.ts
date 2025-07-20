import { atom } from "jotai";

export type cookieType = {
    session: {
        id: string;
        token: string;
        userId: string;
        expiresAt: string;
        createdAt: string;
        updatedAt: string;
        ipAddress?: string | null | undefined | undefined;
        userAgent?: string | null | undefined | undefined;
    };
    user: {
    id: string;
    name: string;
    emailVerified: boolean;
    email: string;
    createdAt: string;
    updatedAt: string;
    image?: string | null | undefined | undefined;
    }
}
export const initialCookieState: cookieType = {
    session: {
        id: '',
        token: '',
        userId: '',
        expiresAt: '',
        createdAt: '',
        updatedAt: ''
    },
    user: {
        id: '',
        name: '',
        emailVerified: false,
        email: '',
        createdAt: '',
        updatedAt: ''
    }
};

export const userCookie = atom<cookieType>(initialCookieState)