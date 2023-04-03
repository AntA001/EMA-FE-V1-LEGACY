import { Event, Router } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ThemeService } from './services/theme.service'
import { ApiService } from './services/api.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    isLoading: boolean

    constructor(
        private route: Router,
        public ts: TranslateService,
        private themeService: ThemeService,
        public api: ApiService
    ) {
        ts.addLangs(['en', 'no'])
        const lang = localStorage.getItem('lang') ? localStorage.getItem('lang') as string : ts.getBrowserLang()
        ts.setDefaultLang(lang)
        ts.use(lang)

        this.route.events.subscribe((routerEvent: Event) => {
        })
    }

    ngOnInit() {
        if(localStorage.getItem('theme') === 'dark')
        this.themeService.setTheme('dark')
        else{
        this.themeService.setTheme('default')
        localStorage.setItem('theme', 'default')
    }
    // if (this.api.user.userType === 'admin') {
    //     this.route.navigate(['/admin/dashboard'])
    // } else
    // if (this.api.user.userType === 'municipal-admin') {
    //     this.route.navigate(['/municipal/dashboard'])
    // }
 }
}
