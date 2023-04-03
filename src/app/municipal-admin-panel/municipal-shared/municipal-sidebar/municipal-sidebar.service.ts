import { ConstantsService } from 'src/app/services/constants.service'
import { Injectable } from '@angular/core'
import { ApiService } from 'src/app/services/api.service'
import { Menu } from 'src/app/interfaces/menu'

@Injectable({
    providedIn: 'root'
})
export class MunicipalSidebarService {
    toggled = false
    _hasBackgroundImage = true
    completeMenu: Array<Menu> = []
    userMenu: Array<Menu> = []
    userId: number
    lang: any

    constructor(public api: ApiService) {

        this.lang = this.api.translate('municipal-admin.sidebar')
        this.lang.subscribe((d: any) => {
            this.lang = d
        })
        const userString: string = localStorage.getItem('user') as string
        this.userId = JSON.parse(userString)?.id
        if (api.user.municipalAdminType === 'general') {
        this.completeMenu = [
            {
                title: this.lang.dashboard,
                link: 'dashboard',
                icon: 'fa fa-tachometer-alt',
                type: 'simple',
                active: true
            },
            {
                title: this.lang.news,
                link: 'news',
                icon: 'fas fa-newspaper',
                active: true,
                type: 'simple'
            },
            {
                title: this.lang.user,
                link: 'user',
                icon: 'fas fa-newspaper',
                active: true,
                type: 'simple'
            },
            {
                title: this.lang.emergencyContacts,
                link: 'emergency-contact',
                icon: 'fas fa-address-book',
                active: true,
                type: 'simple'
            },
            {
                title: this.lang.usefulContacts,
                link: 'useful-contact',
                icon: 'fas fa-address-book',
                active: true,
                type: 'simple'
            },
            {
                title: this.lang.broadcastMessage,
                link: 'broadcast-message',
                icon: 'fas fa-comment-alt',
                active: true,
                type: 'simple'
            },
            {
                title: this.lang.sosAlerts,
                link: 'sos-alert',
                icon: 'fas fa-bell',
                active: true,
                type: 'simple'
            },
            /*{
                title: 'Edit Profile',
                link: 'edit-user',
                icon: 'fa-dot-circle fas',
                active: true,
                type: 'simple'
            },*/
            // {
            //     title: 'My Schedule',
            //     link: 'my-schedule',
            //     icon: 'fa-dot-circle fas',
            //     active: true,
            //     type: 'simple'
            // },
            /* {
                title: 'Messages',
                link: 'instructor-messages',
                icon: 'fa-dot-circle fas',
                active: true,
                type: 'simple'
            },*/
            {
                title: this.lang.changePassword,
                link: 'change-password',
                icon: 'fa-dot-circle fas',
                active: true,
                type: 'simple'
            }
        ] // menu
    } else if (api.user.municipalAdminType === 'SOS' || api.user.municipalAdminType === 'fire-SOS' || api.user.municipalAdminType === 'health-SOS' || api.user.municipalAdminType === 'police-SOS') {
        this.completeMenu = [
            {
                title: this.lang.dashboard,
                link: 'dashboard',
                icon: 'fa fa-tachometer-alt',
                type: 'simple',
                active: true
            },
            {
                title: this.lang.sosAlerts,
                link: 'sos-alert',
                icon: 'fas fa-bell',
                active: true,
                type: 'simple'
            },
        ]
    } else {
        this.completeMenu = [
            {
                title: this.lang.dashboard,
                link: 'dashboard',
                icon: 'fa fa-tachometer-alt',
                type: 'simple',
                active: true
            },
            {
                title: this.lang.news,
                link: 'news',
                icon: 'fas fa-newspaper',
                active: true,
                type: 'simple'
            },
            {
                title: this.lang.broadcastMessage,
                link: 'broadcast-message',
                icon: 'fas fa-comment-alt',
                active: true,
                type: 'simple'
            },
            
        ]
    }
}

    toggle() {
        this.toggled = !this.toggled
    }

    getSidebarState() {
        return this.toggled
    }

    setSidebarState(state: boolean) {
        this.toggled = state
    }

    getMenuList() {
        return this.completeMenu
    }

    get hasBackgroundImage() {
        return this._hasBackgroundImage
    }

    set hasBackgroundImage(hasBackgroundImage) {
        this._hasBackgroundImage = hasBackgroundImage
    }
}
