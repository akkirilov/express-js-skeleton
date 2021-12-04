const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findByUsername(username) {
    if (!username)
        return null;
    
    let user = await prisma.user.findUnique({
            where: {
                username: username
            }
        }).finally(async () => {
            await prisma.$disconnect()
        });
    return user;
}

async function findById(id) {
    if (!id)
        return null;
    
    let user = await prisma.user.findUnique({
            where: {
                id: id
            }
        }).finally(async () => {
            await prisma.$disconnect()
        });
    return user;
}

async function create(user) {
    if (!user)
        return null;
        
    let newUser = await prisma.user.create({
            data: user
        }).finally(async () => {
            await prisma.$disconnect()
        });
    return newUser;
}

async function drop(id) {
    if (!id)
        return null;

    let user = await prisma.user.delete({
            where: {
                id: id,
            }
        }).finally(async () => {
            await prisma.$disconnect()
        });

    return user;
}

async function update(id, data) {
    if (!id)
        return null;

    data.updatedAt = new Date().toISOString().slice(0, 19).toString() + '.000Z';
    let user = await prisma.user.update({
            where: {
                id: id
            },
            data: data
        }).finally(async () => {
            await prisma.$disconnect()
        });

    return user;
}

module.exports = { findByUsername,
                   findById,
                   create,
                   drop,
                   update }
