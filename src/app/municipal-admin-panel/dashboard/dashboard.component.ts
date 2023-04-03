import { IAlertService } from '../../libs/ialert/ialerts.service'
import { ApiService } from '../../services/api.service'
import { Component } from '@angular/core'
import { DataService } from './data.service'
import * as moment from 'moment'
import { ConstantsService } from 'src/app/services/constants.service'
import { Pagination, Resp } from 'src/app/interfaces/response'

@Component({
    selector: 'app-driver-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
    mt = moment
    month = ''
    max: number = 0
    remaining: number = 0
    smsCount: number = 0
    lang: any
    storedData: any  = []
    year: any = 2020
    todayDate = new Date()
    lineChartLegend = true
    lineChartType = 'line'
    fetching = true
    visitorFetching = 'inprogress'
    projectCount: any
    totalDownloads = 0
    dateFormat: any
    dashboardData: any
    monthlySalesData: Array<any> = []
    monthlyTotalAmount = 0
    activeMenu = 'business'
    messagesList: Array<any> = []
    pagination: Pagination<any>
    filters = {
        keyword: '',
        page: 1,
        perPage: 15
    }

    constructor(
        public api: ApiService,
        public ds: DataService,
        public cs: ConstantsService,
        public alert: IAlertService
    ) {
        this.dateFormat = cs.DATE_TIME_FORMAT.SHORT_DATE

        // this.message()
        this.ds.getContent().subscribe((resp: any) => {
            if (resp.success === true) {
                this.storedData = resp.data
                this.max = Number(this.storedData.maxSmsCount)
                this.smsCount = Number(this.storedData.smsCount) + Number(this.storedData.inProgressSms)
                this.remaining = this.max - this.smsCount

            }
        })

        this.lang = this.api.translate('municipal-admin.dashboard')
        this.lang.subscribe((d: any) => {
            this.lang = d
        })
    }

    getDifference(date: any) {
        return moment(date).format('L') + ' ' + moment(date).format('LT')
    }



    message(): void {
        this.ds.getMessages(this.filters).subscribe((resp: Resp<Pagination<any>>) => {
            if (resp.success === true) {
                this.messagesList = resp.data?.data || []
                this.pagination = resp.data as Pagination<any>
            }
        })
    }

    logOut(): void {
        // this.api.logOutSession().subscribe((resp: any) => {})
        const check = this.api.logOut()
        if (check) {
            location.reload()
        }
    }

    remove(index: number) {
        const param = { id: this.messagesList[index].id }
        this.ds.read(param).subscribe((resp: Resp) => {
            if (resp.success === true) {
                this.alert.success('Notification Remove Successfully')
                this.messagesList.splice(index, 1)
            } else {
                // code
            }
        })
    }

    reamining(max: any, noSms: any) {
        const remainingSMS = max - noSms
        return remainingSMS
    }
}
