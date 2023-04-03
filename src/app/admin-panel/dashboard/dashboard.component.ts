import { Observable } from 'rxjs'
import { IAlertService } from '../../libs/ialert/ialerts.service'
import { ApiService } from '../../services/api.service'
import { Component } from '@angular/core'
import { DataService } from './data.service'
import * as moment from 'moment'
import { ConstantsService } from 'src/app/services/constants.service'
import { Resp } from 'src/app/interfaces/response'
import { PageContent } from 'src/app/models/page-content'

@Component({
    selector: 'app-driver-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
    mt = moment
    month = ''
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
    storedData = {
        success: '',
        data: {
            totalUsers: 0,
            totalUnreadRequests: 0,
            totalUnreadMessages: 0,
            totalStudents: 0,
            totalAmountOwed: 0,
            totalDeskManagers: 0,
            totalInstructors: 0
        },
        msg: ''
    }
    constructor(
        public api: ApiService,
        public ds: DataService,
        public cs: ConstantsService,
        public alert: IAlertService
    ) {
        this.dateFormat = cs.DATE_TIME_FORMAT.SHORT_DATE

        // this.ds.getContent().subscribe((resp: any) => {
        //     if (resp.success === true) {
        //         this.storedData = resp
        //     }
        // })
    }


    getDifference(date: any) {
        return moment(date).format('DD/MM/YYYY') + ' ' + moment(date).format('LT')
    }

    logOut(): void {
        this.api.logOutSession().subscribe((resp: any) => {
            const check = this.api.logOut()
            if (check) {
                location.reload()
            }
        })
    }
}
