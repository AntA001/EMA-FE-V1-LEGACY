import { Component } from '@angular/core'
import { trigger, state, style, transition, animate } from '@angular/animations'
import { MunicipalSidebarService } from './municipal-sidebar.service'
import { ApiService } from 'src/app/services/api.service'
import { Menu } from 'src/app/interfaces/menu'
import { ThemeService } from 'src/app/services/theme.service'
import { TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'app-municipal-sidebar',
    templateUrl: './municipal-sidebar.component.html',
    styleUrls: ['./municipal-sidebar.component.css'],
    animations: [
        trigger('slide', [
            state('up', style({ height: 0 })),
            state('down', style({ height: '*' })),
            transition('up <=> down', animate(200))
        ])
    ]
})
export class MunicipalSidebarComponent {
    menus: Array<Menu> = []
    user: any
    menuState = 'Dashboard'
    subMenuState = ''
    isCollapsed = false
    type: any = ''
    generalEnum: any = {
        gr: 'Γενικός Διοικ',
        en: 'General Admin',
        al: 'Administrata e Përgjithshme',
        mk: 'Генерален админ',
        bg: 'Общий администратор'
    }
    sosEnum: any = {
        gr: 'Διαχειριστής SOS',
        en: 'SOS Admin',
        al: 'SOS Admin',
        mk: 'СОС админ',
        bg: 'SOS-администратор'
    }
    fireSosEnum: any = {
        gr: 'Φωτιά SOS Διαχειρ',
        en: 'Fire SOS Admin',
        al: 'Fire SOS Admin',
        mk: 'Оган СОС админ',
        bg: 'Пожарный SOS-администратор'
    }
    healthEnum: any = {
        gr: 'Υγεία SOS Διαχειρ',
        en: 'Health SOS Admin',
        al: 'Shëndeti SOS Admin',
        mk: 'Здравје СОС Админ',
        bg: 'SOS-администратор здравоохранения'
    }
    policeEnum: any = {
        gr: 'Αστυνομία SOS Διοικ',
        en: 'Police SOS Admin',
        al: 'Policia SOS Admin',
        mk: 'Полицијата СОС админ',
        bg: 'SOS-администратор полиции'
    }
    newsEnum: any = {
        gr: 'διαχειριστής ειδήσεων',
        en: 'News Admin',
        al: 'Administratori i lajmeve',
        mk: 'Администратор за вести',
        bg: 'Администратор новостей'
    }
    constructor(public sidebarservice: MunicipalSidebarService, 
        private api: ApiService, 
        private themeService: ThemeService,
        public ts: TranslateService) {
        this.user = this.api.user
        this.menus = sidebarservice.getMenuList()
    }

