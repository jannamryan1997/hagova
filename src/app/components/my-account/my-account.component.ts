import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { SendCommandService } from "src/app/services/send-command.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.component.html",
  styleUrls: ["./my-account.component.scss"]
})
export class MyAccountComponent implements OnInit {
  user: firebase.User;
  user_sub: Subscription;
  customer_data_sub: Subscription;

  firstname: string;
  lastname: string;
  phoneNum: string;
  bankNum: string;
  bankName: string;
  bankLocationNum: string;

  newPassword2: string;
  newPassword: string;
  newEmail: string;

  read_only: boolean = false;
  read_only_email: boolean = false;
  read_only_password: boolean = false;

  authError: any;

  constructor(
    private auth: AuthService,
    private sendService: SendCommandService
  ) {}

  ngOnInit() {
    this.auth.eventAuthError$.subscribe(data => {
      this.authError = data;
    });

    this.user_sub = this.auth.getUserState().subscribe(user => {
      this.user = user;
      if (user) {
        this.customer_data_sub = this.sendService
          .GetUserFiledData(this.user.uid)
          .subscribe(async (customer_data: any) => {
            console.log(customer_data);
            this.firstname = customer_data.firstName;
            this.lastname = customer_data.lastName;
            this.phoneNum = customer_data.phoneNum;
            this.bankNum = customer_data.bankNum;
            this.bankName = customer_data.bankName;
            this.bankLocationNum = customer_data.bankLocationNum;
          });

        this.newPassword2 = "";
        this.newPassword = "";
        this.newEmail = user.email;
      }
    });
  }

  editData(frm) {
    this.auth.updateData(frm.value, this.user.uid);
  }

  editEmailAndPassword(frm) {
    this.auth.UpdateUserEmailAndPassword(
      frm.value,
      this.read_only_email,
      this.read_only_password
    );
  }
}
