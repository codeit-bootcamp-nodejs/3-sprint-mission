import { Prisma } from '@prisma/client';

export default function errorHandler(e, req, res, next) {
	if (
		e instanceof Prisma.PrismaClientValidationError ||
		e.name === 'StructError'
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