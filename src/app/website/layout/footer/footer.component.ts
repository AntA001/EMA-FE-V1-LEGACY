import { Component } from '@angular/core'
import { Params, Router, ActivatedRoute, Event, NavigationEnd } from '@angular/router'
import { ApiService } from 'src/app/services/api.service'

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent {
    currentUrl = ''
    lang: any
    isAuthenticated = false
    filters: any = {
        title: ''
    }
    constructor(
        public api: ApiService,
        public router: Router,
        public route: ActivatedRoute
    ) {
        this.lang = this.api.translate('website.footer')
        this.lang.subscribe((d: any) => {
            this.lang = d
        })

        this.router.events.subscribe((routerEvent: Event) => {
            if (routerEvent instanceof NavigationEnd) {
                this.currentUrl = routerEvent.url.replace('/', '')

            }
        })

        this.route.queryParams.subscribe((param: Params) => {
            if (param.country) {
                this.filters.country = param.country
            } else {
                this.filters.country = 'USA'
            }
        })
    }

    redirectToSearch() {
        const filtersParam = {
            country: this.filters.country,
            title: this.filters.title
        }
        this.router.navigate(['/search'], { queryParams: filtersParam, replaceUrl: true })
    }

}
