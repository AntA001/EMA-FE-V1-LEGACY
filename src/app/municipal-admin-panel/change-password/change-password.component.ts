import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { Component } from '@angular/core'
import { DataService } from './data.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { Router } from '@angular/router'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { ApiService } from 'src/app/services/api.service'

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
    registrationError: string
    changePasswordForm: FormGroup
    newPass: any
    conPass: any
    lang: any
    constructor(
        private fb: FormBuilder,
        private dataService: DataService,
        public ui: UIHelpers,
        private router: Router,
        private alert: IAlertService,
        public api: ApiService
    ) {
        this.changePasswordForm = this.fb.group({
            old_password: new FormControl(null, [Validators.required]),
            password: new FormControl(null, [Validators.required]),
            confirmation_password: new FormControl(null, [Validators.required])
        })
        this.lang = this.api.translate('municipal-admin.change-password')
        this.lang.subscribe((d: any) => {
            this.lang = d
        })
    }

    get g() {
        return this.changePasswordForm.controls
    }

    changePassword(data: any): void {
        this.newPass = this.changePasswordForm.get('password')?.value
        this.conPass = this.changePasswordForm.get('confirmation_password')?.value

        if (data.status === 'INVALID') {
            this.alert.error('Please fill in-valid data in all fields & try again.')
            return
        } else if (this.newPass !== this.conPass) {
            this.alert.error('New and Confirm Password not matched...')
            return
        }
        this.dataService.changePassword(data.value).subscribe((resp: any) => {
            if (resp.message === 'old Password not valid') {
                this.alert.error('Old Password not valid')
                return
            }
            if (resp.success === false) {
                this.registrationError = resp.errors.general
                return
            }

            this.alert.success('Password Changed Successfully!!')
            this.router.navigate(['/instructor/dashboard'])
        })
    }
}
