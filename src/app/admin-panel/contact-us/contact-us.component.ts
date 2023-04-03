import { IAlertService } from '../../libs/ialert/ialerts.service'
import { ApiService } from '../../services/api.service'
import { Component, OnInit } from '@angular/core'
import { DataService } from './data.service'
import { ConstantsService } from 'src/app/services/constants.service'
import { Resp } from 'src/app/interfaces/response'
import { PageContent } from 'src/app/models/page-content'

@Component({
    selector: 'app-admin-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
    dataToSend: PageContent = {
        id: 0,
        route: 'contact-us',
        contentEn: ''
    }
    saveLoading = false
    breadCrum = [
        {
            link: '/admin/contact-us',
            value: 'Contact us'
        }
    ]
    constructor(
        public api: ApiService,
        public ds: DataService,
        public cs: ConstantsService,
        public alert: IAlertService
    ) {
        // Code Here
    }
    ngOnInit(): void {
        const params = {
            route: this.dataToSend.route
        }
        this.ds.getContent(params).subscribe((resp: Resp<PageContent>) => {
            if (resp.success === true) {
                if (resp.data !== null) {
                    this.dataToSend.id = resp.data?.id || 0
                    this.dataToSend.contentEn = resp.data?.contentEn || ''
                }
            }
        })
    }
    saveContent() {
        this.saveLoading = true
        this.ds.saveContent(this.dataToSend).subscribe((resp: Resp<PageContent>) => {
            this.saveLoading = false
            if (resp.success === true) {
                if (this.dataToSend.id !== 0) {
                    this.alert.success('Content Updated Successfully')
                } else {
                    this.alert.success('Content Saved Successfully')
                    this.dataToSend.id = resp.data?.id || 0
                }
            } else {
                this.alert.error(resp.errors?.general || '')
            }
        })
    }
}
