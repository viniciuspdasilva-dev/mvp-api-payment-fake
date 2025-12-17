var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/payments', (req, res) => {
    const [orderId, amount, userId] = req.body;

    const success = Math.random() > 0.2;

    if (success) {
        res.status(200)
            .json({
                orderId,
                amount,
                userId,
                transactionId: Math.floor(Math.random() * 1000000),
                status: 'PAID'
            });
    } else {
        res.status(400).json({
            orderId,
            amount,
            userId,
            status: 'FAILED',
            message: 'not authorized'
        });
    }
});

module.exports = app;
