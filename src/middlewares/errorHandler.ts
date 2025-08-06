import { Prisma } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { StructError } from 'superstruct';

type HandledError = Prisma.PrismaClientValidationError | Prisma.PrismaClientKnownRequestError | StructError | Error;

export default function errorHandler(e: HandledError, req: Request, res: Response, next: NextFunction) {
	if (
		e instanceof Prisma.PrismaClientValidationError ||
		e instanceof StructError
	) {
		res.status(400).send({ message: e.message });
	} else if (
		e instanceof Prisma.PrismaClientKnownRequestError &&
		e.code === 'P2025'
	) {
		res.status(404).send({ message: "Not Found" });
	} else {
		res.status(500).send({ message: e.message });
	}
}