import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import  * as paypal from 'paypal-rest-sdk';
import * as soap from "soap";
admin.initializeApp();

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
	'client_id': 'ASSENB6F9U3AeN8A0wvcBQM1HIClff7BOgURQ-bZntocZxgoE6RR5FFp8T2jAXO6LZnP6F9Pukmn1b-K',
	'client_secret': 'EORDzAubIjBLG2xJWvkpVenkdNEVBwQcjVp6Go6JRRf8r5AJNFzQ8qXu1oZIhvu1qQI1OwGkl4LLqq3W'
});



exports.pay = functions.https.onRequest((req, res) => {
	// 1.Set up a payment information object, Build PayPal payment request
	const payReq:any = JSON.stringify({
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
	paypal.payment.create(payReq, (error:any, payment_2:any) => {
		const links:any = {};
		if (error) {
			console.error(error);
			res.status(500).end();
		} else {
			// Capture HATEOAS links
			payment_2.links.forEach((linkObj:any) => {
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
exports.process = functions.https.onRequest(async (req, res) => {
	const paymentId = req.query.paymentId;
	const payerId = {
		payer_id: req.query.PayerID
	};
	return await paypal.payment.execute(paymentId, payerId, (error:any, payment_1:any) => {
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

