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
  debtName: string;
  creditName: string;
  pasportNumber: string;
  debtNumber: string;

  debtSum: string;
  debtSumAgorot: string;

  price:string
  _sms: number = 0;
  _emails: number = 0;
  _mails: number = 0;

  user_sub: Subscription;
  customer_data_sub: Subscription;
  today = new Date();
  payPalConfig
  constructor(
    private auth: AuthService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private sendService: SendCommandService
  ) {
	this.today.setDate(this.today.getDate());
	this.initConfig()
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

  meshulam(){
	const data:PaymentData = { 
		FullName:"karine karapeyan",
		Email:"jannamryan8@gmail.com",
		Phone:	"+37494858585",
		Sum:parseInt(this.debtSum)+parseInt(this.debtSumAgorot)*0.01
	  }
	 // this.router.navigate(["/payment"]);
	 this.sendService.SendPayment(data).then((res:any)=>{
		 console.log(res);
		 if(res.success){
			this.router.navigate(["/payment"],{queryParams:{url:res.result.ClearingRedirectUrl}})
		 }
	 })

  }

  paypel(){

  }
  private initConfig(): void {
	this.payPalConfig = {
		currency: 'EUR',
		clientId: 'sb',
		createOrder: (data) => < ICreateOrderRequest > {
			intent: 'CAPTURE',
			purchase_units: [{
				amount: {
					currency_code: 'EUR',
					value: '9.99',
					breakdown: {
						item_total: {
							currency_code: 'EUR',
							value: '9.99'
						}
					}
				},
				items: [{
					name: 'Enterprise Subscription',
					quantity: '1',
					category: 'DIGITAL_GOODS',
					unit_amount: {
						currency_code: 'EUR',
						value: '9.99',
					},
				}]
			}]
		},
		advanced: {
			commit: 'true'
		},
		style: {
			label: 'paypal',
			layout: 'vertical'
		},
		onApprove: (data, actions) => {
			console.log('onApprove - transaction was approved, but not authorized', data, actions);
			actions.order.get().then(details => {
				console.log('onApprove - you can get full order details inside onApprove: ', details);
			});

		},
		onClientAuthorization: (data) => {
			console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
			//this.showSuccess = true;
		},
		onCancel: (data, actions) => {
			console.log('OnCancel', data, actions);
		//	this.showCancel = true;

		},
		onError: err => {
			console.log('OnError', err);
		//	this.showError = true;
		},
		onClick: (data, actions) => {
			console.log('onClick', data, actions);
		//	this.resetStatus();
		},
	};
}
}
