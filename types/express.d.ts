import express from 'express'

declare global {
    namespace Express {
        interface Request {
            body: {
                email?: string,
                password?: string
            },
            cookies: {
                refreshToken?: string
            }
            user?: {
                userId: number
            },
            auth?: {
                userId: number
            },
        }
    }
}

export interface Message {
    message: string
}