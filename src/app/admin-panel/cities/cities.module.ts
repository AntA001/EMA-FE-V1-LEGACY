import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module'
import { ModalModule } from 'ngx-bootstrap/modal'
import { RouterModule } from '@angular/router'
import { DataService } from './data.service'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CitiesComponent } from './cities.component'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AdminSharedModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        RouterModule.forChild([{ path: '', component: CitiesComponent }])
    ],
    declarations: [CitiesComponent],
    providers: [DataService]
})
export class CitiesModule {
    // code here
}
