import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DataService } from './data.service'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { QuillModule } from 'ngx-quill'
import { SendSmsComponent } from './send-sms.component'
import { NgSelectModule } from '@ng-select/ng-select'

@NgModule({
    imports: [
        AdminSharedModule,
        ReactiveFormsModule,
        FormsModule,
        QuillModule.forRoot(),
        NgSelectModule,
        RouterModule.forChild([
            {
                path: '',
                component: SendSmsComponent
            }
        ])
    ],
    declarations: [SendSmsComponent],
    providers: [DataService]
})
export class SendSmsModule {
    // code here
}
