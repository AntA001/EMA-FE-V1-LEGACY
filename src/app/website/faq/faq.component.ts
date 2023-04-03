import { Component, OnInit } from '@angular/core'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { Pagination, Resp } from 'src/app/interfaces/response'
import { Faq } from 'src/app/models/faq'
import { FaqCategory } from 'src/app/models/faq-category'
import { PageContent } from 'src/app/models/page-content'
import { ApiService } from 'src/app/services/api.service'
import { DataService } from './data.service'

@Component({
    selector: 'app-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
    contents: string = ''
    lang: any
    faqData: Array<FaqCategory> = []
    loadingStatus = false
    loadingDataStatus = false
    constructor(public api: ApiService, public data: DataService, private sanitizer: DomSanitizer) {
        this.lang = this.api.translate('website.faqs')
        this.lang.subscribe((d: any) => {
            this.lang = d
        })
    }

    ngOnInit() {
        this.loadingStatus = true
        const params = {
            route: 'faqs'
        }
        this.data.getContent(params).subscribe((resp: Resp<PageContent>) => {
            if (resp.success === true) {
                if (resp.data !== null) {
                    this.loadingDataStatus = false
                    this.contents = resp.data?.contentEn as string
                }
            }
        })
        this.data.getFaqsCat().subscribe((resp: Resp<Pagination<FaqCategory>>) => {
            if (resp.success === true) {
                this.loadingStatus = false
                this.faqData = resp.data?.data || []
            }
        })
    }

    expandAll(i: number) {
        this.faqData[i].faq.forEach((v: Faq) => (v.collapse = false))
    }

    collapseAll(i: number) {
        this.faqData[i].faq.forEach((v: Faq) => (v.collapse = true))
    }

    transformHtml(htmlTextWithStyle: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(htmlTextWithStyle)
    }
}
