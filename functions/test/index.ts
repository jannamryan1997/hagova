import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as paypal from 'paypal-rest-sdk';
import * as soap from "soap";
var serviceAccount = require("./hagove-key.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://hagove-2dee7.firebaseio.com"
});
const twilio = require('twilio');

// const accountSid = functions.config().twilio.sid;
// const authToken = functions.config().twilio.token;

// const client = new twilio(accountSid, authToken);

const twilioNumber = '+14158494694';

// Sendgrid Config
import * as sgMail from '@sendgrid/mail';

// const API_KEY = functions.config().sendgrid.key;
// const TEMPLATE_ID = functions.config().sendgrid.template;

// sgMail.setApiKey(API_KEY);





export const pay = functions.https.onRequest((req, res) => {
	let testSTring = paypal.configure({
		'mode': 'sandbox', //sandbox or live
		'client_id': 'AUfYkgfseNxP9vLjcYqw2QAfrhhajgAPFAWdGb6btCNIlHwvLzBUKkw0bIn01Y2f08vpcc2Mzbh_GEdR',
		'client_secret': 'ENIrkixbD-yeqx9GdcwzGqyQo73pHVbmRtEH0FKWk7lBicyfInJPsHjSYTivhERCkwLDxZV-FWwDnmnw'
	});

	console.log(paypal, '---------------', testSTring)
	// 1.Set up a payment information object, Build PayPal payment request
	const payReq: any = JSON.stringify({
		intent: 'sale',
		payer: {
			payment_method: 'paypal'
		},
		redirect_urls: {
			return_url: `${req.protocol}://${req.get('host')}/process`,
			cancel_url: `${req.protocol}://${req.get('host')}/cancel`
		},
		transactions: [{
			amount: {
				total: req.body.price,
				currency: 'USD'
			},
			// This is the payment transaction description. Maximum length: 127
			description: req.body.uid, // req.body.id
			// reference_id string .Optional. The merchant-provided ID for the purchase unit. Maximum length: 256.
			// reference_id: req.body.uid,
			custom: req.body.uid,
			// soft_descriptor: req.body.uid
			// "invoice_number": req.body.uid,A
		}]
	});
	// 2.Initialize the payment and redirect the user.
	paypal.payment.create(payReq, (error: any, payment_2: any) => {
		const links: any = {};
		if (error) {
			console.error(error);
			res.status(500).end();
		} else {
			// Capture HATEOAS links
			payment_2.links.forEach((linkObj: any) => {
				links[linkObj.rel] = {
					href: linkObj.href,
					method: linkObj.method
				};
			});
			// If redirect url present, redirect user
			if (Object.prototype.hasOwnProperty.call(links, 'approval_url')) {
				// REDIRECT USER TO links['approval_url'].href
				console.info(links.approval_url.href);
				// res.json({"approval_url":links.approval_url.href});
				res.redirect(302, links.approval_url.href);
			} else {
				console.error('no redirect URI present');
				res.status(500).end();
			}
		}
	});
});

// 3.Complete the payment. Use the payer and payment IDs provided in the query string following the redirect.
export const process = functions.https.onRequest(async (req, res) => {
	const paymentId: string = String(req.query.paymentId);
	const payerId: any = {
		payer_id: req.query.PayerID
	};
	await paypal.payment.execute(paymentId, payerId, (error: any, payment_1: any) => {
		if (error) {
			console.error(error);
			res.redirect(`${req.protocol}://${req.get('host')}/error`); // replace with your url page error
			return
		} else {
			if (payment_1.state === 'approved') {
				console.info('payment completed successfully, description: ', payment_1.transactions[0].description);
				// console.info('req.custom: : ', payment.transactions[0].custom);
				// set paid status to True in RealTime Database
				const date = Date.now();
				const uid = payment_1.transactions[0].description;
				const ref = admin.database().ref('users/' + uid + '/');
				ref.push({
					'paid': true,
					// 'description': description,
					'date': date
				})
				res.redirect(`${req.protocol}://${req.get('host')}/success`); // replace with your url, page success
				return
			} else {
				console.warn('payment.state: not approved ?');
				// replace debug url
				res.redirect(`https://console.firebase.google.com/project/vano/functions/logs?search=&severity=DEBUG`);
				return
			}

		}
	});
});


// Sends Payment
export const payment = functions.https.onCall(async (data, context) => {

	const request = {
		fullName: "Rahul Singh",
		phone: "123456789",
		email: "aghasi89@gmail.com",
		sum: data.Sum,
		description: "TEST PURCHASE",
		type: 2,
		paymentsNum: 1,
		userEmail: "test@test.com",
		userPassword: "123456",
		returnUrl: "http://localhost:4200/api/geturl"
	};
	const result = await doPay(request);

	return { success: true, result };
})

