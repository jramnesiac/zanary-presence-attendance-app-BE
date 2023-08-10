import jwt from 'jsonwebtoken';

function verifyToken(req, res, next) {
    try {
        let token = req.headers.authorization;
        if (!token) throw { message: 'Authentication token is absent. Access denied!' };

        token = token.split(' ')[1];

        req.token = token;

        const verifiedUser = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verifiedUser;
        next();
    } catch (error) {
        res.status(400).send(error);
    }
}

export default verifyToken;
