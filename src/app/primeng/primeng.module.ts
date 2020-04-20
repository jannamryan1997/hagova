import { NgModule } from '@angular/core';
import {FileUploadModule} from 'primeng/fileupload';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DialogModule} from 'primeng/dialog';
import {InputTextareaModule} from 'primeng/inputtextarea';

const PrimengModules = [
  FileUploadModule,
  ConfirmDialogModule,
  DialogModule,
  InputTextareaModule
]

@NgModule({
  imports: [
    PrimengModules
  ],
  exports:[
    PrimengModules
  ]
})
export class PrimengModule { }
