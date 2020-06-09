import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as paypal from 'paypal-rest-sdk';
import * as soap from "soap";
const serviceAccount:any = {
    "type": "service_account",
    "project_id": "hagove-2dee7",
    "private_key_id": "6ed1f934707c611bf897b839a0453765de3ef464",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQClyboIWW0Lashr\nrt+fxmeRJb6sqqmgxsJVAILehUIZkoIWySMr2VYIm3aJ2dnE0iZ5e+8reJzK2rE1\nHlol2LqmV/vCYEw08FSNrYNb82k9sdkHC+Jpf8T7BZe+oT+bAVHMsOvK7pBNDFU+\nCKSW2jXiQccvAsxsRGmrrJT1Pq9UepasBxYGCBf4unf55W7txY8NUmsmPo9OfgFi\nKh6AKLZ7meFNzz2ud/42L6jfZtNtt9ZbHQNva2WWE3Als/CjMabUTJxxCwsmPqbT\nx7W4eN83dR7OTZXxCjWK6ybUdUZr40I3EpTJwQ1e2gGHGG75KhCTCdx90WM3gacR\nBI00UjaXAgMBAAECggEACdOZo7oNNRKIu507YwCDDf7jPN/GuyFczmX/28mhP9vH\nuysD2ysAJvV0Arq3ZiugnS3D4Ns+y+VHgKMCa+DbO1XWtdA4ZCDkmhsxQId+cuoy\nN3E0Y9VvawOLWYC8QOdEnnHUIAyg3/g9qzYe71QSwozsjfRIApjRfJv3nkuvX73l\n9tg4VQ83O56lKqCJF2ceJNACNRwW9XRRS6hgSg7Dj07USbl5uHA6XjwXdEGFvtjr\n3uCwjtgeju85t0+94BwO4ZXj3S2SSI+ekgNkKoNLjxG4ApF2rvGh2gmKHlV+TmvL\nVDuvHhII5vx6lnpgyglAq+EKsHPEFlmxeS1NIHdktQKBgQDT6NWeqDdNVceHJ323\nL8ddd6K6tSc3HYHQTguu57E0A0Ikp7C1ALgt4ueJaw/FBIc4EARZ3lJo/WbDPj6q\nYNXW873bSk6lPFrjgtlSKGnnpxE2dPyRO75k89e8F0MRHU47RckBH9Qsp3hTDoME\nNfFVLPWYFXRusrtY08kYyPYKBQKBgQDISEWnZCwMQPWXRlkbGEyVCW9M/IWxyJOe\nxpKgVc1weU49laBM6RC47qaMofq55iGDHyKVwr5o1qM1Wo91Y74sOw61WaZ0eC45\ngRvZolld4yVkuMdUnyHIPgPi9FEKo/PpL3+51nc1utD8mhCKAZiS/dbwpTo4wOSA\nM8HPlBY06wKBgBzaF7O5XYY3BqqdMt2tMKzGLC7VmVhEuTb+WVLgEt1tECVje4i5\nZ1pACZxJKmV9v1dfvufpgDjxP3uXzvptos/YceIYlOqkdA+D8kjgXcL/mTVb6kNv\n6fVeyeG/HQ+IeO1TDBIOHlpSFuzgDfCV05zwOSQSz75+sUlf1IJ+YhltAoGAW3nO\n/oZdK/ebdE14M0zk5YlaoZIQykOvUOynWb32yDFPkAdAIQCuV5kAzujIqJG4qrfU\nxwwchavK/XpwXZCB8pfCvwfEZBvkGPWkL8HcCWrO0HMo77iC6H+SrN0kCrUZmV7N\neqa+6fZ6r3T6qt3RvwlbW6xLrFJFy1xYYCPmBKMCgYAj8YlYPkdhTMvURCe0KF3p\n1D7P/IyH2d9cdDs6+F5eUnJ1RltYPryJiwMz3pm+hZ8Mx+fpUug5yNJhTeZ4PSge\nILI9n6HpAdJGtu1LVssDSpqdFjy6xNqbSxF2hYqGVRV0u3S9U1BDRPNQImQpvRjO\n68IFmkSesQT3iBzUFiIJlA==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-n3xeq@hagove-2dee7.iam.gserviceaccount.com",
    "client_id": "114234327249132969899",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-n3xeq%40hagove-2dee7.iam.gserviceaccount.com"
}

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://hagove-2dee7.firebaseio.com"
});

