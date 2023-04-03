import { ConstantsService } from 'src/app/services/constants.service'
import { Injectable } from '@angular/core'
import { ApiService } from 'src/app/services/api.service'
import { Menu } from 'src/app/interfaces/menu'

@Injectable({
    providedIn: 'root'
})
export class AdminSidebarService {
    toggled = false
    _hasBackgroundImage = true
    completeMenu: Array<Menu> = []
    userMenu: Array<Menu> = []
    userId: number

    constructor(public api: ApiService) {
        const userString: string = localStorage.getItem('user') as string
        this.userId = JSON.parse(userString)?.id
        this.completeMenu = [
            {
                title: 'Dashboard',
                link: 'dashboard',
                icon: 'fa fa-tachometer-alt',
                type: 'simple',
                active: true
            },
            {
                title: 'Municipal Admins',
                link: 'municipal-admins',
                icon: 'fa fa-tachometer-alt',
                type: 'simple',
                active: true
            },
            {
                title: 'User Categories',
                link: 'category',
                icon: 'fa fa-tachometer-alt',
                type: 'simple',
                active: true
            },
            {
                title: 'Contact Categories',
                link: 'contact-category',
                icon: 'fa fa-tachometer-alt',
                type: 'simple',
                active: true
            },
            {
                title: 'Guide Articles',
                link: 'guide-articles/list',
                icon: 'fa fa-tachometer-alt',
                type: 'simple',
                active: true
            },
            {
                title: 'Countries, Municipalities & Location Categories',
                link: 'countries',
                icon: 'fa fa-tachometer-alt',
                type: 'simple',
                active: true
            },
            {
                title: 'Map Points',
                link: 'map-points',
                icon: 'fa fa-tachometer-alt',
                type: 'simple',
                active: true
            }
            // {
            //     title: 'Overall MGMT',
            //     icon: 'fa-dot-circle fas',
            //     active: false,
            //     type: 'dropdown',
            //     submenus: [
            //         {
            //             title: 'Settings',
            //             link: 'settings',
            //             type: 'simple'
            //         },
            //         {
            //             title: 'Change Password',
            //             link: 'change-password',
            //             type: 'simple'
            //         }
            //     ]
            // }
        ] // menu
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
        if (this.api.user.userType === ConstantsService.USER_ROLES.ADMIN) {
            return this.completeMenu
        }
        return this.userMenu
    }

    get hasBackgroundImage() {
        return this._hasBackgroundImage
    }

    set hasBackgroundImage(hasBackgroundImage) {
        this._hasBackgroundImage = hasBackgroundImage
    }
}
