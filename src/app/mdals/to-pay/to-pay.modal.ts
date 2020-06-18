import { Component, OnInit, Injectable, Inject } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SendCommandService } from "src/app/services/send-command.service";

@Component({
    selector: "to-pay-modal",
    templateUrl: "to-pay.modal.html",
    styleUrls: ["to-pay.modal.scss"]
})

export class ToPayModal implements OnInit {

    public payFormGroup: FormGroup;

    constructor(
        @Inject(MAT_DIALOG_DATA) private _data,
        private _fb: FormBuilder, private _router: Router,
        private _dialogRef: MatDialogRef<ToPayModal>, private sendService: SendCommandService) { }

    ngOnInit() {
        this._formBuilder();
    }

    private _formBuilder(): void {
        this.payFormGroup = this._fb.group({
            email: [null, Validators.required],
        })
    }
    public murshulam(): void {
        let sum;
        if (this._data.sum) {
            sum = this._data.sum;
        }
        console.log(sum);

        let ID: number;
        const data: any = {
            name: null,
            email: this.payFormGroup.value.email,
            phone: null,
            price: sum,
        }
        this.sendService.createCustomeray(data).then((res: any) => {
            console.log(res);
            this._dialogRef.close();
            if (!res.Errors) {
                ID = res.ID
            }
            this._router.navigate(['/pay'], { queryParams: { FullName: data.name, Email: data.email, Phone: data.phone, Sum: sum, ID: res.ID } });

        })
    }
}