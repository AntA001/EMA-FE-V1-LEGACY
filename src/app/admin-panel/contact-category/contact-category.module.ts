import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ContactCategoryComponent } from './contact-category.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module'
import { ModalModule } from 'ngx-bootstrap/modal'
import { RouterModule } from '@angular/router'
import { DataService } from './data.service'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { NgxColorsModule } from 'ngx-colors'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AdminSharedModule,
        NgxColorsModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        RouterModule.forChild([{ path: '', component: ContactCategoryComponent }])
    ],
    declarations: [ContactCategoryComponent],
    providers: [DataService]
})
export class ContactCategoryModule {
    // code here
}
