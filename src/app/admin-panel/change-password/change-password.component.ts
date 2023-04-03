import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { Component } from '@angular/core'
import { DataService } from './data.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { Router } from '@angular/router'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'

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
        private alert: IAlertService
    ) {
        this.changePasswordForm = this.fb.group({
            old_password: new FormControl(null, [Validators.required]),
            new_password: new FormControl(null, [Validators.required]),
            new_password_confirmation: new FormControl(null, [Validators.required])
        })
    }

    get g() {
        return this.changePasswordForm.controls
    }

    changePassword(data: any): void {
        this.newPass = this.changePasswordForm.get('new_password')?.value
        this.conPass = this.changePasswordForm.get('new_password_confirmation')?.value

        if (data.status === 'INVALID') {
            this.alert.error('Please fill in-valid data in all fields & try again.')
            return
        } else if (this.newPass !== this.conPass) {
            this.alert.error('New and Confirm Password not matched...')
            return
        }
        this.dataService.changePassword(data.value).subscribe((resp: any) => {
            if (resp.success === false) {
                this.registrationError = resp.errors.general
                return
            }
            this.alert.success('Password Changed Successfully!!')
            this.router.navigate(['/admin/dashboard'])
        })
    }
}