const twilio = require('twilio');

const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;

const client = new twilio(accountSid, authToken);

const twilioNumber = '+14158494694';

// Sendgrid Config
import * as sgMail from '@sendgrid/mail';

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;

sgMail.setApiKey(API_KEY);

paypal.configure({
	'mode': 'sandbox', //sandbox or live
	'client_id': 'AUfYkgfseNxP9vLjcYqw2QAfrhhajgAPFAWdGb6btCNIlHwvLzBUKkw0bIn01Y2f08vpcc2Mzbh_GEdR',
	'client_secret': 'ENIrkixbD-yeqx9GdcwzGqyQo73pHVbmRtEH0FKWk7lBicyfInJPsHjSYTivhERCkwLDxZV-FWwDnmnw'
});



exports.pay = functions.https.onCall(async (data, context) => {
	return new Promise((resolve, reject) => {

		// 1.Set up a payment information object, Build PayPal payment request
		const payReq: any = JSON.stringify({
			intent: 'sale',
			payer: {
				payment_method: 'paypal'
			},
			redirect_urls: {
				return_url: `/process`,
				cancel_url: `/cancel`
			},
			transactions: [{
				amount: {
					total: data.price,
					currency: 'ILS'
				},
				// This is the payment transaction description. Maximum length: 127
				description: data.uid, // req.body.id
				// reference_id string .Optional. The merchant-provided ID for the purchase unit. Maximum length: 256.
				// reference_id: req.body.uid,
				custom: data.uid,
				// soft_descriptor: req.body.uid
				// "invoice_number": req.body.uid,A
			}]
		});
		// 2.Initialize the payment and redirect the user.
		paypal.payment.create(payReq, (error: any, payment_2: any) => {
			const links: any = {};
			if (error) {
				console.error(error);
				reject({
					status: 500,
					err: error
				})
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

					resolve({ success: true, href: links.approval_url.href });

				} else {
					console.error('no redirect URI present');
					reject({
						status: 500,
						err: true
					})
				}
			}
		});
	})
});

// 3.Complete the payment. Use the payer and payment IDs provided in the query string following the redirect.
exports.process = functions.https.onRequest(async (req, res) => {
	const paymentId = req.query.paymentId;
	const payerId = {
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
				res.redirect(`https://console.firebase.google.com/project/${process.env.GCLOUD_PROJECT}/functions/logs?search=&severity=DEBUG`);
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
		returnUrl: `https://us-central1-hagove-2dee7.cloudfunctions.net/payStatus?price=${data.Sum}&clientId=${data.clientId}&email=${data.email}`
	};
	const result = await doPay(request);

	return { success: true, result };
})


async function setInvoce(data:any){
	return new Promise((resolve, reject) => {
		/**** Module ****/
		const soap = require('soap');
		const uuid = require('node-uuid');
		const uuid1 = uuid.v1();



		/*Local Varible*/

		const url = 'https://apiqa.invoice4u.co.il/Services/ApiService.svc?singleWsdl';
		const soapHeader = '<Content-Type>application/json</Content-Type>'//xml string for header

		/*using Soap CLient*/
		soap.createClient(url, function (err: any, client: any) {
			client.addSoapHeader(soapHeader);

			/*Start LoginFunctions*/
			let args: any = {
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

	
				/*Payments*/

				/*Item*/

			
				/*Email Associated*/
				let AssociatedEmail= [
						{
							"Mail": "vano.varderesyan94@gmail.com",
							"IsUserMail": false
						},
						{
							"Mail": data.email,
							"IsUserMail": false
						},
						{
							"Mail":"asaf@invoice4u.co.il",
							"IsUserMail":false
						 },
					]


				/*Document Parameter*/
				let document = {
					doc: {
						ClientID: data.clientId,
						Currency: "ILS",
						DocumentType: 1,
						Items: [{
							"Name": "tes_product",
							"Price": data.price,
							"Quantity": 1
						}],
						// Payments: Payments,
						RoundAmount: 0,
						// you can round the total 
						Subject: "Document Subject",
						TaxPercentage: 17,
						AssociatedEmails: AssociatedEmail,
						ApiIdentifier: uuid1,
					},
					token: result.VerifyLoginResult
				}
				fetch('https://apiqa.invoice4u.co.il/Services/ApiService.svc/CreateDocument',{
					method:"POST",
					body:JSON.stringify(document),
					headers:{"Content-Type":"application/json"}
				}).then((res)=>{
					//console.log();
					return res.json()
				}).then(res=>{
					resolve({ result: res['d'] })
				}).catch((error)=>{
					reject(error)
				})
			});
		});
	})
}


