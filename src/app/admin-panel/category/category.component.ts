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

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, OnDestroy {
    categorysList: Array<Category> = []
    countryList: Array<Country> = []
    municipalityList: Array<Municipal> = []
    detail: Array<any> = []
    categoryForm: FormGroup
    modalRef: BsModalRef
    selectedIndex: number
    selectedStatus: any
    selectedId: any
    dataStatus = 'fetching'
    pagination: Pagination<any>
    modalTitle = ''
    lockStatus = false
    filters = {
        name: '',
        page: 1,
        perPage: 15
    }
    loaderOptions = {
        rows: 5,
        cols: 7,
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
            link: '/admin/category',
            value: 'Categories'
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
            locked: new FormControl(false),
            password: new FormControl(null),
            confirmPassword: new FormControl(null),
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
        this.ds.getList(this.filters).subscribe((resp: Resp<Array<Category>>) => {
            this.waiting.search = false
            if (resp.success === true) {
                this.categorysList = resp.data as Array<Category> || []// ?.data as Array<category> || []
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
            this.categoryForm.patchValue(this.categorysList[index])
            this.categoryForm.controls._id.setValue(this.categorysList[index]._id)
            if (this.categorysList[index].locked == true){
                this.lockStatus = true
                this.categoryForm.controls.confirmPassword.setValue(this.categorysList[index].password)
            }
            this.modalTitle = 'Edit Category'
        }

        this.modalRef = this.ms.show(modal, {
            class: 'modal-md modal-dialog-centered back-office-panel',
            backdrop: 'static',
            ignoreBackdropClick: true,
            keyboard: false
        })
    }

    changeLockStatus() {
        this.lockStatus = !this.lockStatus
    }

    save(f: any) {
        this.waiting.save = true
        if (this.categoryForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.waiting.save = false
            return
        }
        if (this.categoryForm.value.locked === undefined || this.categoryForm.value.locked === null) {
            this.categoryForm.controls.locked.setValue(false)
        }
        if (this.categoryForm.value.locked === true) {
            if (this.categoryForm.value.password === undefined || this.categoryForm.value.password === null) {
                this.alert.error("Password is required!!")
                this.waiting.save = false
                return
            }
            if (this.categoryForm.value.confirmPassword === undefined || this.categoryForm.value.confirmPassword === null) {
                this.alert.error("Confirm Password is required!!")
                this.waiting.save = false
                return
            }
            if (this.categoryForm.value.password !== this.categoryForm.value.confirmPassword) {
                this.alert.error('New and Confirm Password not matched...')
                this.waiting.save = false
                return
            }
        }
        const param: any = {
            _id: this.categoryForm.controls._id.value,
            nameEN: this.categoryForm.controls.nameEN.value,
            nameAL: this.categoryForm.controls.nameAL.value,
            nameEL: this.categoryForm.controls.nameEL.value,
            nameBG: this.categoryForm.controls.nameBG.value,
            nameMK: this.categoryForm.controls.nameMK.value,
            locked: this.categoryForm.controls.locked.value,
            password: this.categoryForm.controls.password.value,
            confirmPassword: this.categoryForm.controls.confirmPassword.value

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
                locked: this.categoryForm.controls.locked.value,
                password: this.categoryForm.controls.password.value,
                confirmPassword: this.categoryForm.controls.confirmPassword.value
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
                    this.categorysList[this.selectedIndex].locked = this.categoryForm.controls.locked.value
                    this.categorysList[this.selectedIndex].password = this.categoryForm.controls.password.value
                    this.categorysList[this.selectedIndex].confirmPassword = this.categoryForm.controls.confirmPassword.value
                    this.categoryForm.controls._id.setValue(null)
                    this.alert.success('Category Updated Successfully!!')
                } else {
                    this.categoryForm.controls._id.setValue(resp.data?._id)
                    this.categorysList.unshift(resp.data as Category || [])
                    this.categorysList[0].status = 'active'
                    this.alert.success('Category Added successfully!!')
                }
            } else {
                this.alert.error(resp.message as string)
                this.waiting.save = false
                return
            }
            this.modalRef.hide()
            f.resetForm()
            this.lockStatus = false
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
                this.alert.success('Category Deleted Successfully!!')
            } else {
                this.alert.error(resp.message)
            }
        })
    }

    cancelButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
        this.lockStatus = false
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
