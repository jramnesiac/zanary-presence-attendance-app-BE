import { body, validationResult } from 'express-validator';

export const registerValidator = async (req, res, next) => {
    try {
        await body('fullname').notEmpty().withMessage("Your full name is required here!").run(req);
        await body('birthdate')
            .notEmpty().withMessage("Could you please tell us your birthdate?")
            .isDate().withMessage("Hey, that doesn't look like a valid date!");
        await body('phone')
            .notEmpty().withMessage("A phone number is a must-have here!")
            .isMobilePhone().withMessage("Hmm, that phone number doesn't seem right. Can you check again?")
            .run(req);
        await body('password')
            .notEmpty().withMessage("Without a password, how will you keep your account safe?")
            .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage("Your password needs to be tougher! Add some complexity!")
            .run(req);
        await body('confirmPassword')
            .notEmpty().withMessage("We need to make sure your password's just right. Please confirm it!")
            .equals(req.body.password).withMessage("Oh no, the passwords don't align. Try once more?")
            .run(req);

        const validation = validationResult(req);

        if (validation.isEmpty()) {
            next();
        } else {
            return res.status(400).send({
                status: false,
                message: "Oops! Something's not quite right with the validation. Can you double-check?",
                error: validation.array()
            });
        }
    } catch (err) {
        res.status(400).send(err);
    }
};

export const loginValidator = async (req, res, next) => {
    try {
        await body('email')
            .notEmpty().withMessage("We need your email address to continue")
            .isEmail().withMessage("That doesn't look like an email address")
            .run(req);
        await body('password')
            .notEmpty().withMessage("Don't forget your password!")
            .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage("That password doesn't seem secure enough")
            .run(req);

        const validation = validationResult(req);

        if (validation.isEmpty()) {
            next();
        } else {
            return res.status(400).send({
                status: false,
                message: "Hmm, something's off with the details you entered. Could you please check them again?",
                error: validation.array()
            });
        }
    } catch (error) {
        res.status(400).send(error);
    }
};


export const adduserValidator = async (req, res, next) => {
    try {
        await body('email')
            .notEmpty().withMessage("Email field must not be left blank")
            .isEmail().withMessage("This doesn't seem like a valid email address")
            .run(req);

        const validation = validationResult(req);

        if (validation.isEmpty()) {
            next();
        } else {
            return res.status(400).send({
                status: false,
                message: "Something's not quite right with the information you provided. Please check and try again.",
                error: validation.array()
            });
        }
    } catch (error) {
        res.status(400).send(error);
    }
};

