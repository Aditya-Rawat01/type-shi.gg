import { atom } from "jotai";

export type cookieType = {
    session: {
        id: string;
        token: string;
        userId: string;
        expiresAt: Date;
        createdAt: Date;
        updatedAt: Date;
        ipAddress?: string | null | undefined | undefined;
        userAgent?: string | null | undefined | undefined;
    };
    user: {
    id: string;
    name: string;
    emailVerified: boolean;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null | undefined | undefined;
    }
} | null
export const userCookie = atom<cookieType>(null)