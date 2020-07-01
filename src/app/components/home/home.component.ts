import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { Router } from "@angular/router";
import { CsvUserData } from "../../models/csvmodel";
import { ConfirmationService } from "primeng/api";
import { SendCommandService } from "src/app/services/send-command.service";
import { Subscription } from "rxjs";
import { ToPayModal } from 'src/app/mdals/to-pay/to-pay.modal';
import { MatDialog } from '@angular/material';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  providers: [ConfirmationService]
})
export class HomeComponent implements OnInit, OnDestroy {
  pasportName:string="";
  user: firebase.User;
  _error: string = "";
  costumer: any;
  user_data: CsvUserData;

  self_text: string = "";
  firstname: string;
  lastname: string;
  email: string;
  phoneNum: string;
  addressCity: string;
  addressStreet: string;
  debtDate: Date;
  remainderDate: Date;
  debtSum: number;
  debtSumAgorot: number;

  checkedEmail: boolean;
  checkedSms: boolean;
  checkedMail: boolean;
  checkedCall: boolean;
  checkedReminderSms: boolean;
  checkedReminderEmail: boolean;
  checkedText: boolean;
  add_gviya_comment: boolean = false;
  gviya_comment_text: string = "";
  price: number = 0;

  _sms: number = 0;
  _emails: number = 0;
  _mails: number = 0;

  good_display: boolean = false;
  success_display: string = "";

  bad_display: boolean = false;
  error_disp: boolean = false;
  error_text: string = "";

  email_exampel: boolean = false;
  sms_exampel: boolean = false;
  mihtav_exampel: boolean = false;
  remainder_exampel: boolean = false;

  user_sub: Subscription;
  customer_data_sub: Subscription;
  today = new Date();

  constructor(
    private auth: AuthService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private sendService: SendCommandService,
    private _dialog: MatDialog,
  ) {
    this.today.setDate(this.today.getDate());
  }

  ngOnInit() {
    this.user_sub = this.auth.getUserState().subscribe(user => {
      this.user = user;
      if (user) {
        this.customer_data_sub = this.sendService
          .GetUserFiledData(this.user.uid)
          .subscribe(async (customer_data: any) => {
            this.costumer = customer_data;
          });
      }
    });

    this.user_data = new CsvUserData();
  }

  ngOnDestroy() {
    if (this.customer_data_sub) {
      this.customer_data_sub.unsubscribe();
    }
    if (this.user_sub) {
      this.user_sub.unsubscribe();
    }
  }


  sendLetter(frm) {
    console.log(frm);
    this.user_data.firstName = frm.value.firstName;
    this.user_data.lastName = frm.value.lastName;
    this.user_data.email = frm.value.email;

    if (!/^\d+$/.test(frm.value.phoneNum)) {
      this._error = "מספר הטלפון חייב להכיל רק ספרות";

      return;
    }

    this.user_data.phoneNum = frm.value.phoneNum;
    this.user_data.addressCity = frm.value.addressCity;
    this.user_data.addressStreet = frm.value.addressStreet;
    this.user_data.debtDate = frm.value.debtDate;

    if (!/^\d+$/.test(frm.value.debtSum)) {
      this._error = "סכום החוב חייב להכיל רק ספרות";

      return;
    }

    this.user_data.debtSum = frm.value.debtSum;

    if (!frm.value.debtSumAgorot) {
      frm.value.debtSumAgorot = 0;
    }

    this.user_data.debtSumAgorot = frm.value.debtSumAgorot;

    this.confirm();
    this._error = "";
  }

