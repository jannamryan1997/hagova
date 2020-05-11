import express = require('express');
const app: express.Application = express();
import {pay,process,paymentPay} from './index';
import bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.post('/pay', pay);
app.get('/process',process);
app.post('/payment-pay',paymentPay);


app.listen(3000, function () { console.log('App is listening on port 3000!'); });