import { Resp } from 'src/app/interfaces/response'
import { PageContent } from 'src/app/models/page-content'
import { Component, OnInit } from '@angular/core'
import { ApiService } from 'src/app/services/api.service'
import { DataService } from './data.service'
@Component({
    selector: 'app-about-us',
    templateUrl: './about-us.component.html',
    styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
    contents: string = ''
    loadingStatus: boolean = false
    lang: any = new Object()
    constructor(public api: ApiService, private ds: DataService) {
        this.api.translate('website.about-us').subscribe((d: object) => {
            this.lang = d
        })
    }

    ngOnInit() {
        const params = {
            route: 'about-us'
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
