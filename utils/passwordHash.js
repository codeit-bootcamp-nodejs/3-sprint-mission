import bcrypt from "bcryptjs";

const hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
}

const verifyPassword = (password, hash) => {
    if (!bcrypt.compareSync(password, hash)) { // boolean
        const error = new Error('Unauthorized')
        error.code = 401
        throw error
    }
}

export { hashPassword, verifyPassword }