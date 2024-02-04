import {
    createManyTestProducts,
    createTestProduct,
    createTestUser,
    getTestProduct,
    removeAllTestProducts,
    removeTestUser
} from "./test-util.js";
import supertest from "supertest";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";

describe('POST /api/products', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeAllTestProducts();
        await removeTestUser();
    });

    it('should be able to create a new product', async () => {
        const result = await supertest(web)
            .post("/api/products")
            .set('Authorization', 'test')
            .send({
                namaProduct: "Test Product",
                deskripsi: "This is a test product",
                harga: 100,
                stok: 50,
                warna: "Red",
                categori: "Electronics"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.namaProduct).toBe("Test Product");
        expect(result.body.data.deskripsi).toBe("This is a test product");
        expect(result.body.data.harga).toBe(100);
        expect(result.body.data.stok).toBe(50);
        expect(result.body.data.warna).toBe("Red");
        expect(result.body.data.categori).toBe("Electronics");
    });

    it('should reject if the request is not valid', async () => {
        const result = await supertest(web)
            .post("/api/products")
            .set('Authorization', 'test')
            .send({
                namaProduct: "",
                harga: "invalid"
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('GET /api/products/:productId', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestProduct();
    });

    afterEach(async () => {
        await removeAllTestProducts();
        await removeTestUser();
    });
});
    // ...

    it('should be able to get product', async () => {
        const testProduct = await getTestProduct();
    
        const result = await supertest(web)
            .get("/api/products/" + testProduct.id)
            .set('Authorization', 'test');
    
        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testProduct.id);
        expect(result.body.data.namaProduct).toBe("Test Product");
        expect(result.body.data.deskripsi).toBe("Test Description");
        expect(result.body.data.harga).toBe(100);
        expect(result.body.data.stok).toBe(10);
        expect(result.body.data.warna).toBe("Test Color");
        expect(result.body.data.categori).toBe("Test Category");
    });
    
    it('should return 404 if product id is not found', async () => {
        const testProduct = await getTestProduct();
    
        const result = await supertest(web)
            .get("/api/products/" + (testProduct.id + 1))
            .set('Authorization', 'test');
    
        expect(result.status).toBe(404);
    });
    

describe('PUT /api/products/:productId', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestProduct();
    });

    afterEach(async () => {
        await removeAllTestProducts();
        await removeTestUser();
    });

    it('should be able to update an existing product', async () => {
        const testProduct = await getTestProduct();

        const result = await supertest(web)
            .put('/api/products/' + testProduct.id)
            .set('Authorization', 'test')
            .send({
                namaProduct: "Updated Product",
                deskripsi: "Updated description",
                harga: 150,
                stok: 30,
                warna: "Blue",
                categori: "Clothing"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testProduct.id);
        expect(result.body.data.namaProduct).toBe("Updated Product");
        expect(result.body.data.deskripsi).toBe("Updated description");
        expect(result.body.data.harga).toBe(150);
        expect(result.body.data.stok).toBe(30);
        expect(result.body.data.warna).toBe("Blue");
        expect(result.body.data.categori).toBe("Clothing");
    });

    it('should reject if request is invalid', async () => {
        const testProduct = await getTestProduct();

        const result = await supertest(web)
            .put('/api/products/' + testProduct.id)
            .set('Authorization', 'test')
            .send({
                namaProduct: "",
                harga: "invalid"
            });

        expect(result.status).toBe(400);
    });

    it('should reject if product is not found', async () => {
        const testProduct = await getTestProduct();

        const result = await supertest(web)
            .put('/api/products/' + (testProduct.id + 1))
            .set('Authorization', 'test')
            .send({
                namaProduct: "Updated Product",
                deskripsi: "Updated description",
                harga: 150,
                stok: 30,
                warna: "Blue",
                categori: "Clothing"
            });

        expect(result.status).toBe(404);
    });
});

describe('DELETE /api/products/:productId', function () {
    beforeEach(async () => {
        await createTestUser();
        await createTestProduct();
    });

    afterEach(async () => {
        await removeAllTestProducts();
        await removeTestUser();
    });

    it('should be able to delete product', async () => {
        let testProduct = await getTestProduct();
        const result = await supertest(web)
            .delete('/api/products/' + testProduct.id)
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data).toBe("OK");

        testProduct = await getTestProduct();
        expect(testProduct).toBeUndefined(); // Mengganti .toBeNull() dengan .toBeUndefined()
    });

    it('should reject if product is not found', async () => {
        let testProduct = await getTestProduct();
        if (!testProduct) {
            // Jika produk tidak ditemukan, maka test akan langsung gagal
            fail('Test product not found');
            return;
        }

        const result = await supertest(web)
            .delete('/api/products/' + (testProduct.id + 1))
            .set('Authorization', 'test');

        expect(result.status).toBe(404);
    });
});

describe('GET /api/products', function () {
    beforeEach(async () => {
        await createTestUser();
        await createManyTestProducts();
    });

    afterEach(async () => {
        await removeAllTestProducts();
        await removeTestUser();
    });

    it('should be able to search without parameter', async () => {
        const result = await supertest(web)
            .get('/api/products')
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(10);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    it('should be able to search to page 2', async () => {
        const result = await supertest(web)
            .get('/api/products')
            .query({
                page: 2
            })
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
        expect(result.body.paging.page).toBe(2);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    it('should be able to search using name', async () => {
        const result = await supertest(web)
            .get('/api/products')
            .query({
                namaProduct: "test 1"
            })
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

    it('should be able to search using category', async () => {
        const result = await supertest(web)
            .get('/api/products')
            .query({
                categori: "Electronics"
            })
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(5);
    });

    it('should be able to search using price range', async () => {
        const result = await supertest(web)
            .get('/api/products')
            .query({
                minPrice: 50,
                maxPrice: 100
            })
            .set('Authorization', 'test');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });
});
