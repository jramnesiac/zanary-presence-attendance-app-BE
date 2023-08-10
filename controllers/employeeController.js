import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getEmployee = async (req, res) => {
    try {
        const page = +req.query.page || 1;
        const limit = +req.query.limit || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search;
        const sort = req.query.sort || "ASC";
        const sortBy = req.query.sort || "firstName";
        const condition = {
            isDeleted: false,
            isSuspended: false,
            isAdmin: false,
        };

        if (search) {
            // Modify the condition to support the search functionality in Prisma
        }

        const isAdmin = await prisma.user.findUnique({
            where: {
                id: req.user.id,
            },
        });
        
        if (!isAdmin.isAdmin) throw { message: "Only admin have access"};

        const result = await prisma.user.findMany({
            select: { /* Exclude fields here as needed */ },
            take: limit,
            skip: offset,
            orderBy: {
                [sortBy]: sort,
            },
            where: condition,
            include: { role: true },
        });

        const count = await prisma.user.count({ where: condition });

        res.status(200).send({
            totalPage: Math.ceil(count / limit),
            currentPage: page,
            totalUser: count,
            result,
        });
    } catch (error) {
        res.status(400).send(error);
    }
};

export const getRole = async (req, res) => {
    try {
        const result = await prisma.role.findMany();
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};

export const changePic = async (req, res) => {
    try {
        if (req.file == undefined) {
            throw { message: "Image should not be empty" };
        }
        
        const result = await prisma.user.update({
            where: {
                id: req.user.id,
            },
            data: {
                imgProfile: req.file.filename,
            },
        });

        res.status(200).send({ result, message: "Upload success" });
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }
};