    ngOnInit() {
        let theme = localStorage.getItem('theme')
        this.isCollapsed = theme == 'dark' ? true : false;
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
                window.location.href = '/'
            }
        })
    }

    setStateAsActive(menu: any) {
        this.subMenuState = ''
        this.menuState = menu
        this.closeAllMenus()
    }

    setStateAsActiveSubmenu(menu: any) {
        this.menuState = ''
        this.subMenuState = menu
    }

    closeAllMenus() {
        this.menus.forEach((element) => {
            element.active = false
        })
    }

    setCollapsed() {
        this.isCollapsed = !this.isCollapsed
        if (this.isCollapsed === false) {
            /*this.setTheme('default')
            localStorage.setItem('theme', 'default')*/
            if (this.api.user.municipalAdminType === 'general' || this.api.user.municipalAdminType == null) {
                this.themeService.setTheme('default')
                localStorage.setItem('theme', 'default')
            } else if (this.api.user.municipalAdminType === 'SOS') {
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
        } else {
            if (this.api.user.municipalAdminType === 'general' || this.api.user.municipalAdminType == null) {
                localStorage.setItem('theme', 'dark')
                this.setTheme('dark')
            } else if (this.api.user.municipalAdminType === 'SOS') {
                localStorage.setItem('theme', 'dark-green')
                this.setTheme('dark-green')
            } else if (this.api.user.municipalAdminType === 'health-SOS') {
                this.themeService.setTheme('dark-light-red')
                localStorage.setItem('theme', 'dark-light-red')
            } else if (this.api.user.municipalAdminType === 'police-SOS') {
                this.themeService.setTheme('dark-blue')
                localStorage.setItem('theme', 'dark-blue')
            } else if (this.api.user.municipalAdminType === 'fire-SOS') {
                this.themeService.setTheme('dark-red')
                localStorage.setItem('theme', 'dark-red')
            } else if (this.api.user.municipalAdminType === 'news') {
                this.themeService.setTheme('dark-purple')
                localStorage.setItem('theme', 'dark-purple')
            }
        }
    }

    setTheme(themeName: string) {
        this.themeService.setTheme(themeName)
    }

    municipalAdminType(type: any) {
        const lang = this.ts.currentLang
        if (type === 'general') {
            switch (lang) {
                case 'en':
                    this.type = this.generalEnum.en
                    break;
                case 'gr':
                    this.type = this.generalEnum.gr
                    break;
                case 'al':
                    this.type = this.generalEnum.al
                    break;
                case 'mk':
                    this.type = this.generalEnum.mk
                    break;
                case 'bg':
                    this.type = this.generalEnum.bg
                    break;
                default:
                    this.generalEnum.en
            }
        } else if (type === 'SOS') {
            switch (lang) {
                case 'en':
                    this.type = this.sosEnum.en
                    break;
                case 'gr':
                    this.type = this.sosEnum.gr
                    break;
                case 'al':
                    this.type = this.sosEnum.al
                    break;
                case 'mk':
                    this.type = this.sosEnum.mk
                    break;
                case 'bg':
                    this.type = this.sosEnum.bg
                    break;
                default:
                    this.type = this.sosEnum.en
            }

        }else if (type === 'fire-SOS') {
            switch (lang) {
                case 'en':
                    this.type = this.fireSosEnum.en
                    break;
                case 'gr':
                    this.type = this.fireSosEnum.gr
                    break;
                case 'al':
                    this.type = this.fireSosEnum.al
                    break;
                case 'mk':
                    this.type = this.fireSosEnum.mk
                    break;
                case 'bg':
                    this.type = this.fireSosEnum.bg
                    break;
                default:
                    this.type = this.fireSosEnum.en
            }

        }else if (type === 'health-SOS') {
            switch (lang) {
                case 'en':
                    this.type = this.healthEnum.en
                    break;
                case 'gr':
                    this.type = this.healthEnum.gr
                    break;
                case 'al':
                    this.type = this.healthEnum.al
                    break;
                case 'mk':
                    this.type = this.healthEnum.mk
                    break;
                case 'bg':
                    this.type = this.healthEnum.bg
                    break;
                default:
                    this.type = this.healthEnum.en
            }

        } else if (type === 'police-SOS') {
            switch (lang) {
                case 'en':
                    this.type = this.policeEnum.en
                    break;
                case 'gr':
                    this.type = this.policeEnum.gr
                    break;
                case 'al':
                    this.type = this.policeEnum.al
                    break;
                case 'mk':
                    this.type = this.policeEnum.mk
                    break;
                case 'bg':
                    this.type = this.policeEnum.bg
                    break;
                default:
                    this.type = this.policeEnum.en
            }

        }  else {
            switch (lang) {
                case 'en':
                    this.type = this.newsEnum.en
                    break;
                case 'gr':
                    this.type = this.newsEnum.gr
                    break;
                case 'al':
                    this.type = this.newsEnum.al
                    break;
                case 'mk':
                    this.type = this.newsEnum.mk
                    break;
                case 'bg':
                    this.type = this.newsEnum.bg
                    break;
                default:
                    this.type = this.newsEnum.en
            }
        }
        return this.type

    }
}
