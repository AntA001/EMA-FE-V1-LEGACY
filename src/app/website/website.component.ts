import { ApiService } from './../services/api.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { WebsiteService } from '../services/website.service'
import { ConstantsService } from '../services/constants.service'

@Component({
    selector: 'app-website',
    templateUrl: './website.component.html',
    styleUrls: ['./website.component.css']
})
export class WebsiteComponent implements OnInit{
    isLoading = false

    constructor(
        public route: Router,
        public cs: ConstantsService,
        public api: ApiService,
        public web: WebsiteService
    ) {

        if (this.api.user?.userType === 'admin') {
            this.route.navigate(['/admin/dashboard'])
        } else
        if (this.api.user?.userType === 'municipal-admin') {
            this.route.navigate(['/municipal/dashboard'])
        }
    }
    ngOnInit() {
      // some code
    }

}
