var express = require('express');
var path = require('path');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var braintree = require('braintree');
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: 'j8svffdwjv7x9ygc',
    publicKey: 'xw5t927twhbfq76z',
    privateKey: 'c6eb0fcce1b33c6d683fc391ed9a0ae4'
});

app.get('/client_token', function(req, res) {
    gateway.clientToken.generate({}, function(err, response) {
        res.send(response.clientToken);
    });
});

app.post('/checkout', function(req, res) {
    var nonceFromTheClient = req.body.payment_method_nonce;
    gateway.transaction.sale({
        amount: "10.00",
        paymentMethodNonce: "fake-valid-nonce",
        options: {
            submitForSettlement: true
        }
    }, function(err, result) {
        res.send(result);
    });
});

app.get('/', (req, res) => {
    res.render('main');
});
app.get('/success', (req, res) => {
    res.render('success');
});

app.get('/failed', (req, res) => {
    res.render('failed');
});
app.get('/main.js', (req, res) => {
    res.sendFile(path.join(__dirname, '/main.js'));
});
app.get('/main.css', (req, res) => {
    res.sendFile(path.join(__dirname, '/main.css'));
});
app.listen(8080, function(req, res) {
    console.log('server is running at port 8080');
})
