import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DataService } from './data.service'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { QuillModule } from 'ngx-quill'
import { ContactUsComponent } from './contact-us.component'

@NgModule({
    imports: [
        AdminSharedModule,
        ReactiveFormsModule,
        FormsModule,
        QuillModule.forRoot(),
        RouterModule.forChild([
            {
                path: '',
                component: ContactUsComponent
            }
        ])
    ],
    declarations: [ContactUsComponent],
    providers: [DataService]
})
export class ContactUsModule {
    // code here
}
