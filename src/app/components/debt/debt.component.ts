import { PaymentData } from './../../models/paymentmodel';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { Router } from "@angular/router";
import { CsvUserData } from "../../models/csvmodel";
import { ConfirmationService } from "primeng/api";
import { SendCommandService } from "src/app/services/send-command.service";
import { Subscription } from "rxjs";
import {
  IPayPalConfig,
  ICreateOrderRequest
} from 'ngx-paypal';
@Component({
  selector: "app-debt",
  templateUrl: "./debt.component.html",
  styleUrls: ["./debt.component.scss"],
  providers: [ConfirmationService]
})
export class DebtComponent implements OnInit, OnDestroy {
  user: firebase.User;
  _error: string = "";
  costumer: any;
  user_data: CsvUserData;

  self_text: string = "";
  debtName: string = "janna";
  creditName: string = "mryan";
  pasportNumber: string = "janna.mryan@mail.ru";
  debtNumber: string = "12345";
  debtSum: string = "";
  debtSumAgorot: string = "";
  
  price: string
  _sms: number = 0;
  _emails: number = 0;
  _mails: number = 0;

  user_sub: Subscription;
  customer_data_sub: Subscription;
  today = new Date();

  constructor(
    private auth: AuthService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private sendService: SendCommandService
  ) {
    this.today.setDate(this.today.getDate());
  }

  ngOnInit() {
    console.log(this.debtSum);

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

  register() {
    this.router.navigate(["/register"]);
  }

  logout() {
    this.auth.logout();
  }

  login() {
    this.router.navigate(["/login"]);
  }

  myAccount() {
    this.router.navigate(["/my-account"]);
  }

  about() {
    this.router.navigate(["/about"]);
  }

  choosePackage() {
    this.router.navigate(["/packages"]);
  }

  meshulam() {
  let sum=parseInt(this.debtSum) + parseInt(this.debtSumAgorot) * 0.01
    this.router.navigate(['/pay'],
      {
        queryParams:
        {
          FullName: this.creditName,
          Email: this.pasportNumber,
          Phone: this.debtNumber,
          Sum:sum
        }
      })

  }

  paypel() {

  }

}
