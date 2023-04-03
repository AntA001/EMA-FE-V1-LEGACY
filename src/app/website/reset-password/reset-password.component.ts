import { User } from 'src/app/models/user'
import { Component, OnInit } from '@angular/core'
import { ApiService } from 'src/app/services/api.service'
import { FormBuilder, FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Resp } from 'src/app/interfaces/response'

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
    resetPassForm: FormGroup
    code: string | null
    codeStatus: string
    lang: any
    loadingStatus: boolean = false
    constructor(
        private api: ApiService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.lang = this.api.translate('website.reset-password')
        this.lang.subscribe((d: any) => {
            this.lang = d
        })


        this.resetPassForm = this.fb.group({
            code: new FormControl(null),
            newPassword: new FormControl('', [Validators.required]),
            newPasswordConfirmation: new FormControl('', [Validators.required])
        })
        this.code = this.route.snapshot.paramMap.get('code')
    }

    get g() {
        return this.resetPassForm.controls
    }

    ngOnInit() {
        const params = {
            code: this.code
        }

        this.api.checkResetCode(params).subscribe((resp: Resp<User>) => {
            if (resp.success === false) {
                this.codeStatus = 'expire'
                return
            }
            this.codeStatus = 'valid'
            this.resetPassForm.controls.code.setValue(this.code)
        })
    }

    proceedResetPass(data: FormGroup, f: FormGroupDirective) {
        if (data.status === 'INVALID') {
            this.alert.error('Please enter valid dat in all fields and try again')
            return
        }

        if (data.value.newPassword !== data.value.newPasswordConfirmation) {
            this.alert.error('Password and confirm password are not matched')
            return
        }
        this.loadingStatus = true
        this.api.resetPass(data.value).subscribe((resp: Resp<User>) => {
            if (resp.success === false) {
                this.alert.error(resp.errors?.general as string)
                return
            }
            this.loadingStatus = false
            this.api.user = resp.data as User
            this.alert.success('success')
            localStorage.setItem('token', this.api.user.token || '')
            localStorage.setItem('user', JSON.stringify(resp.data))
            this.api.userLoggedInSource.next(true)
            this.api.doUserRedirects(resp.data as User, this.router)
        })
    }
}
