import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MapPointsComponent } from './map-points.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module'
import { ModalModule } from 'ngx-bootstrap/modal'
import { RouterModule } from '@angular/router'
import { DataService } from './data.service'
import { SharedModule } from 'src/app/website/shared/shared.module'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        AdminSharedModule,
        ModalModule.forRoot(),
        RouterModule.forChild([{ path: '', component: MapPointsComponent }])
    ],
    declarations: [MapPointsComponent],
    providers: [DataService]
})
export class MapPointsModule {
    // code here
}