  confirm() {

    console.log("gggggggggggg");
    
    this.confirmationService.confirm({
      message: "האם אתה בטוח שברצונך לשלוח את הטופס?",
      accept: () => {
        let is_email_ok: boolean = true;
        let is_sms_ok: boolean = true;
        let is_mihtav: boolean = true;
        let is_call: boolean = true;
        let is_remainder: boolean = true;
        let is_remainder_email: boolean = true;

        let success_text: string = "";
        let error_text: string = "";

        if (this.checkedEmail == true) {
          is_email_ok = this.sendService.SendGenericEmail(
            this.user.displayName,
            this.user_data,
            0,
            "02-6590334",
            this.format(this.user_data.debtDate)
          );
        }

        // if(this.checkedReminderEmail == true){
        //   if(this.remainderDate == undefined){
        //     this.ShowErrorDialog('אנה הזן תאריך לתשלום החוב בכרטיס תזכורת לחייב באמצעות סמס או אימייל');
        //     return;
        //   }

        //   is_remainder_email = this.sendService.SendGenericEmail(this.user.displayName,this.user_data, 1, this.costumer.phoneNum,this.format(this.remainderDate));
        // }

        if (this.checkedSms == true) {
          let text: string =
            `\n${this.user_data.firstName +
            " " +
            this.user_data.lastName} שלום,\n` +
            `בשם מרשי ${
            this.user.displayName
            }, הנך נדרש לשלם סך של ${this.numberWithCommas(
              this.user_data.debtSum
            )}.${this.user_data.debtSumAgorot} שקלים בעבור השירות ש${
            this.user.displayName
            } ביצע עבורך בתאריך ${this.format(this.user_data.debtDate)}.\n` +
            "הנך נדרש לשלם סך זה בהקדם. " +
            `במידה ולא תשלם, ${this.user.displayName} שומר לעצמו את האפשרות לנקוט בהליכים משפטיים נגדך.\n` +
            "\n" +
            'צפריר בר-אילן, עו"ד' +
            `\nטל: 02-6590334`;

          is_sms_ok = this.sendService.SendGenericSms(this.user_data, text);
        }

        if (this.checkedReminderSms == true) {
          if (this.remainderDate == undefined) {
            this.ShowErrorDialog(
              "אנה הזן תאריך לתשלום החוב בכרטיס תזכורת לחייב באמצעות סמס או אימייל"
            );
            return;
          }
          if (this.self_text == "" && this.checkedText == true) {
            this.ShowErrorDialog(
              "אנה הזן טקסט חופשי לשליחה או בטל סימון טקסט חופשי"
            );
            return;
          }

          let text: string;
          if (this.checkedText == true) {
            text = this.self_text;
          } else {
            text =
              `\n${this.user_data.firstName +
              " " +
              this.user_data.lastName} שלום,\n` +
              `להזכירך, עליך לשלם סך של ${this.numberWithCommas(
                this.user_data.debtSum
              )}.${this.user_data.debtSumAgorot} שקלים, עד ליום ${this.format(
                this.remainderDate
              )}.` +
              `\nבברכה,\n${this.user.displayName}` +
              `\nטל: ${this.costumer.phoneNum}`;
          }

          is_remainder = this.sendService.SendGenericSms(this.user_data, text);
        }

        if (this.checkedReminderEmail == true) {
          if (this.remainderDate == undefined) {
            this.ShowErrorDialog(
              "אנה הזן תאריך לתשלום החוב בכרטיס תזכורת לחייב באמצעות סמס או אימייל"
            );
            return;
          }
          if (this.self_text == "" && this.checkedText == true) {
            this.ShowErrorDialog(
              "אנה הזן טקסט חופשי לשליחה או בטל סימון טקסט חופשי"
            );
            return;
          }

          let text: string;
          if (this.checkedText == true) {
            text = this.self_text;
            is_remainder_email = this.sendService.SendFreeTextEmail(
              this.user_data,
              text
            );
          } else {
            is_remainder_email = this.sendService.SendGenericEmail(
              this.user.displayName,
              this.user_data,
              1,
              this.costumer.phoneNum,
              this.format(this.remainderDate)
            );
          }
        }

        if (this.checkedMail == true) {
          is_mihtav = this.sendService.SendLetterOrCall(
            this.user.displayName,
            this.user.email,
            this.costumer.phoneNum,
            this.user_data,
            "support@clickb.co.il"
          );
        }

        if (this.checkedCall == true) {
          var call_text =
            "שם הלקוח:" +
            this.user.displayName +
            "|| שם החייב:" +
            this.user_data.firstName +
            " " +
            this.user_data.lastName +
            " \n || " +
            "טלפון החייב:" +
            this.user_data.phoneNum +
            "|| " +
            "מייל החייב:" +
            this.user_data.email +
            " \n || " +
            "סכום החוב בשקלים:" +
            this.user_data.debtSum +
            " \n || " +
            "טקסט חופשי מהלקוח: " +
            this.gviya_comment_text;

          let new_data = new CsvUserData();

          new_data.email = "biby1234@gmail.com";

          is_call = this.sendService.SendFreeTextEmail(new_data, call_text);

          // is_call = this.sendService.SendLetterOrCall(
          //   this.user.displayName,
          //   this.user.email,
          //   this.costumer.phoneNum,
          //   this.user_data,
          //   "sima@simarketing.co.il"
          // );
        }

        if (this.checkedEmail == true) {
          if (is_email_ok == true) {
            success_text += "\n | המייל נשלח בהצלחה";
          } else {
            error_text += "\n | שליחת המייל נכשל";
          }
        }

        if (this.checkedReminderEmail == true) {
          if (is_remainder_email == true) {
            success_text += "\n |תזכורת המייל נשלחה בהצלחה ";
          } else {
            error_text += "\n | שליחת תזכורת המייל נכשלה";
          }
        }

        if (this.checkedSms == true) {
          if (is_sms_ok == true) {
            success_text += "\n | הסמס נשלח בהצלחה";
          } else {
            error_text += "\n | שליחת הסמס נכשל";
          }
        }

        if (this.checkedReminderSms == true) {
          if (is_remainder == true) {
            success_text += "\n | התזכורת נשלחה בהצלחה";
          } else {
            error_text += "\n | שליחת התזכורת נכשלה";
          }
        }

        if (this.checkedMail == true) {
          if (is_mihtav == true) {
            success_text += "\n | המכתב נשלח בהצלחה";
          } else {
            error_text += "\n | שליחת המכתב נכשל";
          }
        }

        if (this.checkedCall == true) {
          if (is_call == true) {
            success_text += "\n | חברת הגבייה קיבלה את הפרטים בהצלחה";
          } else {
            error_text += "\n | חברת הגבייה לא קיבלה את הפרטים בהצלחה";
          }
        }

        if (
          is_sms_ok &&
          is_email_ok &&
          is_mihtav &&
          is_call &&
          is_remainder &&
          is_remainder_email
        ) {
          this.showGoodDialog(success_text);
        } else {
          this.ShowErrorDialog(error_text);
        }
      }
    });
  }

