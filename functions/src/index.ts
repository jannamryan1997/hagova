import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const twilio = require('twilio');

const accountSid = functions.config().twilio.sid;
const authToken  = functions.config().twilio.token;

const client = new twilio(accountSid, authToken);

const twilioNumber = '+14158494694';

// Sendgrid Config
import * as sgMail from '@sendgrid/mail';

const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;

sgMail.setApiKey(API_KEY);

// Sends email to user after signup
export const freeTextEmail = functions.https.onCall(async (data, context) => {
    if (!context.auth && !context.auth.token.email) {
        throw new functions.https.HttpsError('failed-precondition', 'Must be logged with an email address');
    }
  
    let template_id = "d-3893f712b34149368481b17124c76913";
    const msg = {
        to: data.to,
        from: 'hagoveapp@gmail.com',
        templateId: template_id,
        dynamic_template_data: {
            subject: "מכתב מחברת סוגרים חשבון",
            text: data.text,
        },
    };

    await sgMail.send(msg).catch((err)=>{
        return {success: false};
    });

 return { success: true };

});

// Sends email via HTTP. Can be called from frontend code. 
export const genericEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth && !context.auth.token.email) {
      throw new functions.https.HttpsError('failed-precondition', 'Must be logged with an email address');
  }

  let template_id = "";

  if(data.msgNum === 0){
    template_id = TEMPLATE_ID
  }else if (data.msgNum === 1){
    template_id = "d-b6c95068a37740c6ac0f9b4a65d2bc51";
  }

  const msg = {
      to: data.to,
      from: 'hagoveapp@gmail.com',
      templateId: template_id,
      dynamic_template_data: {
          subject: data.subject,
          name: data.name,
          myName:data.myName,
          price:data.price,
          date:data.date,
          phone:data.phone
      },
  };

 await sgMail.send(msg).catch((err)=>{
     return {success: false};
 });

  // Handle errors here

  // Response must be JSON serializable
  return { success: true };
});

export const sendSmsGeneric = functions.https.onCall(async (data, context) => {
    if (!context.auth && !context.auth.token.email) {
        throw new functions.https.HttpsError('failed-precondition', 'Must be logged with an email address');
    }

    const phoneNumber:string = data.phoneNumber.toString();
    let validphoneNumber:string = "";

    if(phoneNumber.startsWith("0")){
      validphoneNumber = "+972" + phoneNumber.substr(1);
    }else if(phoneNumber.startsWith("9")){
      validphoneNumber = "+" + phoneNumber
    }else{
      validphoneNumber = "+972" + phoneNumber
    }

    const textMessage = {
        body:data.text,
        to: validphoneNumber,  // Text to this number
        from: twilioNumber // From a valid Twilio number
    }

    return client.messages.create(textMessage).then((msg:any)=>{
        console.log(msg, 'success')
    }).catch((err:any)=>console.log(err));
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
                type:"csv"
            }
        ],
    };
  
   await sgMail.send(msg).catch((err)=>{
       return {success: false};
   });
  
    // Handle errors here
  
    // Response must be JSON serializable
    return { success: true };
  });