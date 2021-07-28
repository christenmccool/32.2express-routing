const express = require('express');
const items = require('./fakeDb');

const itemsRoutes = require("./routes/items")
const ExpressError = require("./expressError")

const app = express();

app.use(express.json());
app.use("/items", itemsRoutes);


/** 404 handler */
app.use(function (req, res, next) {
    const err = new ExpressError("Not Found", 404);
    return next(err);
});

/** Error handler */
app.use((err, req, res, next) => {
    res.status(err.status || 500);

    return res.json({
        error: err.message,
    });
});

module.exports = app;