  addEmailService() {
    if (this.checkedEmail == true) {
      this.addToPrice(5);
    } else {
      this.subFromPrice(5);
    }
  }

  addSmsService() {
    if (this.checkedSms == true) {
      this.addToPrice(5);
    } else {
      this.subFromPrice(5);
    }
  }

  addMailService() {
    if (this.checkedMail == true) {
      this.addToPrice(20);
    } else {
      this.subFromPrice(20);
    }
  }

  addCallService() {
    if (this.checkedCall == true) {
      this.addToPrice(5);
    } else {
      this.subFromPrice(5);
    }
  }

  addToPrice(num: number) {
    this.price += num;
  }

  subFromPrice(num: number) {
    this.price -= num;
  }

  myUploader(event) {
    console.log(event);
  }

  sendEmail() { }

  showGoodDialog(text: string) {
    this.success_display = text;
    this.good_display = true;
  }

  showBadDialog() {
    this.bad_display = true;
  }

  ShowEmailExample() {
    this.email_exampel = true;
  }

  ShowSmsExample() {
    this.sms_exampel = true;
  }

  ShowMihtavExample() {
    this.mihtav_exampel = true;
  }

  ShowReminderExample() {
    this.remainder_exampel = true;
  }

  ShowErrorDialog(text: string) {
    this.error_text = text;
    this.error_disp = true;
  }

  CloseErrorDialog() {
    this.error_text = "";
    this.error_disp = false;
  }

  private numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  private format(date: Date): string {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return this._to2digit(day) + "/" + this._to2digit(month) + "/" + year;
  }

  private _to2digit(n: number) {
    return ("00" + n).slice(-2);
  }


  // public mushulam(): void {
  //   this._dialog.open(ToPayModal, {
  //     width: "560px",
  //     data: {
  //       sum: this.debtSum,
  //     }
  //   })
  // }
}
