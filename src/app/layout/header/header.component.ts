import { Component, OnInit } from "@angular/core";
import { PaymentData } from './../../models/paymentmodel';
import { AuthService } from "src/app/auth/auth.service";
import { Router } from "@angular/router";
import { CsvUserData } from "../../models/csvmodel";
import { SendCommandService } from "src/app/services/send-command.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "header.component.html",
  styleUrls: ["header.component.scss"]
})

export class HeaderComponent implements OnInit {
  user: firebase.User;
  _error: string = "";
  costumer: any;
  user_data: CsvUserData;

  self_text: string = "";
  debtName: string = "";
  creditName: string = "";
  pasportNumber: string = "";
  debtNumber: string = "";
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
    private sendService: SendCommandService
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
  onckickDebt(){
    this.router.navigate(["/debt"]);
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
}






