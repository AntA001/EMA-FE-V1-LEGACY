import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BroadcastMessageComponent } from './broadcast-message.component'
import { ModalModule } from 'ngx-bootstrap/modal'
import { MunicipalSharedModule } from '../municipal-shared/municipal-shared.module'
import { DataService } from './data.service'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        MunicipalSharedModule,
        ModalModule.forRoot(),
        RouterModule.forChild([{ path: '', component: BroadcastMessageComponent }])
    ],
    providers: [DataService],
    declarations: [BroadcastMessageComponent]
})
export class BroadcastMessageModule { }
