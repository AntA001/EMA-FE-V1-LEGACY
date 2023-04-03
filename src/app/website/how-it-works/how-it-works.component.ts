import { DataService } from './data.service'
import { ApiService } from 'src/app/services/api.service'
import { Component, OnInit } from '@angular/core'
import { Resp } from 'src/app/interfaces/response'
import { PageContent } from 'src/app/models/page-content'

@Component({
    selector: 'app-how-it-works',
    templateUrl: './how-it-works.component.html',
    styleUrls: ['./how-it-works.component.css']
})
export class HowItWorksComponent implements OnInit {
    lang: any = new Object()
    contents: any = ''
    loadingStatus: boolean
    constructor(public ds: DataService, public api: ApiService) {
        this.api.translate('website.how-it-works').subscribe((d: object) => {
            this.lang = d
        })
    }

    ngOnInit() {
        const params = {
            route: 'how-its-work'
        }
        this.loadingStatus = true
        this.ds.getContent(params).subscribe((resp: Resp<PageContent>) => {
            this.loadingStatus = false
            if (resp.success === true) {
                this.contents = resp.data?.contentEn as string
            }
        })
    }
}
