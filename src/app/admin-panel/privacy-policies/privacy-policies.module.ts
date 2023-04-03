import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DataService } from './data.service'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { QuillModule } from 'ngx-quill'
import { PrivacyPoliciesComponent } from './privacy-policies.component'

@NgModule({
    imports: [
        AdminSharedModule,
        ReactiveFormsModule,
        FormsModule,
        QuillModule.forRoot(),
        RouterModule.forChild([
            {
                path: '',
                component: PrivacyPoliciesComponent
            }
        ])
    ],
    declarations: [PrivacyPoliciesComponent],
    providers: [DataService]
})
export class PrivacyPoliciesModule {
    // Content Here
}
