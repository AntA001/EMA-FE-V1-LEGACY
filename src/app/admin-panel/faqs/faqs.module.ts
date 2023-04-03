import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module'
import { ModalModule } from 'ngx-bootstrap/modal'
import { RouterModule } from '@angular/router'
import { DataService } from './data.service'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FaqsComponent } from './faqs.component'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AdminSharedModule,
        ModalModule.forRoot(),
        RouterModule.forChild([{ path: '', component: FaqsComponent }])
    ],
    declarations: [FaqsComponent],
    providers: [DataService]
})
export class FaqsModule {
    // code here
}
