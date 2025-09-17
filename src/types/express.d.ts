import express from 'express'

declare global {
    namespace Express {
        interface Request {
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