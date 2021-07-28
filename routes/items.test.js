process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app")
let items = require("../fakeDb")

const testItem = {name: 'candy', price: 1.00};

beforeEach(function() {
    items.push(testItem);
})

afterEach(function() {
    items.length = 0;
})

describe("GET /items", function () {
    test("Get all items", async function () {
        const res = await request(app).get("/items");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([testItem]);
    })
})

describe("POST /items", function () {
    test("Post new item", async function () {
        const newItem = {name: 'chips', price: 4.00};
        const res = await request(app).post("/items").send(newItem);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({added: newItem});
    })

    test("Error if snack already on list", async function () {
        const newItem = {name: 'candy', price: 1.00};
        const res = await request(app).post("/items").send(newItem);
        expect(res.statusCode).toBe(400);
    })

    test("Error if name of snack not provided", async function () {
        const newItem = {price: 3.00};
        const res = await request(app).post("/items").send(newItem);
        expect(res.statusCode).toBe(400);
    })

    test("Error if price of snack not provided", async function () {
        const newItem = {name: 'popcorn'};
        const res = await request(app).post("/items").send(newItem);
        expect(res.statusCode).toBe(400);
    })
})

describe("GET /items/:name", function () {
    test("Get item", async function () {
        const res = await request(app).get(`/items/${testItem.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(testItem);
    })

    test("Error if unknown item", async function () {
        const res = await request(app).get(`/items/unknown`);
        expect(res.statusCode).toBe(404);
    })
})


describe("PATCH /items/:name", function () {
    test("Edit item", async function () {
        const editedItem = {name: 'kingsize candy', price: 2.00};
        const res = await request(app).patch(`/items/${testItem.name}`).send(editedItem);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({updated: editedItem});
    })
    test("Error if unknown item", async function () {
        const res = await request(app).patch(`/items/unknown`);
        expect(res.statusCode).toBe(404);
    })
})

describe("DELETE /items/:name", function () {
    test("Delete item", async function () {
        const res = await request(app).delete(`/items/${testItem.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({message: "Item deleted"});
    })
    test("Error if unknown item", async function () {
        const res = await request(app).delete(`/items/unknown`);
        expect(res.statusCode).toBe(404);
    })
})