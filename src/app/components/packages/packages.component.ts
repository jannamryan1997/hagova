import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { AngularFireFunctions } from '@angular/fire/functions';
import { PaymentData } from 'src/app/models/paymentmodel';
import { SendCommandService } from 'src/app/services/send-command.service';
@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {
 
  user: firebase.User;
  user_sub:Subscription;

  error_text:string;
  error_disp:boolean = false;

  constructor(
    private auth: AuthService, 
    private router:Router,
	private fun: AngularFireFunctions,
	private sendService: SendCommandService

  ) { }

  ngOnInit() {
    this.user_sub = this.auth.getUserState()
      .subscribe(user => {
        this.user = user;
      });
  }
  getBack(){
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

  public sendPayment(sum:number):boolean{
	const data:PaymentData = { 
		FullName:"karine karapeyan",
		Email:"jannamryan8@gmail.com",
		Phone:	"+37494858585",
		Sum:sum
	  }
	 // this.router.navigate(["/payment"]);
	 this.sendService.SendPayment(data).then((res:any)=>{
		 console.log(res);
		 if(res.success){
			this.router.navigate(["/payment"],{queryParams:{url:res.result.ClearingRedirectUrl}})
		 }
	 })
	 return true;
  }

  ShowErrorDialog(text:string){
    this.error_text = text;
    this.error_disp = true;
  }

  CloseErrorDialog(){
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
