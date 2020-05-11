import { PaymentData } from '../models/paymentmodel';
import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { CsvUserData } from '../models/csvmodel';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SendCommandService {

  constructor(
    private fun: AngularFireFunctions,
    private db:AngularFirestore,
  ) { }
   async SendPayment(data:PaymentData):Promise<any> {
	const callable = this.fun.httpsCallable('payment');
    const res = await callable(data).toPromise()
    return res;
  }

  async SendPay(data:any):Promise<any> {
    const callable = this.fun.httpsCallable('pay');
      const res = await callable(data).toPromise()
      return res;
    }
  SendGenericEmail(costumer_name:string, debtor:CsvUserData, _msgNum:number, phoneNum:string, _date:string ):boolean
  {
    const callable = this.fun.httpsCallable('genericEmail');
    
    let local_date:string = ""; 

    callable({ 
      myName: costumer_name, 
      subject: 'מייל מחברת סוגרים חשבון', 
      name:debtor.firstName +" "+ debtor.lastName,
      to:debtor.email,
      price:this.numberWithCommas(debtor.debtSum) +"."+debtor.debtSumAgorot.toString(),
      date:_date,
      msgNum:_msgNum,
      phone:phoneNum
    }).toPromise().then(()=>{
      console.log("mail ok");
    }).catch((err)=>{
      console.log(err);
      return false;
    })

    return true;
  }

  SendGenericSms(debtor:CsvUserData, _text:string):boolean
  {
    const callable = this.fun.httpsCallable('sendSmsGeneric');

    callable({ 
      phoneNumber:debtor.phoneNum,
      text:_text
    }).toPromise().then(()=>{
      console.log("sms ok");
    }).catch((err)=>{
      console.log(err);
      return false;
    })

    return true;
  }

  SendFreeTextEmail(debtor:CsvUserData, _text:string):boolean
  {
    const callable = this.fun.httpsCallable('freeTextEmail');

    callable({ 
      to:debtor.email,
      subject: 'מייל מחברת סוגרים חשבון', 
      text:_text
    }).toPromise().then(()=>{
      console.log("mail ok");
    }).catch((err)=>{
      console.log(err);
      return false;
    })

    return true;
  }

  SendLetterOrCall(costumer_name:string, cosumer_email:string ,cosumer_phone:string, debtor:CsvUserData, _to:string):boolean
  {
    let date_plus_30 = new Date();
    date_plus_30.setDate(date_plus_30.getDate() + 30);

    const str = 'יום,סוג העבודה שבוצעה,מיום,מייל החייב,טל החייב,גובה החוב,עיר מגורי החייב,רחוב ומספר בית החייב,מספר זהות החייב,שם פרטי של החייב,שם משפחה של החייב,טלפון הלקוח שלנו,שם הלקוח שלנו, מייל הלקוח שלנו'+'\n'+
    this.format(date_plus_30)+','+ "סוג העבודה"+','+this.format(debtor.debtDate) +','+debtor.email+','+debtor.phoneNum+','+debtor.debtSum+"."+debtor.debtSumAgorot+','+debtor.addressCity+',' +debtor.addressStreet+',' +"מספר זהות"+',' +debtor.firstName+','+debtor.lastName+','+cosumer_phone +',' + costumer_name+',' +cosumer_email+',';

    const callable = this.fun.httpsCallable('sendMihtavBClickMail');
    callable({ 
      to:_to,
      subject: 'מייל מחברת סוגרים חשבון', 
      atch:btoa(unescape(encodeURIComponent(str)))

    }).toPromise().then(()=>{
      console.log("mail ok");
    }).catch((err)=>{
      console.log(err);
      return false;
    })

    return true;
  }

  GetUserFiledData(uid)
  {
    return this.db.collection("Users").doc(uid).valueChanges();
  }
  
  private format(date: Date): string {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
  }

  private _to2digit(n: number) {
    return ('00' + n).slice(-2);
  } 

  private numberWithCommas(x:number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
