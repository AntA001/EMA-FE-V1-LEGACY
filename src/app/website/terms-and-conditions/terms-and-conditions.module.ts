import { DataService } from './data.service'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TermsAndConditionsComponent } from './terms-and-conditions.component'
import { SharedModule } from '../shared/shared.module'
import { RouterModule } from '@angular/router'

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([{ path: '', component: TermsAndConditionsComponent }])
    ],
    declarations: [TermsAndConditionsComponent],
    providers: [DataService]
})
export class TermsAndConditionsModule {
    // code here
}
