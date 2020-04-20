import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { HomeComponent } from '../components/home/home.component';
import { TermsComponent } from '../components/terms/terms.component';
import { ForgotPasswordComponent } from '../components/forgot-password/forgot-password.component';
import { MyAccountComponent } from '../components/my-account/my-account.component';
import { PackagesComponent } from '../components/packages/packages.component';
import { AboutComponent } from '../components/about/about.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent  
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'terms',
    component: TermsComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'my-account',
    component: MyAccountComponent
  },
  {
    path: 'packages',
    component: PackagesComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class AppRoutingModuleModule { }
