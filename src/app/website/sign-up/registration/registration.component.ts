import { IAlertService } from './../../../libs/ialert/ialerts.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { Router } from '@angular/router'
import { DataService } from './data.service'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { ApiService } from 'src/app/services/api.service'
import * as moment from 'moment'
import { Resp } from 'src/app/interfaces/response'
import { User } from 'src/app/models/user'
import { ConstantsService } from 'src/app/services/constants.service'

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
    moment = moment
    termsAndConditionsCheck = false
    regForm: FormGroup
    maxDate: string
    loadingStatus = false
    loginLoading = false
    lang: any

    constructor(
        private ds: DataService,
        private router: Router,
        public ui: UIHelpers,
        private alert: IAlertService,
        private api: ApiService,
        public cs: ConstantsService
    ) {
        this.lang = this.api.translate('website.registration')
        this.lang.subscribe((d: any) => {
            this.lang = d
        })
    }

    ngOnInit() {
        this.loadingStatus = true
        this.regForm = new FormGroup({
            email: new FormControl('', [
                Validators.required,
                Validators.maxLength(50),
                Validators.email
            ]),
            password: new FormControl(null, [Validators.required]),
            password_confirmation: new FormControl(null, [Validators.required]),
            firstName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
            lastName: new FormControl('', [Validators.required, Validators.maxLength(100)]),
            contactOne: new FormControl('', [Validators.required, Validators.maxLength(15)]),
            dob: new FormControl(null),
            address: new FormControl(null),
            gender: new FormControl('male', [Validators.required])
        })
    }

    get g() {
        return this.regForm.controls
    }

    register(): void {
        this.loginLoading = true
        if (this.regForm.invalid) {
            this.alert.error('Please fill in complete data & then try again')
            this.loginLoading = false
            return
        }

        const data = this.regForm.getRawValue()
        if (this.regForm.value.password !== this.regForm.value.password_confirmation) {
            this.alert.error('Password Confirmation Does not Match')
            this.loginLoading = false
            return
        }
        if (this.termsAndConditionsCheck === false) {
            this.alert.error(this.lang.errorTermCon)
            return
        }
        if (this.regForm.value.dob) {
            const a = moment()
            if (a.diff(this.regForm.value.dob, 'years') > 100) {
                this.alert.error('age must below than 100')
                return
            }
            data.dob = moment(this.regForm.value.dob).format('YYYY-MM-DD')
        }

        this.ds.registration(data).subscribe((resp: Resp<User>) => {
            this.loginLoading = false
            if (resp.success === true) {
                this.alert.success('You have been registred successfully')
                this.router.navigate(['/registration-success'])
                this.loginLoading = false
            } else {
                this.alert.error(resp.errors?.general as string)
                this.loginLoading = false
            }
        })
    }

    agree() {
        this.termsAndConditionsCheck = !this.termsAndConditionsCheck
    }
}
