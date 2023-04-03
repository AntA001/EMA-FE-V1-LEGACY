import { ApiService } from 'src/app/services/api.service'
import { Component, OnInit } from '@angular/core'
import { MunicipalSidebarService } from './municipal-shared/municipal-sidebar/municipal-sidebar.service'
import { TranslateService } from '@ngx-translate/core'
import { ConstantsService } from 'src/app/services/constants.service'
import { ThemeService } from '../services/theme.service'


@Component({
    selector: 'app-municipal-admin-panel',
    templateUrl: './municipal-admin-panel.component.html',
    styleUrls: ['./municipal-admin-panel.component.css']
})
export class MunicipalAdminPanelComponent implements OnInit {
    firstName: any
    isCollapsed = true
    languages = this.cs.LANGUAGES
    lastName: any
    lang: any
    permissions: Array<any> = []
    constructor(public sidebarservice: MunicipalSidebarService,
        public api: ApiService,
        public ts: TranslateService,
        public cs: ConstantsService,
        private themeService: ThemeService

    ) {
        this.lang = this.api.translate('municipal-admin.dropdownHead')
        this.lang.subscribe((d: any) => {
            this.lang = d
        })
        // code here
    }

    ngOnInit() {
        this.firstName = this.api.user.name
        if (this.api.user.municipalAdminType === 'SOS') {
            this.themeService.setTheme('green')
            localStorage.setItem('theme', 'green')
        } else if (this.api.user.municipalAdminType === 'health-SOS') {
            this.themeService.setTheme('light-red')
            localStorage.setItem('theme', 'light-red')
        } else if (this.api.user.municipalAdminType === 'police-SOS') {
            this.themeService.setTheme('light-blue')
            localStorage.setItem('theme', 'light-blue')
        } else if (this.api.user.municipalAdminType === 'fire-SOS') {
            this.themeService.setTheme('red')
            localStorage.setItem('theme', 'red')
        } else if (this.api.user.municipalAdminType === 'news') {
            this.themeService.setTheme('purple')
            localStorage.setItem('theme', 'purple')
        }

        if (this.api.user.municipalAdminType === 'general') {
            this.permissions = [
                { name: "news-add" },
                { name: "news-delete" },
                { name: "news-edit" },
                { name: "news-status-update" },
                { name: "news-list" },
                { name: "useful-contacts-add" },
                { name: "useful-contacts-delete" },
                { name: "useful-contacts-edit" },
                { name: "useful-contacts-status-update" },
                { name: "useful-contacts-list" },
                { name: "emergency-contacts-add" },
                { name: "emergency-contacts-delete" },
                { name: "emergency-contacts-edit" },
                { name: "emergency-contacts-status-update" },
                { name: "emergency-contacts-list" },
                { name: "broadcast-message-send" },
                { name: "broadcast-message-delete" },
                { name: "broadcast-message-list" },
                { name: "sos-alert-list" },
                { name: "sos-alert-info" },
            ]
            localStorage.setItem('permissions', JSON.stringify(this.permissions))
        } else if (this.api.user.municipalAdminType === 'news') {
            this.permissions = [
                { name: "news-add" },
                { name: "news-delete" },
                { name: "news-edit" },
                { name: "news-status-update" },
                { name: "news-list" },
                { name: "broadcast-message-send" },
                { name: "broadcast-message-delete" },
                { name: "broadcast-message-list" },
            ]
            localStorage.setItem('permissions', JSON.stringify(this.permissions))
        } else {
            this.permissions = [
                { name: "sos-alert-list" },
                { name: "sos-alert-info" },
            ]
            localStorage.setItem('permissions', JSON.stringify(this.permissions))
        }
    }

    toggleSidebar() {
        this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState())
    }
    toggleBackgroundImage() {
        this.sidebarservice.hasBackgroundImage = !this.sidebarservice.hasBackgroundImage
    }
    setCollapsed() {
        this.isCollapsed = !this.isCollapsed
    }
    getSideBarState() {
        return this.sidebarservice.getSidebarState()
    }

    hideSidebar() {
        this.sidebarservice.setSidebarState(true)
    }
    logOut(): void {
        // this.api.logOutSession().subscribe((resp: any) => {})
        const check = this.api.logOut()
        if (check) {
            window.location.href = '/login'
        }
    }
}
