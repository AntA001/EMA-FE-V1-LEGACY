import { Resp } from 'src/app/interfaces/response'
import { ApiService } from 'src/app/services/api.service'
import { Router, ActivatedRoute } from '@angular/router'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { DataService } from './data.service'
import { Pagination } from './../../interfaces/response'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { Component, OnInit, TemplateRef } from '@angular/core'
import { Faq } from 'src/app/models/faq'

@Component({
    selector: 'app-faqs',
    templateUrl: './faqs.component.html',
    styleUrls: ['./faqs.component.css']
})
export class FaqsComponent {
    dataStatus = 'fetching'
    faqList: Array<Faq> = []
    faqForm: FormGroup
    selectedIndex: number
    modalRef: BsModalRef
    pagination: Pagination<Faq>
    lang: any = new Object()
    faqCatId = ''
    faqCatName = ''
    contents = ''
    modalTitle = ''
    filters = {
        faq: '',
        page: 1,
        faqCategoryId: -1
    }
    loaderOptions = {
        rows: 5,
        cols: 3,
        colSpans: {
            0: 1
        }
    }
    waiting: {
        search: boolean
        save: boolean
    }
    breadCrum = [
        {
            link: '/admin/faq-categories',
            value: 'Faq categories',
            params: { id: this.faqCatId, name: this.faqCatName }
        }
    ]

    constructor(
        private ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        public router: Router,
        private route: ActivatedRoute,
        private ms: BsModalService,
        private api: ApiService
    ) {
        this.faqCatId = this.route.snapshot.queryParamMap.get('id') as string
        this.faqCatName = this.route.snapshot.queryParamMap.get('name') as string

        this.breadCrum.push({
            link: '/admin/faqs',
            params: { id: this.faqCatId, name: this.faqCatName },
            value: this.faqCatName
        })

        this.api.translate('website.faqs').subscribe((d: object) => {
            this.lang = d
        })

        this.waiting = {
            search: false,
            save: false
        }

        this.route.queryParams.subscribe((params) => {
            if (params.page) {
                this.filters.page = params.page
            }

            if (params.faq) {
                this.filters.faq = params.faq
            }

            if (params.id) {
                this.filters.faqCategoryId = params.id
            }

            if (params) {
                this.search()
            }
        })

        this.faqForm = this.fb.group({
            id: new FormControl(null),
            questionEn: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            answerEn: new FormControl(null, [Validators.required, Validators.maxLength(500)])
        })
    }

    setPagination(page: number) {
        this.filters.page = page
        this.router.navigate(['/admin/faqs'], { queryParams: this.filters, replaceUrl: true })
    }

    search(): void {
        this.waiting.search = true

        this.ds.getList(this.filters).subscribe((resp: Resp<Pagination<Faq>>) => {
            this.waiting.search = false
            if (resp.success === true) {
                this.faqList = resp.data?.data || []
                this.pagination = resp.data as Pagination<Faq>
                this.dataStatus = 'done'
            }
        })
    }

    get g() {
        return this.faqForm.controls
    }

    openModal(modal: TemplateRef<any>, index: number) {
        this.selectedIndex = index
        this.modalTitle = 'Add New Faq'
        if (index > -1) {
            this.faqForm.controls.id.setValue(this.faqList[index].id)
            this.faqForm.patchValue(this.faqList[index])
            this.modalTitle = 'Edit Faq'
        }

        this.modalRef = this.ms.show(modal, {
            class: 'modal-md modal-dialog-centered back-office-panel',
            backdrop: 'static',
            ignoreBackdropClick: true,
            keyboard: false
        })
    }

    save(f: any) {
        this.waiting.save = true
        if (this.faqForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.waiting.save = false
            return
        }

        this.faqForm.value.faqCategoryId = this.filters.faqCategoryId

        let saveUpdate = this.ds.add(this.faqForm.value)
        if (this.faqForm.value.id !== null) {
            saveUpdate = this.ds.update(this.faqForm.value)
        }

        saveUpdate.subscribe((resp: Resp<Faq>) => {
            this.waiting.save = false
            if (resp.success === true) {
                if (this.faqForm.value.id !== null) {
                    this.faqList[this.selectedIndex] = this.faqForm.value
                    this.faqForm.controls.id.setValue(null)
                    this.alert.success('Changes done successfully!!')
                } else {
                    this.faqForm.value.id = resp.data
                    this.faqList.push(this.faqForm.value)
                    this.alert.success('Added successfully!!')
                }
            } else {
                this.alert.error(resp.errors?.general as string)
                this.waiting.save = false
                return
            }
            this.modalRef.hide()
            f.resetForm()
        })
    }

    delete() {
        this.waiting.save = true
        this.ds
            .delete({ id: this.faqList[this.selectedIndex].id })
            .subscribe((resp: Resp<undefined>) => {
                this.waiting.save = false
                if (resp.success === false) {
                    this.alert.error(resp?.errors?.general as string)
                    this.modalRef.hide()
                    return
                }
                this.faqList.splice(this.selectedIndex, 1)
                this.modalRef.hide()
                this.alert.success('Faq deleted successfully!!')
            })
    }

    confirmDelModal(template: TemplateRef<any>, i: number) {
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, {
            class: 'modal-sm modal-dialog-centered back-office-panel'
        })
    }

    cancelRegionButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
    }
}
