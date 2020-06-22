import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
public loading:boolean=false;
  authError: any;

  constructor(private auth: AuthService, private _cookieService: CookieService) { }

  ngOnInit() {
    this.auth.eventAuthError$.subscribe(data => {
      this.authError = data;
    });
  }

  login(frm) {
    this.auth.login(frm.value.email, frm.value.password);
    this._cookieService.put('userEmail', frm.value.email);
    this.loading=true;
  }
}
