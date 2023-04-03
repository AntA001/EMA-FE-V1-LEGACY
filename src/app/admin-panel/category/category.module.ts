import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CategoryComponent } from './category.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module'
import { ModalModule } from 'ngx-bootstrap/modal'
import { RouterModule } from '@angular/router'
import { DataService } from './data.service'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AdminSharedModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        RouterModule.forChild([{ path: '', component: CategoryComponent }])
    ],
    declarations: [CategoryComponent],
    providers: [DataService]
})
export class CategoryModule {
    // code here
}