const doPay = (request: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		/*Local constible */
		soap.createClient('https://privateqa.invoice4u.co.il/Services/ApiService.svc?singleWsdl', (err: any, soapLogin) => {

			if (err) {
				console.log(err);
			}
			if (soapLogin) {
				const args = {
					email: "test@test.com",
					password: "123456"
				};
				soapLogin.VerifyLogin(args, (loginError: any, Loginresponse: any) => {
					if (loginError) {
						console.log(loginError);
					}
					console.log(Loginresponse);

					soapLogin.ProcessRequestFullContentsREST(request, (reqError: any, paymantResponse: any) => {
						if (reqError) {
							console.log(reqError);
						}
						resolve(paymantResponse.ProcessRequestFullContentsRESTResult);

					})

				})

			}
		})
	})
}


export const paymentPay = functions.https.onCall(async (data, context) => {
	return new Promise((resolve, reject) => {


		admin.database().ref('transactions/').push({
			price: data.price,
			user: data.uid
		}).then((res: any) => {
			console.log(res)
			resolve("ok")
		}).catch((err: any) => {
			reject(err)
		})
	})
})

export const createCustomer = functions.https.onCall(async (data, context) => {
	return new Promise((resolve, reject) => {
		/**** Module ****/
		var soap = require('soap');
		/*Local Varible*/
		var url = 'https://apiqa.invoice4u.co.il/Services/ApiService.svc?singleWsdl';
		var soapHeader = ''//xml string for header
		var token = '';

		/*using Soap CLient*/
		soap.createClient(url, function (err: any, client: any) {
			client.addSoapHeader(soapHeader);

			/*Start LoginFunctions*/
			var args: any = {
				email: "Test@test.com",
				password: "123456"
			};

			client.VerifyLogin(args, function (err: any, result: any) {
				if (err) {
					reject(err)

				}
				args = {
					token: result.VerifyLoginResult
				};
				/*End LoginFunctions*/
				/*Start Function for CreateCustomer detail*/
				var customer = {
					cu: {
						Name: data.name,
						Email: data.email,
						Phone: data.phone,
						Fax: "012345678",
						Address: "Delhi",
						City: "Akshardham",
						Zip: "12345",
						UniqueID: "25896478",
						OrgID: 111,
						PayTerms: 30,
						Cell: "0522256664",
						Active: 1
					},
					token: result.VerifyLoginResult

				}
				client.CreateCustomer(customer, function (err: any, result: any) {
					if (err) {
						reject(err)
					}
					let _res = result.CreateCustomerResult
					if (!_res.Errors) {
				


						admin.database().ref('transactions/').push({
							price: data.price,
							paymentUserData: _res
						}).then((res: any) => {
							return resolve(_res);
						}).catch((err: any) => {
							reject(err)
						})
					} else {
						return resolve(_res);

					}



				});
				/*End Function for GetFullCustomer detail*/
			});
		});
	})
})


export const invoiceReceipt = functions.https.onCall(async (data, context) => {
	return new Promise((resolve, reject) => {
		/**** Module ****/
		var soap = require('soap');
		var uuid = require('node-uuid');
		var uuid1 = uuid.v1();


		/*Local Varible*/

		var url = 'https://apiqa.invoice4u.co.il/Services/ApiService.svc?singleWsdl';
		var soapHeader = ''//xml string for header
		var token = '';

		/*using Soap CLient*/
		soap.createClient(url, function (err: any, client: any) {
			client.addSoapHeader(soapHeader);

			/*Start LoginFunctions*/
			var args: any = {
				email: "Test@test.com",
				password: "123456"
			};

			client.VerifyLogin(args, function (err: any, result: any) {
				if (err) {
					console.log(err, '386')

					reject(err)
				}
				args = {
					token: result.VerifyLoginResult
				};

				/*End LoginFunctions*/

				/*Start InvoiceReceipt for RegularCustomer*/

				/*Enmu type*/
				var PaymentTypes = {
					CreditCard: 1,
					Check: 2,
					MoneyTransfer: 3,
					Cash: 4,
					Credit: 5
				};
				var DocumentType = {
					Invoice: 1,
					Receipt: 2,
					InvoiceReceipt: 3,
					InvoiceCredit: 4,
					ProformaInvoice: 5,
					InvoiceOrder: 6,
					InvoiceQuote: 7,
					InvoiceShip: 8,
					Deposits: 9,
				};
				var currdatetime = new Date();
				/*Payments*/
				var Payments = {
					Payments: {
						Date: currdatetime,
						Amount: 100.00,
						PaymentType: data.aymentTypes,
					}
				};
				/*Item*/
				var DocumentItem =
				{
					DocumentItem: {
						code: "",
						Name: "item name/description",
						Price: 100,
						Quantity: 1
					}
				};
				/*Email Associated*/
				var AssociatedEmail =
				{
					AssociatedEmail: [
						{
							Mail: "test@test.com",
							IsUserMail: true
						},
						{
							Mail: "customermail@mail.com",
							IsUserMail: false
						}
					]
				};

				/*Document Parameter*/
				var document = {
					doc: {
						ClientID: data.clientId,
						Currency: "ILS",
						DocumentType: data.documentType,
						Items: DocumentItem,
						Payments: Payments,
						RoundAmount: 0,
						// you can round the total 
						Subject: "Document Subject",
						TaxPercentage: 17,
						AssociatedEmails: AssociatedEmail,
						ApiIdentifier: uuid1,
					},
					token: result.VerifyLoginResult
				}

				console.log(document, '------------')
				client.CreateDocument(document, function (err: any, result: any) {
					if (err) {
						console.log(err, '469')
						reject(err)
					}
					console.log(result.CreateDocumentResult.Errors)
					resolve({ result: result.CreateDocumentResult })

				});
				/*End InvoiceReceipt for RegularCustomer*/


			});
		});
	})
});




