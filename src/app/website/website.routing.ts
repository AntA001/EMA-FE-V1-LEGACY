import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component'
import { WebsiteComponent } from './website.component'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { NoAuthGuard } from '../auth/no-auth-guard'

const routes: Routes = [
    {
        path: '',
        component: WebsiteComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./index/index.module').then((mod) => mod.IndexModule)
            },
            {
                path: 'registration',
                canActivate: [NoAuthGuard],
                loadChildren: () =>
                    import('./sign-up/registration/registration.module').then(
                        (mod) => mod.RegistrationModule
                    )
            },
            {
                path: 'faqs',
                loadChildren: () => import('./faq/faq.module').then((mod) => mod.FaqModule)
            },
            {
                path: 'about-us',
                loadChildren: () =>
                    import('./about-us/about-us.module').then((mod) => mod.AboutUsModule)
            },

            {
                path: 'login',
                canActivate: [NoAuthGuard],
                loadChildren: () => import('./login/login.module').then((mod) => mod.LoginModule)
            },
            {
                path: 'registration-success',
                loadChildren: () =>
                    import('./sign-up/signup-success/signup-success.module').then(
                        (mod) => mod.SignupSuccessModule
                    )
            },
            {
                path: 'verify-email/:code',
                loadChildren: () =>
                    import('./verify-email/verify-email.module').then(
                        (mod) => mod.VerifyEmailModule
                    )
            },
            {
                path: 'payment-success/:id',
                loadChildren: () =>
                    import('./payment-success/payment-success.module').then((mod) => mod.PaymentSuccessModule)
            },
            {
                path: 'set-password/:code',
                loadChildren: () =>
                    import('./set-password/set-password.module').then(
                        (mod) => mod.SetPasswordModule
                    )
            },
            {
                path: 'social-login/:code',
                loadChildren: () =>
                    import('./social-login/social-login.module').then(
                        (mod) => mod.SocialLoginModule
                    )
            },
            {
                path: 'forgot-password',
                canActivate: [NoAuthGuard],
                loadChildren: () =>
                    import('./forgot-password/forgot-password.module').then(
                        (mod) => mod.ForgotPasswordModule
                    )
            },
            {
                path: 'reset-password/:code',
                canActivate: [NoAuthGuard],
                loadChildren: () =>
                    import('./reset-password/reset-password.module').then(
                        (mod) => mod.ResetPasswordModule
                    )
            },
            {
                path: 'contact-us',
                loadChildren: () =>
                    import('./contact-us/contact-us.module').then((mod) => mod.ContactUsModule)
            },

            {
                path: 'how-it-works',
                loadChildren: () =>
                    import('./how-it-works/how-it-works.module').then((mod) => mod.HowItWorksModule)
            },
            {
                path: 'terms-and-conditions',
                loadChildren: () =>
                    import('./terms-and-conditions/terms-and-conditions.module').then(
                        (mod) => mod.TermsAndConditionsModule
                    )
            },
            {
                path: 'privacy-policy',
                loadChildren: () => import('./privacy-policy/privacy-policy.module')
                    .then(mod => mod.PrivacyPolicyModule)
            },

            {
                path: '**',
                component: PageNotFoundComponent,
                data: { message: 'From Website' }
            }
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WebsiteRoutes {
    // code here
}
