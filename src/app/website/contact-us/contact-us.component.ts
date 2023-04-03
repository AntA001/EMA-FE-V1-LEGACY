import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { Resp } from 'src/app/interfaces/response'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { ContactUsRequest } from 'src/app/models/contact-us-request'
import { PageContent } from 'src/app/models/page-content'
import { ApiService } from 'src/app/services/api.service'
import { ConstantsService } from 'src/app/services/constants.service'
import { DataService } from './data.service'

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
    dataForm: FormGroup
    lang: any = new Object()
    contents = ''
    loadingStatus: boolean = false
    contentLoadingStatus: boolean = false
    formSuccess: boolean = false
    constructor(
        public api: ApiService,
        public ds: DataService,
        public fb: FormBuilder,
        private alert: IAlertService,
        public ui: UIHelpers,
        private router: Router,
        public cs: ConstantsService
    ) {
        this.api.translate('website.contact-us').subscribe((d: object) => {
            this.lang = d
        })

        this.dataForm = new FormGroup({
            name: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            phone: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
            email: new FormControl(null, [
                Validators.required,
                Validators.maxLength(100),
                Validators.email
            ]),
            message: new FormControl(null, [Validators.required, Validators.maxLength(500)])
        })
    }
    ngOnInit() {
        this.contentLoadingStatus = true
        const params = {
            route: 'contact-us'
        }
        this.ds.getContent(params).subscribe((resp: Resp<PageContent>) => {
            if (resp.success === true) {
                if (resp.data !== null) {
                    this.contentLoadingStatus = false
                    this.contents = resp.data?.contentEn || ''
                }
            }
        })
    }

    get g() {
        return this.dataForm.controls
    }

    submitForm() {
        this.loadingStatus = true
        const data = this.dataForm.getRawValue()
        if (this.dataForm.invalid) {
            this.loadingStatus = false
            this.alert.error('Please enter valid data!!')
            return
        }
        this.ds.contactUsRequestCreate(data).subscribe((resp: Resp<ContactUsRequest>) => {
            if (resp.success === false) {
                this.alert.error(resp.errors?.general as string)
                this.loadingStatus = false
                return
            }
            this.alert.success('Message sent successfully')
            this.loadingStatus = false
            this.formSuccess = true
        })
    }
}
