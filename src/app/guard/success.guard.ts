import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class SuccessGuard implements CanActivate {
    private _success: string;
    constructor(private _router: Router, private _cookieService: CookieService) {
        this._success = this._cookieService.get('success');
    }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        if (this._success === 'true') {
            return true;
        }
        else {
            this._router.navigate(['/debt']);
            return false;
        }
    }
}