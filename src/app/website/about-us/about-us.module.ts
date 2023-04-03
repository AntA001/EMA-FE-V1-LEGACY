import { SharedModule } from 'src/app/website/shared/shared.module'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AboutUsComponent } from './about-us.component'
import { DataService } from './data.service'
@NgModule({
    imports: [SharedModule, RouterModule.forChild([{ path: '', component: AboutUsComponent }])],
    declarations: [AboutUsComponent],
    providers: [DataService]
})
export class AboutUsModule {
    // code here
}
