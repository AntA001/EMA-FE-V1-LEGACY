import { SharedModule } from './../../shared/shared.module'
import { ReactiveFormsModule } from '@angular/forms'
import { DataService } from './data.service'
import { NgModule } from '@angular/core'
import { RegistrationComponent } from './registration.component'
import { RouterModule } from '@angular/router'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'

@NgModule({
    imports: [
        SharedModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        RouterModule.forChild([
            { path: '', component: RegistrationComponent }
        ])
    ],
    declarations: [RegistrationComponent],
    providers: [DataService]
})
export class RegistrationModule { }
