import { SharedModule } from 'src/app/website/shared/shared.module'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { PrivacyPolicyComponent } from './privacy-policy.component'
@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([
            { path: '', component: PrivacyPolicyComponent }
        ])
    ],
    declarations: [PrivacyPolicyComponent]
})
export class PrivacyPolicyModule { }
