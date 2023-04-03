import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { DataService } from './data.service'
import { PaymentSuccessComponent } from './payment-success.component'
import { CommonModule } from '@angular/common'

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        RouterModule.forChild([

            {
                path: '',
                component: PaymentSuccessComponent
            }
        ])
    ],
    declarations: [PaymentSuccessComponent],
    providers: [DataService]
})
export class PaymentSuccessModule { }
