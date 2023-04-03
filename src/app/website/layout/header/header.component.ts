import { Router } from '@angular/router'
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown'
import { Component, Renderer2 } from '@angular/core'
import { ConstantsService } from 'src/app/services/constants.service'
import { TranslateService } from '@ngx-translate/core'
import { ApiService } from 'src/app/services/api.service'

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    providers: [{ provide: BsDropdownConfig, useValue: { isAnimated: false, autoClose: true } }]
})
export class HeaderComponent {
    isCollapsed = true
    carSubscribe: any
    isAuthenticated = false
    isAdmin = false
    isMunicipal = false
    lang: any
    languages = this.cs.LANGUAGES

    constructor(
        public api: ApiService,
        public cs: ConstantsService,
        public router: Router,
        public renderer2: Renderer2,
        public ts: TranslateService
    ) {
        this.lang = this.api.translate('website.header')
        this.lang.subscribe((d: any) => {
            this.lang = d
        })

        api.userLoggedInObs.subscribe((m) => {
            this.isAuthenticated = m
            if (this.isAuthenticated) {
                this.loginUpdates()
            }
        })
    }
    loginUpdates(): void {
        this.isAdmin = this.api.isAdmin()
        this.isMunicipal = this.api.isMunicipal()
    }

    logOut(): void {
        this.api.logOutSession().subscribe((resp: any) => {
            const check = this.api.logOut()
            if (check) {
                location.reload()
            }
        })
    }

    setCollapsed() {
        this.isCollapsed = !this.isCollapsed
    }
}
