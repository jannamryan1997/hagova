import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { AngularFireFunctions } from '@angular/fire/functions';
import { PaymentData } from 'src/app/models/paymentmodel';
import { SendCommandService } from 'src/app/services/send-command.service';
import { MatDialog } from '@angular/material';
import { ToPayModal } from 'src/app/mdals/to-pay/to-pay.modal';
import { CookieService } from 'ngx-cookie';
@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {

  user: firebase.User;
  user_sub: Subscription;
  error_text: string;
  error_disp: boolean = false;
public loading:boolean=false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private fun: AngularFireFunctions,
    private sendService: SendCommandService,
    private _dialog: MatDialog,
    private _coolieService: CookieService,
    private _router: Router,
  ) { }

  ngOnInit() {
    this.user_sub = this.auth.getUserState()
      .subscribe(user => {
        this.user = user;
      });
  }
  getBack() {
    this.router.navigate(['/home']);
  }

  //goldPacket(){
  // if(!this.user){
  //  this.ShowErrorDialog("אנא התחבר למערכת");
  //  return;
  //  }
  // console.log("gold click")
  // }

  // regularPacket(){
  //   if(!this.user){
  //     this.ShowErrorDialog("אנא התחבר למערכת");
  //     return;
  //   }

  //   console.log("regular click")

  // }

  public sendPayment(sum: number) {
    let userEmail: string;
    userEmail = this._coolieService.get('userEmail');
    // const data:PaymentData = { 
    // 	FullName:"karine karapeyan",
    // 	Email:"jannamryan8@gmail.com",
    // 	Phone:	"+37494858585",
    // 	Sum:sum
    //   }
    //  this.sendService.SendPayment(data).then((res:any)=>{
    // 	 console.log(res);
    // 	 if(res.success){
    // 		this.router.navigate(["/payment"],{queryParams:{url:res.result.ClearingRedirectUrl}})
    // 	 }
    //  })
    //  return true;
    // this._dialog.open(ToPayModal, {
    //   width: "560px",
    //   data: {
    //     sum: sum,
    //   }
    // })

    this._router.navigate(['/debt'],{ queryParams: { sum: sum, murshulam:'true' } });
  
 
  }


  private _murshulam(sum: number, userEmail: string): void {
    this.loading=true;
    sum = sum;
    console.log(sum);

    let ID: number;
    const data: any = {
      name: null,
      email: userEmail,
      phone: null,
      price: sum,
    }
    this.sendService.createCustomeray(data).then((res: any) => {
   
      console.log(res);
      if (!res.Errors) {
        ID = res.ID
        this.loading=false;
      }
      this._router.navigate(['/pay'], { queryParams: { FullName: data.name, Email: data.email, Phone: data.phone, Sum: sum, ID: res.ID } });

    })
  }





  ShowErrorDialog(text: string) {
    this.error_text = text;
    this.error_disp = true;
  }

  CloseErrorDialog() {
    this.error_text = "";
    this.error_disp = false;
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
