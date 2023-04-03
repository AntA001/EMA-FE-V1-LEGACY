import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ModalModule } from 'ngx-bootstrap/modal'
import { MunicipalSharedModule } from '../municipal-shared/municipal-shared.module'
import { DataService } from './data.service'
import { SosAlertComponent } from './sos-alert.component'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        CommonModule,
        MunicipalSharedModule,
        ModalModule.forRoot(),
        RouterModule.forChild([{ path: '', component: SosAlertComponent }])
    ],
    providers: [DataService],
    declarations: [SosAlertComponent]
})
export class SosAlertModule { }
