const express = require("express");
const router = new express.Router();

const ExpressError = require("../expressError");
const items = require("../fakeDb");


router.get("/", function (req, res) {
    res.json(items);
})

router.post("/", function (req, res, next) {
    try {
        if (!req.body.name) {
            throw new ExpressError("Name parameter required", 400);
        } else if (!req.body.price) {
            throw new ExpressError("Price parameter required", 400);
        } 
        if (items.find(ele => ele.name === req.body.name)) {
            throw new ExpressError("Snack already on list", 400);
        }
        const newItem = {name: req.body.name, price: req.body.price};
        items.push(newItem);
        res.status(201).json({added: newItem});
    } catch(err) {
        next(err);
    }
})

router.get("/:name", function (req, res, next) {
    try {
        const item = items.find(ele => ele.name === req.params.name);
        if (!item) {
            throw new ExpressError("Item does not exist", 404);
        }
        res.json(item);
    } catch(err) {
        next(err);
    }
})

router.patch("/:name", function (req, res, next) {
    try {
        const item = items.find(ele => ele.name === req.params.name);
        if (!item) {
            throw new ExpressError("Item does not exist", 404);
        }
        item.name = req.body.name;
        item.price = req.body.price;
        res.json({updated: item});
    } catch(err) {
        next(err);
    }
})

router.delete("/:name", function (req, res, next) {
    try {
        const itemInd = items.findIndex(ele => ele.name === req.params.name);
        if (itemInd === -1) {
            throw new ExpressError("Item does not exist", 404);
        } 
        items.splice(itemInd, 1);
        res.json({message: "Item deleted"});
    } catch(err) {
        next(err);
    }
})
  
  
module.exports = router;