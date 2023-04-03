import { Resp } from './../../interfaces/response'
import { ApiService } from 'src/app/services/api.service'
import { Component, OnInit } from '@angular/core'
import { PageContent } from 'src/app/models/page-content'
import { DataService } from './data.service'

@Component({
    selector: 'app-terms-and-conditions',
    templateUrl: './terms-and-conditions.component.html',
    styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent implements OnInit {
    lang: any = new Object()
    contents: any = ''
    loadingStatus: boolean
    constructor(public ds: DataService, public api: ApiService) {
        this.api.translate('website.terms-conditions').subscribe((d: object) => {
            this.lang = d
        })
    }

    ngOnInit() {
        this.loadingStatus = true
        const params = {
            route: 'terms-conditions'
        }
        this.ds.getContent(params).subscribe((resp: Resp<PageContent>) => {
            this.loadingStatus = false
            if (resp.success === true) {
                this.contents = resp.data?.contentEn as string
            }
        })
    }
}
