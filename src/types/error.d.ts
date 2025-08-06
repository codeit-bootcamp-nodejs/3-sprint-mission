// export {};
import Express from 'express'

declare global {
  interface Error {
    code?: number;
    status?: number;
    data?: object;
  }
}

// interface CustomError extends Error {
//   code?: string;
//   status?: number;
//   response?: {
//     status: number;
//     data: any;
//   }
// }