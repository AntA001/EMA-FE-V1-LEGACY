import { SharedModule } from '../website/shared/shared.module'
import { MunicipalSharedModule } from './municipal-shared/municipal-shared.module'
import { MunicipalAdminPanelRoutes } from './municipal-admin-panel.routing'
import { NgModule } from '@angular/core'
import { MunicipalAdminPanelComponent } from './municipal-admin-panel.component'

@NgModule({
    imports: [
        MunicipalSharedModule,
        SharedModule,
        MunicipalAdminPanelRoutes
    ],
    declarations: [MunicipalAdminPanelComponent]
})
export class MunicipalAdminPanelModule { }
