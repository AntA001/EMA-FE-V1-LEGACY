import { Pagination } from './../../interfaces/response'
import { DataService } from './data.service'
import { Component } from '@angular/core'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { ActivatedRoute, Router } from '@angular/router'
import { ApiService } from 'src/app/services/api.service'
import { Resp } from 'src/app/interfaces/response'

@Component({
    selector: 'app-instructor-messages',
    templateUrl: './instructor-messages.component.html',
    styleUrls: ['./instructor-messages.component.css']
})
export class InstructorMessagesComponent {
    messagesList: Array<any> = []
    detail: Array<any> = []
    messagesForm: FormGroup
    selectedIndex: number
    dataStatus = 'fetching'
    pagination: Pagination<any>

    filters = {
        name: '',
        page: 1,
        perPage: 15
    }
    loaderOptions = {
        rows: 5,
        cols: 4,
        colSpans: {
            0: 1
        }
    }

    waiting: {
        search: boolean
        save: boolean
        messageStatus: Array<any>
    }

    breadCrum = [
        {
            link: '/instructor/instructor-messages',
            value: 'Messages'
        }
    ]

    constructor(
        public ds: DataService,
        private alert: IAlertService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private route: ActivatedRoute,
        private router: Router,
        public api: ApiService
    ) {
        this.waiting = {
            search: false,
            save: false,
            messageStatus: []
        }

        this.route.queryParams.subscribe((params) => {
            if (params.page) {
                this.filters.page = params.page
            }
            if (params.perPage) {
                this.filters.perPage = params.perPage
            }
            if (params.name) {
                this.filters.name = params.name
            }

            if (params) {
                this.search()
            }
        })

        this.messagesForm = this.fb.group({
            id: new FormControl(null)
        })
    }

    setPagination(page: number) {
        this.filters.page = page
        this.router.navigate(['/instructor/instructor-messages'], {
            queryParams: this.filters,
            replaceUrl: true
        })
    }

    search(): void {
        this.waiting.messageStatus = []
        this.waiting.search = true
        this.ds.getMessages(this.filters).subscribe((resp: Resp<Pagination<any>>) => {
            this.waiting.search = false
            if (resp.success === true) {
                this.messagesList = resp.data?.data || []
                this.messagesList.forEach((element) => {
                    this.waiting.messageStatus.push(false)
                })
                this.pagination = resp.data as Pagination<any>
                this.dataStatus = 'done'
            }
        })
    }

    readMessage(index: number) {
        this.waiting.messageStatus[index] = true
        const param = { id: this.messagesList[index].id }

        this.ds.read(param).subscribe((resp: Resp) => {
            this.waiting.messageStatus[index] = false
            if (resp.success === true) {
                this.alert.success('Message Read')
                this.messagesList[index].status = 'read'
            } else {
                this.alert.error(resp.errors?.general || '')
            }
        })
    }

    unreadMessage(index: number) {
        this.waiting.messageStatus[index] = true
        const param = { id: this.messagesList[index].id }

        this.ds.unread(param).subscribe((resp: any) => {
            this.waiting.messageStatus[index] = false
            if (resp.success === true) {
                this.messagesList[index].status = 'unread'
                this.alert.success('Unread Message')
            } else {
                this.alert.error(resp.errors?.general || '')
            }
        })
    }
}
