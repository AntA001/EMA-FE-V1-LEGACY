import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module'
import { NgModule } from '@angular/core'
import { UsersComponent } from './users.component'
import { RouterModule } from '@angular/router'
import { ModalModule } from 'ngx-bootstrap/modal'
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'
import { DataService } from './data.service'

@NgModule({
    imports: [
        AdminSharedModule,
        FormsModule,
        ModalModule.forRoot(),
        ReactiveFormsModule,
        RouterModule.forChild([
            { path: '', component: UsersComponent }
        ])
    ],
    declarations: [UsersComponent],
    providers: [DataService]
})
export class UsersModule { }
