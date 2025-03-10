import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { ApiService } from 'src/app/services/api.service'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
    selector: 'app-verify-email',
    templateUrl: './verify-email.component.html',
    styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
    code: any
    codeStatus = 'inProgress'
    lang: any

    constructor(
        public api: ApiService,
        private route: ActivatedRoute,
        private router: Router,
        private alert: IAlertService
    ) {
        this.code = this.route.snapshot.paramMap.get('code')

        this.lang = this.api.translate('website.verify-email')
        this.lang.subscribe((d: any) => {
            this.lang = d
        })
    }

    ngOnInit() {
        const params = {
            code: this.code
        }
        this.api.checkVerificationCode(params).subscribe((resp: any) => {
            if (resp.success === false) {
                this.codeStatus = 'expire'
                this.alert.error(resp.errors.general)

                return
            }

            this.codeStatus = 'valid'
            localStorage.setItem('token', resp.data.token)
            localStorage.setItem('user', JSON.stringify(resp.data))
            this.api.user = resp.data
            this.api.userLoggedInSource.next(true)

            this.api.doUserRedirects(resp, this.router)
            return false
        })
    }

    resendCode() {

        const params = {
            code: this.code
        }
        this.api.resendVerificationCode(params).subscribe((resp: any) => {
            if (resp.success === true) {
                this.codeStatus = 'resent'
                return false
            }
            this.codeStatus = 'invalidCode'
            return false
        })
    }

}