export const payStatus = functions.https.onRequest((req, res) => {
	return new Promise((resolve, reject) => {
		console.log(req.query)
		if(req.query.response == 'succses'){
			setInvoce(req.query).then((res)=>{
				resolve("ok")
			}).catch((err)=>{
				reject(err)
			})
		}else{
			reject('false')
		}
	})
});


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


export const createCustomer = functions.https.onCall(async (data, context) => {
	return new Promise((resolve, reject) => {
		/**** Module ****/
		/*Local letible*/
		const url = 'https://apiqa.invoice4u.co.il/Services/ApiService.svc?singleWsdl';
		// let token = '';

		/*using Soap CLient*/
		soap.createClient(url, function (err: any, _client: any) {

			/*Start LoginFunctions*/
			let args: any = {
				email: "Test@test.com",
				password: "123456"
			};

			_client.VerifyLogin(args, function (err1: any, result: any) {
				if (err1) {
					reject(err1)

				}
				args = {
					token: result.VerifyLoginResult
				};
				/*End LoginFunctions*/
				/*Start Function for CreateCustomer detail*/
				const customer = {
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
				_client.CreateCustomer(customer, function (err2: any, result2: any) {
					if (err2) {
						reject(err2)
					}
					
					let _res = result2.CreateCustomerResult
					if (!_res.Errors) {
				


						admin.database().ref('transactions/').push({
							price: data.price,
							paymentUserData: _res
						}).then((res: any) => {
							 resolve(_res);
						}).catch((err9: any) => {
							reject(err9)
						})
					} else {
						 resolve(_res);

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
		const uuid = require('node-uuid');
		const uuid1 = uuid.v1();


		/*Local letible*/

		const url = 'https://apiqa.invoice4u.co.il/Services/ApiService.svc?singleWsdl';
		// let token = '';

		/*using Soap CLient*/
		soap.createClient(url, function (err: any, _client: any) {

			/*Start LoginFunctions*/
			let args: any = {
				email: "Test@test.com",
				password: "123456"
			};

			_client.VerifyLogin(args, function (_err1: any, _result1: any) {
				if (_err1) {
					console.log(_err1, '386')

					reject(_err1)
				}
				args = {
					token: _result1.VerifyLoginResult
				};

				/*End LoginFunctions*/

				/*Start InvoiceReceipt for RegularCustomer*/

				/*Enmu type*/
				// let PaymentTypes = {
				// 	CreditCard: 1,
				// 	Check: 2,
				// 	MoneyTransfer: 3,
				// 	Cash: 4,
				// 	Credit: 5
				// };
				// let DocumentType = {
				// 	Invoice: 1,
				// 	Receipt: 2,
				// 	InvoiceReceipt: 3,
				// 	InvoiceCredit: 4,
				// 	ProformaInvoice: 5,
				// 	InvoiceOrder: 6,
				// 	InvoiceQuote: 7,
				// 	InvoiceShip: 8,
				// 	Deposits: 9,
				// };
				let currdatetime = new Date();
				/*Payments*/
				const Payments = {
					Payments: {
						Date: currdatetime,
						Amount: 100.00,
						PaymentType: data.aymentTypes,
					}
				};
				/*Item*/
				const DocumentItem =
				{
					DocumentItem: {
						code: "",
						Name: "item name/description",
						Price: 100,
						Quantity: 1
					}
				};
				/*Email Associated*/
				let AssociatedEmail =
				{
					AssociatedEmail: [
						{
							Mail: "vano.varderesyan94@gmail.com",
							IsUserMail: false
						},
						{
							Mail: "vano.varderesyan@mail.ru",
							IsUserMail: false
						}
					]
				};

				/*Document Parameter*/
				const document = {
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
					token: _result1.VerifyLoginResult
				}

				console.log(document, '------------')
				_client.CreateDocument(document, function (_err: any, _result: any) {
					if (_err) {
						console.log(_err, '469')
						reject(_err)
					}
					console.log(_result.CreateDocumentResult.Errors)
					resolve({ _result: _result.CreateDocumentResult })

				});
				/*End InvoiceReceipt for RegularCustomer*/


			});
		});
	})
});



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


// Sends email to user after signup
export const freeTextEmail = functions.https.onCall(async (data, context) => {
	if (!context.auth && !context.auth.token.email) {
		throw new functions.https.HttpsError('failed-precondition', 'Must be logged with an email address');
	}
	const template_id = "d-3893f712b34149368481b17124c76913";
	const msg = {
		to: data.to,
		from: 'hagoveapp@gmail.com',
		templateId: template_id,
		dynamic_template_data: {
			subject: "מכתב מחברת סוגרים חשבון",
			text: data.text,
		},
	};

	await sgMail.send(msg).catch((err) => {
		return { success: false };
	});

	return { success: true };

});

// Sends email via HTTP. Can be called from frontend code. 
export const genericEmail = functions.https.onCall(async (data, context) => {
	if (!context.auth && !context.auth.token.email) {
		throw new functions.https.HttpsError('failed-precondition', 'Must be logged with an email address');
	}

	let template_id = "";

	if (data.msgNum === 0) {
		template_id = TEMPLATE_ID
	} else if (data.msgNum === 1) {
		template_id = "d-b6c95068a37740c6ac0f9b4a65d2bc51";
	}

	const msg = {
		to: data.to,
		from: 'hagoveapp@gmail.com',
		templateId: template_id,
		dynamic_template_data: {
			subject: data.subject,
			name: data.name,
			myName: data.myName,
			price: data.price,
			date: data.date,
			phone: data.phone
		},
	};

	await sgMail.send(msg).catch((err) => {
		return { success: false };
	});

	// Handle errors here

	// Response must be JSON serializable
	return { success: true };
});

export const sendSmsGeneric = functions.https.onCall(async (data, context) => {
	if (!context.auth && !context.auth.token.email) {
		throw new functions.https.HttpsError('failed-precondition', 'Must be logged with an email address');
	}

	const phoneNumber: string = data.phoneNumber.toString();
	let validphoneNumber: string = "";

	if (phoneNumber.startsWith("0")) {
		validphoneNumber = "+972" + phoneNumber.substr(1);
	} else if (phoneNumber.startsWith("9")) {
		validphoneNumber = "+" + phoneNumber
	} else {
		validphoneNumber = "+972" + phoneNumber
	}

	const textMessage = {
		body: data.text,
		to: validphoneNumber,  // Text to this number
		from: twilioNumber // From a valid Twilio number
	}

	return client.messages.create(textMessage).then((msg: any) => {
		console.log(msg, 'success')
	}).catch((err: any) => console.log(err));
});

// Sends email via HTTP. Can be called from frontend code. 
export const sendMihtavBClickMail = functions.https.onCall(async (data, context) => {
	if (!context.auth && !context.auth.token.email) {
		throw new functions.https.HttpsError('failed-precondition', 'Must be logged with an email address');
	}

	const msg = {
		to: data.to,
		from: 'hagoveapp@gmail.com',
		subject: data.subject,
		html: '<p>קובץ אקסל של חייב מחברת סוגרים חשבון</p>',
		attachments: [
			{
				filename: "out.txt",
				content: data.atch,
				disposition: "attachment",
				type: "csv"
			}
		],
	};

	await sgMail.send(msg).catch((err) => {
		return { success: false };
	});

	// Handle errors here

	// Response must be JSON serializable
	return { success: true };
});