// Sends email to user after signup
// export const freeTextEmail = functions.https.onCall(async (data, context) => {
// 	if (!context.auth && !context.auth.token.email) {
// 		throw new functions.https.HttpsError('failed-precondition', 'Must be logged with an email address');
// 	}
// 	const template_id = "d-3893f712b34149368481b17124c76913";
// 	const msg = {
// 		to: data.to,
// 		from: 'hagoveapp@gmail.com',
// 		templateId: template_id,
// 		dynamic_template_data: {
// 			subject: "מכתב מחברת סוגרים חשבון",
// 			text: data.text,
// 		},
// 	};

// 	await sgMail.send(msg).catch((err) => {
// 		return { success: false };
// 	});

// 	return { success: true };

// });

// Sends email via HTTP. Can be called from frontend code. 
// export const genericEmail = functions.https.onCall(async (data, context) => {
// 	if (!context.auth && !context.auth.token.email) {
// 		throw new functions.https.HttpsError('failed-precondition', 'Must be logged with an email address');
// 	}

// 	let template_id = "";

// 	if (data.msgNum === 0) {
// 		template_id = TEMPLATE_ID
// 	} else if (data.msgNum === 1) {
// 		template_id = "d-b6c95068a37740c6ac0f9b4a65d2bc51";
// 	}

// 	const msg = {
// 		to: data.to,
// 		from: 'hagoveapp@gmail.com',
// 		templateId: template_id,
// 		dynamic_template_data: {
// 			subject: data.subject,
// 			name: data.name,
// 			myName: data.myName,
// 			price: data.price,
// 			date: data.date,
// 			phone: data.phone
// 		},
// 	};

// 	await sgMail.send(msg).catch((err) => {
// 		return { success: false };
// 	});

// 	// Handle errors here

// 	// Response must be JSON serializable
// 	return { success: true };
// });

// export const sendSmsGeneric = functions.https.onCall(async (data, context) => {
// 	if (!context.auth && !context.auth.token.email) {
// 		throw new functions.https.HttpsError('failed-precondition', 'Must be logged with an email address');
// 	}

// 	const phoneNumber: string = data.phoneNumber.toString();
// 	let validphoneNumber: string = "";

// 	if (phoneNumber.startsWith("0")) {
// 		validphoneNumber = "+972" + phoneNumber.substr(1);
// 	} else if (phoneNumber.startsWith("9")) {
// 		validphoneNumber = "+" + phoneNumber
// 	} else {
// 		validphoneNumber = "+972" + phoneNumber
// 	}

// 	const textMessage = {
// 		body: data.text,
// 		to: validphoneNumber,  // Text to this number
// 		from: twilioNumber // From a valid Twilio number
// 	}

// 	return client.messages.create(textMessage).then((msg: any) => {
// 		console.log(msg, 'success')
// 	}).catch((err: any) => console.log(err));
// });

// Sends email via HTTP. Can be called from frontend code. 
// export const sendMihtavBClickMail = functions.https.onCall(async (data, context) => {
// 	if (!context.auth && !context.auth.token.email) {
// 		throw new functions.https.HttpsError('failed-precondition', 'Must be logged with an email address');
// 	}

// 	const msg = {
// 		to: data.to,
// 		from: 'hagoveapp@gmail.com',
// 		subject: data.subject,
// 		html: '<p>קובץ אקסל של חייב מחברת סוגרים חשבון</p>',
// 		attachments: [
// 			{
// 				filename: "out.txt",
// 				content: data.atch,
// 				disposition: "attachment",
// 				type: "csv"
// 			}
// 		],
// 	};

// 	await sgMail.send(msg).catch((err) => {
// 		return { success: false };
// 	});

// 	// Handle errors here

// 	// Response must be JSON serializable
// 	return { success: true };
// });

