import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { DataService } from './data.service'
import { Component, OnInit, TemplateRef } from '@angular/core'
import { ApiService } from 'src/app/services/api.service'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
    selector: 'app-set-password',
    templateUrl: './set-password.component.html',
    styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent implements OnInit {
    dataForm: FormGroup
    sendCodeAgainForm: FormGroup
    code: any
    codeStatus: any
    loginLoading = false
    modalRef: BsModalRef

    constructor(
        private api: ApiService,
        public ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private route: ActivatedRoute,
        private router: Router,
        private ms: BsModalService
    ) {
        this.dataForm = this.fb.group({
            code: new FormControl(null),
            password: new FormControl('', [Validators.required]),
            passwordConfirmation: new FormControl('', [Validators.required])
        })

        this.sendCodeAgainForm = this.fb.group({
            email: new FormControl('', [Validators.required, Validators.email])
        })
        this.code = this.route.snapshot.paramMap.get('code')
    }

    get g() {
        return this.dataForm.controls
    }
    get c() {
        return this.sendCodeAgainForm.controls
    }

    ngOnInit() {
        const params = {
            code: this.code
        }

        this.ds.checkVCode(params).subscribe((resp: any) => {
            if (resp.success === false) {
                this.codeStatus = 'expire'
                return
            }

            this.codeStatus = 'valid'
            this.dataForm.controls.code.setValue(this.code)
        })
    }

    submit(f: any) {
        this.loginLoading = true
        if (this.dataForm.status === 'INVALID') {
            this.alert.error('Please Enter valid data in all fields and try again')
            return
        }
        if (this.dataForm.value.password !== this.dataForm.value.passwordConfirmation) {
            this.alert.error('Password and Confirm Password are not matched')
            return
        }

        this.ds.submit(this.dataForm.value).subscribe((resp: any) => {
            if (resp.success === false) {
                this.loginLoading = false
                this.alert.error(resp.errors.general)
                return
            }

            this.alert.success(resp.msg)
            localStorage.setItem('token', resp.data.token)
            localStorage.setItem('user', JSON.stringify(resp.data))
            this.api.user = resp.data
            this.api.userLoggedInSource.next(true)
            this.api.doUserRedirects(resp.data, this.router)
        })
    }

    setPassFunc(data: FormGroup) {
        this.loginLoading = true
        if (data.status === 'INVALID') {
            this.alert.error('Please provide Email / Username')
            this.loginLoading = false
            return
        }
        const params = {
            code: this.code,
            email: data.value.email
        }
        this.ds.sendCAgain(params).subscribe((resp: any) => {
            if (resp.success === true) {
                this.loginLoading = false
                this.codeStatus = 'sent'
            } else {
                this.loginLoading = false
                this.alert.error(resp.errors.general)
            }
            this.modalRef.hide()
        })
    }

    sendCodeAgainModal(template: TemplateRef<any>) {
        this.modalRef = this.ms.show(template, {
            class: 'modal-sm modal-dialog-centered back-office-panel'
        })
    }
}
