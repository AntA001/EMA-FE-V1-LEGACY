import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { ApiService } from '../../services/api.service'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { Resp } from 'src/app/interfaces/response'
import { User } from 'src/app/models/user'
import { socialLoginUrls } from 'src/environments/environment'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup
    loginLoading = false
    lang: any = new Object()

    constructor(
        private api: ApiService,
        private router: Router,
        private fb: FormBuilder,
        public ui: UIHelpers,
        public alert: IAlertService
    ) {
        this.api.translate('website.login').subscribe((d: object) => {
            this.lang = d
        })
    }

    ngOnInit() {
        this.loginForm = this.fb.group({
            youremail: new FormControl(null, [
                Validators.required,
                Validators.maxLength(100)
            ]),
            yourpassword: new FormControl(null, [Validators.required])
        })
    }

    get g() {
        return this.loginForm.controls
    }

    googleLogin() {
        window.location.href = socialLoginUrls.google
    }

    facebookLogin() {
        window.location.href = socialLoginUrls.facebook
    }

    login(data: any): void {
        this.loginLoading = true
        if (data.status === 'INVALID') {
            this.alert.error(this.lang.fillData)
            this.loginLoading = false

            return
        }
        data.device_name = 'web'
        const params = {
            email: data.value.youremail,
            password: data.value.yourpassword
        }
        this.api.login(params).subscribe((resp: Resp<User>) => {
            this.loginLoading = false
            if (resp.success === false) {
                this.alert.error(resp.message as string)
                return
            }

            this.alert.success(this.lang.successfull)
            this.api.doUserRedirects(resp.data as User, this.router)
        })
    }
}
