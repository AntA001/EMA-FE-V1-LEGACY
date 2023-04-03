import { MunicipalAdminPanelComponent } from './municipal-admin-panel.component'
import { NotAuthorizedComponent } from './municipal-shared/not-authorized/not-authorized.component'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
    {
        path: '',
        component: MunicipalAdminPanelComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('./dashboard/dashboard.module').then((mod) => mod.DashboardModule)
            },
            {
                path: 'emergency-contact',
                loadChildren: () => import('./contact/contact.module').then((mod) => mod.ContactModule)
            },
            {
                path: 'useful-contact',
                loadChildren: () => import('./useful-contact/useful-contact.module').then((mod) => mod.UsefulContactModule)
            },
            {
                path: 'news',
                loadChildren: () => import('./news/news.module').then((mod) => mod.NewsModule)
            },
            {
                path: 'user',
                loadChildren: () => import('./user/user.module').then((mod) => mod.UserModule)
            },
            {
                path: 'broadcast-message',
                loadChildren: () => import('./broadcast-message/broadcast-message.module').then((mod) => mod.BroadcastMessageModule)
            },
            {
                path: 'sos-alert',
                loadChildren: () => import('./sos-alert/sos-alert.module').then((mod) => mod.SosAlertModule)
            },
            {
                path: 'not-authorized',
                component: NotAuthorizedComponent
            },
            {
                path: 'change-password',
                loadChildren: () =>
                    import('./change-password/change-password.module').then(
                        (mod) => mod.ChangePasswordModule
                    )
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MunicipalAdminPanelRoutes {
    // Content Here
}
