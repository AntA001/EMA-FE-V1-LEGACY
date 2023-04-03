import { RouterModule, Routes } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SocialLoginComponent } from './social-login.component'

const routes: Routes = [{ path: '', component: SocialLoginComponent }]

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    declarations: [SocialLoginComponent]
})
export class SocialLoginModule {
    // code
}
