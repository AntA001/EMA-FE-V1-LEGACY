import { AdminSettingService } from './admin-setting.service'
import { NgModule } from '@angular/core'
import { AdminSettingComponent } from './admin-setting.component'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { AdminSharedModule } from '../admin-shared/admin-shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap/modal'
import { RouterModule } from '@angular/router'

@NgModule({
    imports: [
        SharedModule,
        AdminSharedModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        RouterModule.forChild([
            { path: '', component: AdminSettingComponent }
        ])
    ],
    declarations: [AdminSettingComponent],
    providers: [
        AdminSettingService
    ]
})
export class AdminSettingModule { }
