import { SharedModule } from 'src/app/website/shared/shared.module'
import { DataService } from './data.service'

import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HowItWorksComponent } from './how-it-works.component'
import { RouterModule } from '@angular/router'

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
        { path: '', component: HowItWorksComponent }
    ])
  ],
  declarations: [HowItWorksComponent],
  providers: [DataService]
})
export class HowItWorksModule { }
