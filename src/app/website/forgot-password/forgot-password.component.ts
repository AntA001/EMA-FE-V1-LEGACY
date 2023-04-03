import { FormGroup } from '@angular/forms'
import { ApiService } from 'src/app/services/api.service'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { DataService } from './data.service'
import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { Resp } from 'src/app/interfaces/response'
import { User } from 'src/app/models/user'

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
    loginLoading: boolean = false
    loadingStatus: boolean = false
    forgotError: string
    lang: any
    formSuccess: boolean = false

    constructor(
        private dataService: DataService,
        private router: Router,
        public apiService: ApiService,
        public alert: IAlertService,
        public api: ApiService
    ) {
        this.lang = this.api.translate('website.forgot-password')
        this.lang.subscribe((d: any) => {
            this.lang = d
        })
    }

    forgotPassword(data: FormGroup): void {
        if (data.status === 'INVALID') {
            this.alert.error('Please provide Email')
            return
        }
        this.loadingStatus = true
        this.dataService.forgotPassword(data.value).subscribe((resp: Resp<User>) => {
            if (resp.success === false) {
                this.forgotError = resp.errors?.general as string
                this.loadingStatus = false
                return
            }
            this.loadingStatus = false
            this.formSuccess = true
            this.alert.success('Password link has been sent successfully')
        })
    }
}
