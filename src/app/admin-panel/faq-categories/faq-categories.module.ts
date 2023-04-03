import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module'
import { ModalModule } from 'ngx-bootstrap/modal'
import { RouterModule } from '@angular/router'
import { DataService } from './data.service'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FaqCategoriesComponent } from './faq-categories.component'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AdminSharedModule,
        ModalModule.forRoot(),
        RouterModule.forChild([{ path: '', component: FaqCategoriesComponent }])
    ],
    declarations: [FaqCategoriesComponent],
    providers: [DataService]
})
export class FaqCategoriesModule {
    // code here
}
