import { Component, OnInit } from "@angular/core";
import { AuthService } from 'src/app/auth/auth.service';
import { ICreateOrderRequest } from 'ngx-paypal';
import { SendCommandService } from "src/app/services/send-command.service";
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentData } from 'src/app/models/paymentmodel';
import { AngularFireFunctions } from '@angular/fire/functions';
import { CookieService } from 'ngx-cookie';
@Component({
    selector: "app-payPal",
    templateUrl: "payPal.component.html",
    styleUrls: ["payPal.component.scss"]
})

export class PayPalComponent implements OnInit {
    public payPalConfig;


	public user
    public email: "1";
    public fullName: "fdfdfd";
    public phone: "2";
    public sum: "44444444.01";
    public id:number;
    constructor(
        private fun: AngularFireFunctions,
        private _auth: AuthService,
        private sendService: SendCommandService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _cookieService: CookieService,
    ) {
        this._activatedRoute.queryParams.subscribe((params) => {
            console.log(params);
            this.email = params.Email,
                this.fullName = params.FullName,
                this.phone = params.Phone,
                this.sum = params.Sum,
                this.id=params.ID


        })
    }

    ngOnInit() {
        this._initConfig()
    }
    public logout(): void {
        this._auth.logout();
    }

    public meshulam(): void {

        const data: PaymentData = {
            FullName: this.fullName,
            Email: this.email,
            Phone: this.phone,
            Sum: parseInt(this.sum),
        }
        this.sendService.SendPayment(data).then((res: any) => {
            console.log(res,"resultat meshulam");
            if (res.success) {
                
                this._router.navigate(["/payment"], { queryParams: { url: res.result.ClearingRedirectUrl } });
            }
        })
    }


    private _initConfig(): void {


        this.payPalConfig = {
            currency: 'EUR',
            clientId: 'sb',
            createOrder: (data) => <ICreateOrderRequest>{


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
                console.log(data, "data");

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
                console.log("hhhhhhh");
                console.log('onClick', data, actions);
                //	this.resetStatus();
            },
        };
    }

    public paypalClick(): void {
        const data: any = {
            price: this.sum,
            uid: 155
        }
        this.sendService.SendPay(data).then((res: any) => {
            console.log(res);
            if (res.success) {
                this._cookieService.put('success', res.href);
                this._router.navigate(["/payment"], { queryParams: { url: res.href } })
            }
        })


    }
}