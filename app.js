var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var indexRouter = require('./routes/index');
var logger = require('morgan');
var crypto = require('crypto');

var app = express();

const secret = 'super-secret-key';


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function generateAuthCode({orderId, amount, currency}) {
    const payload = `${orderId}|${amount}|${currency}`;
    // cria HMAC como Buffer
    const mac = crypto.createHmac("sha256", secret).update(payload).digest(); // gera nonce como Buffer
    const nonce = crypto.randomBytes(4);
    const combined = Buffer.concat([nonce, mac.subarray(0, 4)]);
    const code = BigInt("0x" + combined.toString("hex")).toString(36).toUpperCase();
    return code.slice(0, 10); // ex.: "8G2X9K3PQT"
}

    app.use('/', indexRouter);
    app.post('/payments', (req, res) => {
        const {orderId, amount, userId} = req.body;

        const success = Math.random() > 0.2;
        const authCode = generateAuthCode({orderId, amount, userId});
        if (success) {
            res.status(200)
                .json({
                    orderId,
                    amount,
                    userId,
                    transactionId: authCode,
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

    app.listen(3000, () => {
        console.log("Fake Payment API rodando na porta 3000");
    });

    module.exports = app;
