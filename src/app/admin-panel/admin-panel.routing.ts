import { AdminPanelComponent } from './admin-panel.component'
import { NotAuthorizedComponent } from './admin-shared/not-authorized/not-authorized.component'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

const routes: Routes = [
    {
        path: '',
        component: AdminPanelComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('./dashboard/dashboard.module').then((mod) => mod.DashboardModule)
            },
            {
                path: 'municipal-admins',
                loadChildren: () =>
                    import('./municipal-admins/municipal-admins.module').then((mod) => mod.MunicipalAdminsModule)
            },
            {
                path: 'category',
                loadChildren: () =>
                    import('./category/category.module').then((mod) => mod.CategoryModule)
            },
            {
                path: 'contact-category',
                loadChildren: () =>
                    import('./contact-category/contact-category.module').then((mod) => mod.ContactCategoryModule)
            },
            {
                path: 'guide-articles',
                loadChildren: () =>
                    import('./guide-article/guide-article.module').then((mod) => mod.GuideArticleModule)
            },
            {
                path: 'countries',
                loadChildren: () =>
                    import('./countries/countries.module').then((mod) => mod.CountriesModule)
            },
            {
                path: 'municipalities',
                loadChildren: () =>
                    import('./municipalities/municipalities.module').then((mod) => mod.MunicipalitiesModule)
            },
            {
                path: 'location-categories',
                loadChildren: () =>
                    import('./location-categories/location-categories.module').then((mod) => mod.LocationCategoriesModule)
            },
            {
                path: 'map-points',
                loadChildren: () =>
                    import('./map-points/map-points.module').then((mod) => mod.MapPointsModule)
            },
            {
                path: 'not-authorized',
                component: NotAuthorizedComponent
            },
            {
                path: 'docs',
                loadChildren: () =>
                    import('./documentation/documentation.module').then(
                        (mod) => mod.DocumentationModule
                    )
            },
            {
                path: 'change-password',
                loadChildren: () =>
                    import('./change-password/change-password.module').then(
                        (mod) => mod.ChangePasswordModule
                    )
            },
            {
                path: 'contact-us-request',
                loadChildren: () =>
                    import('./contact-us-requests/contact-us-requests.module').then(
                        (mod) => mod.ContactUsRequestsModule
                    )
            },
            {
                path: 'about-us',
                loadChildren: () =>
                    import('./about-us/about-us.module').then((mod) => mod.AboutUsModule)
            },
            {
                path: 'contact-us',
                loadChildren: () =>
                    import('./contact-us/contact-us.module').then((mod) => mod.ContactUsModule)
            },

            {
                path: 'settings',
                loadChildren: () =>
                    import('./admin-setting/admin-setting.module').then(
                        (mod) => mod.AdminSettingModule
                    )
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminPanelRoutes {
    // Content Here
}
