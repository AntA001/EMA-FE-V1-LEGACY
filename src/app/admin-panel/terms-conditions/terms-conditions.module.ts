import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DataService } from './data.service'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { QuillModule } from 'ngx-quill'
import { TermsConditionsComponent } from './terms-conditions.component'

@NgModule({
    imports: [
        AdminSharedModule,
        FormsModule,
        ReactiveFormsModule,
        QuillModule.forRoot(),
        RouterModule.forChild([
            {
                path: '',
                component: TermsConditionsComponent
            }
        ])
    ],
    declarations: [TermsConditionsComponent],
    providers: [DataService]
})
export class TermsConditionsModule {
    // content here
}
