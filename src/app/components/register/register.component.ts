import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  authError:any; 
  firstname:string;
  lastname:string;
  email:string;
  phoneNum:string;
  bankNum:string;
  password:string;
  passwordRep:string;
  bankName:string;
  bankLocationNum:string;
  
  checked = false;

  constructor(
    private auth:AuthService, 
    private router:Router
    ) { }

  ngOnInit() {
    this.auth.eventAuthError$.subscribe(data=>{
      this.authError = data;
    })
  }

  createUser(frm){
    console.log(frm.value.password);
    if(frm.value.password === frm.value.passwordRep){
      this.auth.createUser(frm.value);
    }else{
      alert("ססמאות לא תואמות");
    }
  }

  termsAndConditions(){
    this.router.navigate(['/terms']);
  }
}
