import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";

//components
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { HomeComponent } from "./components/home/home.component";
import { TermsComponent } from "./components/terms/terms.component";
import { LogoComponent } from "./components/logo/logo.component";

//router module
import { AppRoutingModuleModule } from "./app-routing-module/app-routing-module.module";

//material modules
import { MaterialModule } from "./material/material.module";
import { PrimengModule } from "./primeng/primeng.module";
import { NgxPayPalModule } from "ngx-paypal";
//firebase
import { AngularFireModule } from "@angular/fire";
import { environment } from "src/environments/environment";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireFunctionsModule } from "@angular/fire/functions";
import { ForgotPasswordComponent } from "./components/forgot-password/forgot-password.component";
import { MyAccountComponent } from "./components/my-account/my-account.component";
import { PackagesComponent } from "./components/packages/packages.component";
import { MAT_DATE_LOCALE } from "@angular/material";
import { AboutComponent } from "./components/about/about.component";
import { PaymentComponent } from './components/payment/payment.component';
import { DebtComponent } from './components/debt/debt.component';
import { PayPalComponent } from './components/payPal/payPal.component';
import { CookieModule } from 'ngx-cookie';
import { SuccessGuard } from './guard/success.guard';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    TermsComponent,
    LogoComponent,
    ForgotPasswordComponent,
    MyAccountComponent,
    PackagesComponent,
    AboutComponent,
    PaymentComponent,
    DebtComponent,
    PayPalComponent

  ],
  imports: [
    BrowserModule,
    MaterialModule,
    AppRoutingModuleModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    PrimengModule,
    HttpClientModule,
    AngularFireFunctionsModule,
    NgxPayPalModule,
    CookieModule.forRoot(),
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "en-GB" },SuccessGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
