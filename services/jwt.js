import jwt from 'jwt-simple';
import moment from 'moment';

const secret = 'SECRET_KEY_PrUeBa';

const createToken = (user) => {
    const payload = {
        userId: user._id,
        role: user.role,
        name: user.name,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    return jwt.encode(payload, secret);
};

export { secret, createToken };