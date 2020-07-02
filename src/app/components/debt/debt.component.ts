import { PaymentData } from './../../models/paymentmodel';
import { Component, OnInit, OnDestroy, AfterViewChecked } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { Router, ActivatedRoute } from "@angular/router";
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
export class DebtComponent implements OnInit, OnDestroy, AfterViewChecked {
  public packageSum;
  params;
  public hidedebtNumber: boolean = true;
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
  pasportName: string = "";

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
    private sendService: SendCommandService,
    private _activatedRoute: ActivatedRoute,
  ) {
    this.today.setDate(this.today.getDate());
    this._activatedRoute.queryParams.subscribe((params) => {
      this.params = params;
      console.log(params);
      if (params && params.sum) {
        this.packageSum = params.sum;
      }
      if (params && params.murshulam) {
        this.hidedebtNumber = false;
      }
    })

  }

  ngAfterViewChecked(): void {
    // if (this.params && this.params.sum) {
    //   this.debtSum = this.params.sum;
    // }
    // if (this.params && this.params.murshulam) {
    //   this.hidedebtNumber = false;
    // }
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

  // meshulam() {
  // let sum=parseInt(this.debtSum) + parseInt(this.debtSumAgorot) * 0.01
  //   this.router.navigate(['/pay'],
  //     {
  //       queryParams:
  //       {
  //         FullName: this.creditName,
  //         Email: this.pasportNumber,
  //         Phone: this.debtNumber,
  //         Sum:sum
  //       }
  //     })

  // }

  meshulam() {
    let ID: number;
    if (this.params && this.params.murshulam) {
      const data: any = {
        name: this.creditName,
        email: this.pasportNumber,
        phone: '',
        price: this.packageSum,
        pasport: this.pasportName,
      }

      this.sendService.createCustomeray(data).then((res: any) => {
        if (!res.Errors) {
          ID = res.ID
        }
        this.router.navigate(['/pay'], { queryParams: { FullName: this.creditName, Email: this.pasportNumber, Phone: this.debtNumber, Sum: this.packageSum, ID: res.ID } });

      })
    }



    else  {
      let sum = parseInt(this.debtSum) + parseInt(this.debtSumAgorot) * 0.01;
      const data: any = {
        name: this.creditName,
        email: this.pasportNumber,
        phone: this.debtNumber,
        price: this.packageSum,
        pasport: this.pasportName,
        sum: sum,
      }
      this.sendService.createCustomeray(data).then((res: any) => {

        if (!res.Errors) {
          ID = res.ID
        }
        this.router.navigate(['/pay'], { queryParams: { FullName: this.creditName, Email: this.pasportNumber, Phone: this.debtNumber, Sum: sum, ID: res.ID } });

      })
    }


  }

}

