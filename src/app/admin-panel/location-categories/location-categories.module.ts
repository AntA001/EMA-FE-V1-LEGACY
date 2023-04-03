import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LocationCategoriesComponent } from './location-categories.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module'
import { ModalModule } from 'ngx-bootstrap/modal'
import { RouterModule } from '@angular/router'
import { DataService } from './data.service'


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AdminSharedModule,
        ModalModule.forRoot(),
        RouterModule.forChild([{ path: '', component: LocationCategoriesComponent }])
    ],
    declarations: [LocationCategoriesComponent],
    providers: [DataService]
})
export class LocationCategoriesModule {
    // code here
}
