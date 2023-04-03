import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { Component } from '@angular/core'
import { DataService } from './data.service'
import { Router, ActivatedRoute } from '@angular/router'
import { Pagination, Resp } from 'src/app/interfaces/response'
import { ContactUsRequest } from 'src/app/models/contact-us-request'

@Component({
    selector: 'app-contact-us-requests',
    templateUrl: './contact-us-requests.component.html',
    styleUrls: ['./contact-us-requests.component.css']
})
export class ContactUsRequestsComponent {
    dataStatus = 'fetching'
    requestList: Array<ContactUsRequest> = []
    selectedIndex: number
    pagination: Pagination<ContactUsRequest>
    loading: boolean = false
    filters = {
        name: '',
        page: 1
    }
    loaderOptions = {
        rows: 5,
        cols: 3,
        colSpans: {
            0: 1
        }
    }
    waiting: {
        search: boolean
        save: boolean
    }
    breadCrum = [
        {
            link: '/admin/contact-us-request',
            value: 'Contact us request'
        }
    ]

    constructor(
        private ds: DataService,
        private alert: IAlertService,
        public router: Router,
        private route: ActivatedRoute
    ) {
        this.waiting = {
            search: false,
            save: false
        }

        this.route.queryParams.subscribe((params) => {
            if (params.page) {
                this.filters.page = params.page
            }

            if (params) {
                this.search()
            }
        })
    }

    setPagination(page: number) {
        this.filters.page = page
        this.router.navigate(['/admin/contact-us-request'], {
            queryParams: this.filters,
            replaceUrl: true
        })
    }

    search(): void {
        this.waiting.search = true

        this.ds.getList(this.filters).subscribe((resp: Resp<Pagination<ContactUsRequest>>) => {
            this.waiting.search = false
            if (resp.success === true) {
                this.requestList = resp.data?.data || []
                this.pagination = resp.data as Pagination<ContactUsRequest>
                this.dataStatus = 'done'
            }
        })
    }
    markAsUnRead(index: number) {
        const param = {
            id: this.requestList[index].id,
            status: 0
        }
        this.loading = true
        this.ds.markRead(param).subscribe((resp: Resp) => {
            this.loading = false
            if (resp.success === true) {
                this.alert.success('Marked as Read')
                this.requestList[index].status = 0
            } else {
                this.alert.error(resp.errors?.general || '')
            }
        })
    }
    markAsRead(index: number) {
        const param = {
            id: this.requestList[index].id,
            status: 1
        }
        this.loading = true
        this.ds.markRead(param).subscribe((resp: Resp) => {
            this.loading = false
            if (resp.success === true) {
                this.alert.success('Marked as Read')
                this.requestList[index].status = 1
            } else {
                this.alert.error(resp.errors?.general || '')
            }
        })
    }
}
