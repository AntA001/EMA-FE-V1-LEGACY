import { NgModule } from '@angular/core'
import { FaqComponent } from './faq.component'
import { RouterModule } from '@angular/router'
import { CollapseModule } from 'ngx-bootstrap/collapse'
import { DataService } from './data.service'
import { SharedModule } from '../shared/shared.module'
@NgModule({
    imports: [
        SharedModule,
        CollapseModule.forRoot(),
        RouterModule.forChild([{ path: '', component: FaqComponent }])
    ],
    declarations: [FaqComponent],
    providers: [DataService]
})
export class FaqModule {
    // Code Here
}
