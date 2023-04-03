import { NgModule } from '@angular/core'
import { ContactUsComponent } from './contact-us.component'
import { DataService } from './data.service'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from '../shared/shared.module'
import { RouterModule } from '@angular/router'

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        RouterModule.forChild([{ path: '', component: ContactUsComponent }])
    ],
    declarations: [ContactUsComponent],
    providers: [DataService]
})
export class ContactUsModule {
    // code here
}
