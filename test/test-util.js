import { prismaClient } from "../src/application/database.js";
import bcrypt from "bcrypt";

export const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: "test"
        }
    });
};

export const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            username: "test",
            password: await bcrypt.hash("rahasia", 10),
            name: "test",
            token: "test"
        }
    });
};

export const getTestUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            username: "test"
        }
    });
};

export const removeAllTestProducts = async () => {
    await prismaClient.product.deleteMany({
        where: {
            username: 'test'
        }
    });
};

export const createTestProduct = async () => {
    await prismaClient.product.create({
        data: {
            username: "test",
            productName: "Test Product",
            description: "Test Description",
            price: 100.00,
            stock: 10,
            color: "Test Color",
            category: "Test Category"
        }
    });
};

export const createManyTestProducts = async () => {
    for (let i = 0; i < 15; i++) {
        await prismaClient.product.create({
            data: {
                username: `test`,
                productName: `Test Product ${i}`,
                description: `Test Description ${i}`,
                price: 50.00 + i,
                stock: 5 + i,
                color: `Test Color ${i}`,
                category: `Test Category ${i}`
            }
        });
    }
};

export const getTestProduct = async () => {
    return prismaClient.product.findFirst({
        where: {
            username: 'test'
        }
    });
};
