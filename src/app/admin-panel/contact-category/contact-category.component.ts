import { Country } from './../../models/country'
import { ApiService } from 'src/app/services/api.service'
import { Router, ActivatedRoute } from '@angular/router'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { DataService } from './data.service'
import { Pagination, Resp } from '../../interfaces/response'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { Component, TemplateRef, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { Municipal } from 'src/app/models/municipal'
import { Category } from 'src/app/models/category'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { ContactCategory } from 'src/app/models/contact-category'

@Component({
    selector: 'app-contact-category',
    templateUrl: './contact-category.component.html',
    styleUrls: ['./contact-category.component.css']
})
export class ContactCategoryComponent implements OnInit, OnDestroy {
    categorysList: Array<ContactCategory> = []
    detail: Array<any> = []
    color: any = ''
    categoryForm: FormGroup
    modalRef: BsModalRef
    selectedIndex: number
    selectedStatus: any
    selectedId: any
    dataStatus = 'fetching'
    pagination: Pagination<any>
    modalTitle = ''
    filters = {
        name: '',
        page: 1,
        perPage: 15
    }
    loaderOptions = {
        rows: 5,
        cols: 8,
        colSpans: {
            0: 1
        }
    }
    waiting: {
        search: boolean
        save: boolean
        userStatus: Array<any>
    }
    breadCrum = [
        {
            link: '/admin/contact-category',
            value: 'Contact Categories'
        }
    ]
    searchKeyword = ''
    searchKeyword$: Subject<string> = new Subject<string>()
    searchKeywordSub: any

    constructor(
        public ds: DataService,
        private alert: IAlertService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private route: ActivatedRoute,
        private router: Router,
        public api: ApiService,
        private ms: BsModalService,
        private modalService: BsModalService
    ) {
        this.waiting = {
            search: false,
            save: false,
            userStatus: []
        }

        this.route.queryParams.subscribe((params) => {
            if (params.page) {
                this.filters.page = params.page
            }
            if (params.perPage) {
                this.filters.perPage = params.perPage
            }
            if (params.name) {
                this.filters.name = params.name
            }
            if (params) {
                this.search()
            }
        })

        this.categoryForm = this.fb.group({
            _id: new FormControl(null),
            nameAL: new FormControl(null, [Validators.required]),
            nameEL: new FormControl(null, [Validators.required]),
            nameEN: new FormControl(null, [Validators.required]),
            nameBG: new FormControl(null, [Validators.required]),
            nameMK: new FormControl(null, [Validators.required]),
            defaultCategory: new FormControl(false)

        })

    }

    ngOnInit(): void {
        this.searchKeywordSub = this.searchKeyword$
            .pipe(debounceTime(1000), distinctUntilChanged())
            .subscribe((searchKeyword) => {
                console.log(searchKeyword)
                this.filters.page = 1
                this.search()
            })
    }

    ngOnDestroy(): void {
        this.searchKeywordSub.unsubscribe()
    }


    searchKeywordChange(value: string) {
        this.searchKeyword$.next(value)
    }

    setPagination(page: number) {
        this.filters.page = page
        this.router.navigate(['/municipal/category'], {
            queryParams: this.filters,
            replaceUrl: true
        })
    }

    search(): void {
        this.waiting.userStatus = []
        this.waiting.search = true
        this.filters.name = this.searchKeyword
        this.ds.getList(this.filters).subscribe((resp: Resp<Array<ContactCategory>>) => {
            this.waiting.search = false
            if (resp.success === true) {
                this.categorysList = resp.data as Array<ContactCategory> || []// ?.data as Array<category> || []
                // this.pagination = resp.data as Pagination<any>
                this.dataStatus = 'done'
            }
        })
    }


    get g() {
        return this.categoryForm.controls
    }

    openModal(modal: TemplateRef<any>, index: number) {
        this.selectedIndex = index
        this.modalTitle = 'Add New Category'
        if (index > -1) {
            console.log(this.categorysList[index].color)

            this.categoryForm.patchValue(this.categorysList[index])
            if (this.categorysList[index]?.defaultCategory) {
                this.categoryForm.controls.defaultCategory.setValue(true)
            } else {
                this.categoryForm.controls.defaultCategory.setValue(false)

            }
            this.categoryForm.controls._id.setValue(this.categorysList[index]._id)
            this.color = this.categorysList[index].color

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
        if (this.categoryForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.waiting.save = false
            return
        }
        if (this.color === '') {
            this.alert.error('Please Select Color.')
            this.waiting.save = false
            return
        }

        if (this.categoryForm.controls.defaultCategory.value === null || this.categoryForm.controls.defaultCategory.value === undefined) {
            this.categoryForm.controls.defaultCategory.setValue(false)
        }
        const param: any = {
            _id: this.categoryForm.controls._id.value,
            nameEN: this.categoryForm.controls.nameEN.value,
            nameAL: this.categoryForm.controls.nameAL.value,
            nameEL: this.categoryForm.controls.nameEL.value,
            nameBG: this.categoryForm.controls.nameBG.value,
            nameMK: this.categoryForm.controls.nameMK.value,
            color: this.color,
            defaultCategory: this.categoryForm.controls.defaultCategory.value

        }
        let saveUpdate = this.ds.add(param)
        if (this.categoryForm.value._id !== null) {
            const params: any = {
                _id: this.categoryForm.controls._id.value,
                nameEN: this.categoryForm.controls.nameEN.value,
                nameAL: this.categoryForm.controls.nameAL.value,
                nameEL: this.categoryForm.controls.nameEL.value,
                nameBG: this.categoryForm.controls.nameBG.value,
                nameMK: this.categoryForm.controls.nameMK.value,
                color: this.color,
                defaultCategory: this.categoryForm.controls.defaultCategory.value

            }
            saveUpdate = this.ds.update(params)
        }

        saveUpdate.subscribe((resp: Resp<Category>) => {
            this.waiting.save = false
            if (resp.success === true) {
                if (this.categoryForm.value._id !== null) {
                    this.categorysList[this.selectedIndex].nameEN = this.categoryForm.controls.nameEN.value
                    this.categorysList[this.selectedIndex].nameAL = this.categoryForm.controls.nameAL.value
                    this.categorysList[this.selectedIndex].nameEL = this.categoryForm.controls.nameEL.value
                    this.categorysList[this.selectedIndex].nameBG = this.categoryForm.controls.nameBG.value
                    this.categorysList[this.selectedIndex].nameMK = this.categoryForm.controls.nameMK.value
                    this.categorysList.forEach((e: any) => {
                        if (e.defaultCategory === true) {
                            e.defaultCategory = false
                        }
                    })
                    this.categorysList[this.selectedIndex].defaultCategory = this.categoryForm.controls.defaultCategory.value


                    this.categoryForm.controls._id.setValue(null)
                    this.categorysList[this.selectedIndex].color = this.color

                    this.alert.success('Contact Category Updated Successfully!!')
                } else {
                    this.categoryForm.controls._id.setValue(resp.data?._id)
                    this.categorysList.unshift(resp.data as ContactCategory || [])
                    this.categorysList[0].status = 'active'
                    this.color = ''
                    this.alert.success('Contact Category Added successfully!!')
                }
            } else {
                this.alert.error(resp.message as string)
                this.waiting.save = false
                return
            }
            this.modalRef.hide()
            f.resetForm()
        })
    }

    confirmDelModal(template: TemplateRef<any>, i: number) {
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, {
            class: 'modal-sm modal-dialog-centered back-office-panel'
        })
    }

    delete() {
        this.waiting.save = true
        const _id = this.categorysList[this.selectedIndex]._id
        this.ds.delete({ _id }).subscribe((resp: any) => {
            if (resp.success === true) {
                this.waiting.save = false
                this.categorysList.splice(this.selectedIndex, 1)
                this.modalRef.hide()
                this.alert.success('Contact Category Deleted Successfully!!')
            } else {
                this.alert.error(resp.message)
            }
        })
    }

    cancelButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
    }

    cancelRegionButton(f: any) {
        this.modalRef.hide()
        f.resetForm()
    }

    statusConfirmingModal(changeStatus: TemplateRef<any>, id: number, index: number, status: string) {
        this.selectedId = id
        this.selectedIndex = index
        this.selectedStatus = status
        this.modalRef = this.ms.show(
            changeStatus,
            {
                class: 'modal-md modal-dialog-centered back-office-panel',
                backdrop: 'static',
                ignoreBackdropClick: true,
                keyboard: false
            }
        )
    }

    changeStatusAct() {
        this.waiting.userStatus[this.selectedIndex] = true
        const params = {
            _id: this.selectedId,
            status: this.selectedStatus
        }
        this.ds.changeStatus(params).subscribe((resp: any) => {
            this.waiting.userStatus[this.selectedIndex] = false
            if (resp.success === true) {
                this.alert.success('Active Successfully')
                this.categorysList[this.selectedIndex].status = 'active'
                this.modalRef.hide()
            } else {
                this.alert.error(resp.message || '')
            }
        })
    }

    changeStatusInact() {
        this.waiting.userStatus[this.selectedIndex] = true
        const params = {
            _id: this.selectedId,
            status: this.selectedStatus
        }
        this.ds.changeStatus(params).subscribe((resp: any) => {
            this.waiting.userStatus[this.selectedIndex] = false
            if (resp.success === true) {
                this.alert.success('Inactive Successfully')
                this.categorysList[this.selectedIndex].status = 'inactive'
                this.modalRef.hide()
            } else {
                this.alert.error(resp.message || '')
            }
        })
    }

}
