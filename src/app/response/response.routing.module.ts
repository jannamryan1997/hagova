import {NgModule} from "@angular/core";
import {RouterModule,Routes} from "@angular/router";
import { ResponseComponent } from './response.component';

const responseRoutes:Routes=[
    {path:"",component:ResponseComponent}
]
@NgModule({
    imports:[RouterModule.forChild(responseRoutes)],
    exports:[RouterModule]
})

export class ResponseRoutingModule{}





// api/geturl&response