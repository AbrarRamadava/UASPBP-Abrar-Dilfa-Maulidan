// product-service.js
import { validate } from "../validation/validation.js";
import {
    createproductValidation,
    getproductValidation,
    updateproductValidation
} from "../validation/product-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

const create = async (user, request) => {
    const product = validate(createproductValidation, request);
    product.username = user.username;

    return prismaClient.product.create({
        data: product,
        select: {
            id: true,
            namaProduct: true,
            deskripsi: true,
            harga: true,
            stok: true,
            warna: true,
            categori: true
        }
    });
}

const get = async (user, productId) => {
    productId = validate(getproductValidation, productId);

    const product = await prismaClient.product.findFirst({
        where: {
            username: user.username,
            id: productId
        },
        select: {
            id: true,
            namaProduct: true,
            deskripsi: true,
            harga: true,
            stok: true,
            warna: true,
            categori: true
        }
    });

    if (!product) {
        throw new ResponseError(404, "product is not found");
    }

    return product;
}

const update = async (user, request) => {
    const product = validate(updateproductValidation, request);

    const totalproductInDatabase = await prismaClient.product.count({
        where: {
            username: user.username,
            id: product.id
        }
    });

    if (totalproductInDatabase !== 1) {
        throw new ResponseError(404, "product is not found");
    }

    return prismaClient.product.update({
        where: {
            id: product.id
        },
        data: {
            namaProduct: product.namaProduct,
            deskripsi: product.deskripsi,
            harga: product.harga,
            stok: product.stok,
            warna: product.warna,
            categori: product.categori
        },
        select: {
            id: true,
            namaProduct: true,
            deskripsi: true,
            harga: true,
            stok: true,
            warna: true,
            categori: true
        }
    })
}

const remove = async (user, productId) => {
    productId = validate(getproductValidation, productId);

    const totalInDatabase = await prismaClient.product.count({
        where: {
            username: user.username,
            id: productId
        }
    });

    if (totalInDatabase !== 1) {
        throw new ResponseError(404, "product is not found");
    }

    return prismaClient.product.delete({
        where: {
            id: productId
        }
    });
}

export default {
    create,
    get,
    update,
    remove
}
