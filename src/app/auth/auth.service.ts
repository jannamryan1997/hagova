import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { UserUpdateData, UserNewEmailAndPass } from "../models/csvmodel";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private eventAuthError = new BehaviorSubject<string>("");
  eventAuthError$ = this.eventAuthError.asObservable();

  newUser: any;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router
  ) {}

  getUserState() {
    return this.afAuth.authState;
  }

  login(email: string, password: string) {
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        this.eventAuthError.next(error);
      })
      .then(userCredential => {
        if (userCredential) {
          this.router.navigate(["/home"]);
        }
      });
  }

  createUser(user) {
    console.log(user);

    this.afAuth.auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(userCredentiol => {
        this.newUser = user;

        console.log(userCredentiol);

        userCredentiol.user.updateProfile({
          displayName: user.firstName + " " + user.lastName
        });

        this.insertUserData(userCredentiol).then(() => {
          this.router.navigate(["/home"]);
        });
      })
      .catch(error => {
        this.eventAuthError.next(error);
      });
  }

  insertUserData(userCredentiol: firebase.auth.UserCredential) {
    return this.db.doc(`Users/${userCredentiol.user.uid}`).set({
      email: this.newUser.email,
      firstName: this.newUser.firstName,
      lastName: this.newUser.lastName,
      phoneNum: this.newUser.phoneNum,
      bankNum: this.newUser.bankNum,
      bankLocationNum: this.newUser.bankLocationNum,
      bankName: this.newUser.bankName
    });
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  sendReset(mail: string) {
    this.afAuth.auth
      .sendPasswordResetEmail(mail)
      .then(() => {})
      .catch(function(error) {
        return "failure";
      })
      .then(() => {
        this.router.navigate(["/home"]);
      });
  }

  updateData(new_data: UserUpdateData, user_uid: string) {
    let err: any;
    err = new Error("הטקסט חייב להיות בעברית");

    if (
      !this.isHebrew(new_data.firstName) ||
      !this.isHebrew(new_data.lastName) ||
      !this.isHebrew(new_data.bankName)
    ) {
      this.eventAuthError.next(err);
      return;
    }

    if (!/^[0-9//]*$/.test(new_data.phoneNum)) {
      err = new Error("מספר הטלפון חייב להיות מורכב מספרות בלבד");
      this.eventAuthError.next(err);
      return;
    }

    if (!/^\d+$/.test(new_data.bankLocationNum)) {
      err = new Error("מספר סניף הבנק חייב להיות מורכב מספרות בלבד");
      this.eventAuthError.next(err);
      return;
    }

    if (!/^\d+$/.test(new_data.bankNum)) {
      err = new Error("מספר חשבון הבנק חייב להיות מורכב מספרות בלבד");
      this.eventAuthError.next(err);
      return;
    }

    this.afAuth.auth.currentUser
      .updateProfile({
        displayName: new_data.firstName + " " + new_data.lastName
      })
      .then(() => {
        return this.db
          .doc(`Users/${user_uid}`)
          .update({
            firstName: new_data.firstName,
            lastName: new_data.lastName,
            phoneNum: new_data.phoneNum,
            bankNum: new_data.bankNum,
            bankLocationNum: new_data.bankLocationNum,
            bankName: new_data.bankName
          })
          .catch(error => {
            this.eventAuthError.next(error);
          })
          .then(() => {
            this.router.navigate(["/home"]);
          });
      })
      .catch(error => {
        this.eventAuthError.next(error);
        return;
      });
  }

  UpdateUserEmailAndPassword(
    newData: UserNewEmailAndPass,
    is_new_email: boolean,
    is_new_password: boolean
  ) {
    this.eventAuthError.next("");

    if (is_new_email) {
      this.afAuth.auth.currentUser
        .updateEmail(newData.newEmail)
        .then(() => {
          this.router.navigate(["/home"]);
        })
        .catch(error => {
          this.eventAuthError.next(error);
          return;
        });
    }
    if (is_new_password) {
      if (newData.newPassword != newData.newPassword2) {
        let err: any;
        err = new Error("הסיסמאות לא תואמות ");
        this.eventAuthError.next(err);
        return;
      }

      if (newData.newPassword == "") {
        this.router.navigate(["/home"]);
      }

      this.afAuth.auth.currentUser
        .updatePassword(newData.newPassword)
        .then(() => {
          this.router.navigate(["/home"]);
        })
        .catch(error => {
          this.eventAuthError.next(error);
          return;
        });
    }
  }

  private isHebrew(text: string) {
    var hebrew = /[\u0590-\u05FF\s]+$/;
    if (hebrew.test(text)) {
      return true;
    }

    return false;
  }
}
