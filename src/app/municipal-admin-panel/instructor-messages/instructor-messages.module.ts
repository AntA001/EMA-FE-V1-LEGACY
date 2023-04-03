import { DataService } from './data.service'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { InstructorMessagesComponent } from './instructor-messages.component'
import { InstructorSharedModule } from '../instructor-shared/instructor-shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { ModalModule } from 'ngx-bootstrap/modal'

@NgModule({
    providers: [ DataService],
  imports: [
    CommonModule,
    InstructorSharedModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild([{ path: '', component: InstructorMessagesComponent }])
  ],
  declarations: [InstructorMessagesComponent]
})
export class InstructorMessagesModule { }
