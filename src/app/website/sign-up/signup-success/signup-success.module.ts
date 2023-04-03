import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SignupSuccessComponent } from './signup-success.component'
import { RouterModule } from '@angular/router'

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: SignupSuccessComponent }
        ])
    ],
    declarations: [SignupSuccessComponent]
})
export class SignupSuccessModule { }
