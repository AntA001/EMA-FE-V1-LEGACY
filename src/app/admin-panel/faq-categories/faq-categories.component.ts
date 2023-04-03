import { ApiService } from 'src/app/services/api.service'
import { Router, ActivatedRoute } from '@angular/router'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { DataService } from './data.service'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { Component, TemplateRef } from '@angular/core'
import { Pagination, Resp } from 'src/app/interfaces/response'
import { FaqCategory } from 'src/app/models/faq-category'

@Component({
    selector: 'app-faq-categories',
    templateUrl: './faq-categories.component.html',
    styleUrls: ['./faq-categories.component.css']
})
export class FaqCategoriesComponent {
    dataStatus = 'fetching'
    faqCatList: Array<FaqCategory> = []
    faqCategoryForm: FormGroup
    selectedIndex: number
    modalRef: BsModalRef
    pagination: Pagination<FaqCategory>
    lang: any = new Object()
    contents = ''
    modalTitle = ''
    filters = {
        faq_category: '',
        page: 1
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
            value: 'Faq categories'
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
        this.api.translate('website.faq-category').subscribe((d: object) => {
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

            if (params.faq_category) {
                this.filters.faq_category = params.faq_category
            }

            if (params) {
                this.search()
            }
        })

        this.faqCategoryForm = this.fb.group({
            id: new FormControl(null),
            nameEn: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            descriptionEn: new FormControl(null, [Validators.required, Validators.maxLength(500)])
        })
    }

    setPagination(page: number) {
        this.filters.page = page
        this.router.navigate(['/admin/faq-categories'], {
            queryParams: this.filters,
            replaceUrl: true
        })
    }

    search(): void {
        this.waiting.search = true

        this.ds.getList(this.filters).subscribe((resp: Resp<Pagination<FaqCategory>>) => {
            this.waiting.search = false
            if (resp.success === true) {
                this.faqCatList = resp.data?.data || []
                this.pagination = resp.data as Pagination<FaqCategory>
                this.dataStatus = 'done'
            }
        })
    }

    get g() {
        return this.faqCategoryForm.controls
    }

    openModal(modal: TemplateRef<any>, index: number) {
        this.selectedIndex = index
        this.modalTitle = 'Add New Category'
        if (index > -1) {
            this.faqCategoryForm.controls.id.setValue(this.faqCatList[index].id)
            this.faqCategoryForm.patchValue(this.faqCatList[index])
            this.modalTitle = 'Edit Category'
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
        if (this.faqCategoryForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.waiting.save = false
            return
        }

        let saveUpdate = this.ds.add(this.faqCategoryForm.value)
        if (this.faqCategoryForm.value.id !== null) {
            saveUpdate = this.ds.update(this.faqCategoryForm.value)
        }

        saveUpdate.subscribe((resp: Resp<FaqCategory>) => {
            this.waiting.save = false
            if (resp.success === true) {
                if (this.faqCategoryForm.value.id !== null) {
                    this.faqCatList[this.selectedIndex] = this.faqCategoryForm.value
                    this.faqCategoryForm.controls.id.setValue(null)
                    this.alert.success('Changes done successfully!!')
                } else {
                    this.faqCategoryForm.value.id = resp.data
                    this.faqCatList.push(this.faqCategoryForm.value)
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
            .delete({ id: this.faqCatList[this.selectedIndex].id })
            .subscribe((resp: Resp<undefined>) => {
                this.waiting.save = false
                if (resp.success === false) {
                    this.alert.error(resp?.errors?.general as string)
                    this.modalRef.hide()
                    return
                }
                this.faqCatList.splice(this.selectedIndex, 1)
                this.modalRef.hide()
                this.alert.success('Category deleted successfully!!')
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

    showFaqs(catId: any, catName: any) {
        this.router.navigate(['admin/faqs'], { queryParams: { id: catId, name: catName } })
    }
}
