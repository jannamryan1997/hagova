import express = require('express');
const app: express.Application = express();
import {pay,process,paymentPay,createCustomer,invoiceReceipt} from './index';
import bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.post('/pay', pay);
app.get('/process',process);
app.post('/payment-pay',paymentPay);
app.post('/get_full_customer',createCustomer);
app.post('/invoice_receipt',invoiceReceipt);




app.listen(3000, function () { console.log('App is listening on port 3000!'); });