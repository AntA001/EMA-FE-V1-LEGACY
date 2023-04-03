import { Component } from '@angular/core'
import { trigger, state, style, transition, animate } from '@angular/animations'
import { AdminSidebarService } from './admin-sidebar.service'
import { ApiService } from 'src/app/services/api.service'
import { Menu } from 'src/app/interfaces/menu'
import { ThemeService } from 'src/app/services/theme.service'

@Component({
    selector: 'app-user-sidebar',
    templateUrl: './admin-sidebar.component.html',
    styleUrls: ['./admin-sidebar.component.css'],
    animations: [
        trigger('slide', [
            state('up', style({ height: 0 })),
            state('down', style({ height: '*' })),
            transition('up <=> down', animate(200))
        ])
    ]
})
export class AdminSidebarComponent {
    menus: Array<Menu> = []
    user: any
    menuState = 'Dashboard'
    subMenuState = ''
    isCollapsed = false
    constructor(public sidebarservice: AdminSidebarService, private api: ApiService,  private themeService: ThemeService) {
        this.user = this.api.user
        this.menus = sidebarservice.getMenuList()
    }

    ngOnInit() {
        let theme = localStorage.getItem('theme')
        this.isCollapsed  = theme == 'dark' ?  true : false;
    }


    getSideBarState() {
        return this.sidebarservice.getSidebarState()
    }

    toggle(currentMenu: Menu) {
        if (currentMenu.type === 'dropdown') {
            this.menus.forEach((element) => {
                if (element === currentMenu) {
                    currentMenu.active = !currentMenu.active
                } else {
                    element.active = false
                }
            })
        }
    }

    toggleSubMenu(parentMenu: Menu, subMenu: Menu) {
        if (subMenu.type === 'dropdown') {
            parentMenu.submenus?.forEach((element) => {
                if (element === subMenu) {
                    subMenu.active = !subMenu.active
                } else {
                    element.active = false
                }
            })
        }
    }

    getState(currentMenu: Menu) {
        if (currentMenu.active) {
            return 'down'
        }
        return 'up'
    }

    hasBackgroundImage() {
        return this.sidebarservice.hasBackgroundImage
    }

    logOut(): void {
        this.api.logOutSession().subscribe((resp: any) => {
            const check = this.api.logOut()
            if (check) {
                // location.reload()
                window.location.href = '/login'
            }
        })
    }

    setStateAsActive(menu: any) {
        this.subMenuState = ''
        this.menuState = menu
        this.closeAllMenus()
    }

    setStateAsActiveSubmenu(link: any) {
        this.menuState = ''
        this.subMenuState = link
    }

    closeAllMenus() {
        this.menus.forEach((element) => {
            element.active = false
        })
    }

    setCollapsed() {
        this.isCollapsed = !this.isCollapsed
        if (this.isCollapsed === false) {
            this.setTheme('default')
            localStorage.setItem('theme', 'default')
        } else {
            this.setTheme('dark')
            localStorage.setItem('theme', 'dark')
        }
    }

    setTheme(themeName: string) {
        this.themeService.setTheme(themeName)
    }
}
