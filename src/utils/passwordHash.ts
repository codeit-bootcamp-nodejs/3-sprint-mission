import bcrypt from "bcryptjs";

const hashPassword = (password: string): string => {
    return bcrypt.hashSync(password, 10);
}

const verifyPassword = (password: string, hash:string): void => {
    if (!bcrypt.compareSync(password, hash)) { // boolean
        const error = new Error('Unauthorized')
        error.code = 401
        throw error
    }
}

export { hashPassword, verifyPassword }