import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AdminGuard } from './auth/admin-guard'
import { WebsiteGuard } from './auth/website-guard'
import { PageNotFoundComponent } from './website/shared/page-not-found/page-not-found.component'
import { MunicipalGuard } from './auth/municipal-guard'


const routes: Routes = [
    {
        path: 'admin',
        canActivateChild: [AdminGuard],
        loadChildren: () => import('./admin-panel/admin-panel.module').then((mod) => mod.AdminPanelModule)
    },

    {
        path: 'municipal',
        canActivateChild: [MunicipalGuard],
        loadChildren: () => import('./municipal-admin-panel/municipal-admin-panel.module').then((mod) => mod.MunicipalAdminPanelModule)
    },
    {
        path: '',
        canActivateChild: [WebsiteGuard],
        loadChildren: () => import('./website/website.module').then((mod) => mod.WebsiteModule)
    },
    {
        path: '**',
        component: PageNotFoundComponent,
        data: { message: 'From ROOT' }
    }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutes {
    // code
}
