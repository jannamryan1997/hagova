import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireFunctions } from '@angular/fire/functions';
import { PaymentData } from 'src/app/models/paymentmodel';
import { SendCommandService } from 'src/app/services/send-command.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
 
  user: firebase.User;
  user_sub:Subscription;
  url:SafeResourceUrl
error_text:string;
  error_disp:boolean = false;

  constructor(
    private auth: AuthService, 
	private router:Router,
	private route:ActivatedRoute,
	private fun: AngularFireFunctions,
	private sendService: SendCommandService,
	private _httpClient: HttpClient,
	private sanitizer: DomSanitizer
  ) { 
	this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.router.getCurrentNavigation().extras.queryParams.url);
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
  ngOnInit() {
    this.user_sub = this.auth.getUserState()
      .subscribe(user => {
        this.user = user;
        console.log(this.user);
        
	  });
	
	//  console.log(this.router);
	  
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


  ShowErrorDialog(text:string){
    this.error_text = text;
    this.error_disp = true;
  }

  CloseErrorDialog(){
    this.error_text = "";
    this.error_disp = false;
  }
}
