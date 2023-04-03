import { DataService } from './data.service'
import { RouterModule } from '@angular/router'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SetPasswordComponent } from './set-password.component'
import { ModalModule } from 'ngx-bootstrap/modal'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        RouterModule.forChild([{
            path: '',
            component: SetPasswordComponent
        }])
    ],
    declarations: [SetPasswordComponent],
    providers: [DataService]
})
export class SetPasswordModule { }
