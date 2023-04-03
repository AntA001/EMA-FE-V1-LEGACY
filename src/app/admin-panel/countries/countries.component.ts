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
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

@Component({
    selector: 'app-countries',
    templateUrl: './countries.component.html',
    styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit, OnDestroy {
    countriesList: Array<Country> = []
    nativeList : any = []
    detail: Array<any> = []
    countryForm: FormGroup
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
        cols: 5,
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
            link: '/admin/countries',
            value: 'Countries'
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

        this.countryForm = this.fb.group({
            _id: new FormControl(null),
            nameEN: new FormControl(null, [Validators.required]),
            nativeLanguage: new FormControl(''),
            nameAL: new FormControl(null)

        })


    }

    ngOnInit(): void {
        this.ds.getListNative().subscribe((resp) => {
            if (resp.success) {
                this.nativeList = resp.data
            }

        })

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
        this.router.navigate(['/admin/countries'], {
            queryParams: this.filters,
            replaceUrl: true
        })
    }

    search(): void {
        this.waiting.userStatus = []
        this.waiting.search = true
        this.filters.name = this.searchKeyword
        this.ds.getList(this.filters).subscribe((resp: Resp<Array<Country>>) => {
            this.waiting.search = false
            if (resp.success === true) {
                this.countriesList  = resp?.data as Array<Country> || []
                // this.pagination = resp.data as Pagination<any>
                this.dataStatus = 'done'
            }
        })
    }


    get g() {
        return this.countryForm.controls
    }

    openModal(modal: TemplateRef<any>, index: number) {
        this.selectedIndex = index
        this.modalTitle = 'Add New Country'
        if (index > -1) {
            this.countryForm.patchValue(this.countriesList[index])
            this.countryForm.controls._id.setValue(this.countriesList[index]._id)
            if (this.countriesList[index].nativeLanguage) {
            this.countryForm.controls.nativeLanguage.setValue(this.countriesList[index].nativeLanguage.code)
            } else {
                this.countryForm.controls.nativeLanguage.setValue('')
            }
            this.modalTitle = 'Edit Country'
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
        if (this.countryForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.waiting.save = false
            return
        }
        if (this.countryForm.controls.nameAL.value === '' || this.countryForm.controls.nameAL.value === undefined) {
            this.countryForm.controls.nameAL.setValue(null)
        }
        if (this.countryForm.controls.nativeLanguage.value === '' || this.countryForm.controls.nativeLanguage.value === undefined) {
            this.countryForm.controls.nativeLanguage.setValue(null)
        }
        const param: any = {
            _id: this.countryForm.controls._id.value,
            nameEN: this.countryForm.controls.nameEN.value,
            nameAL: this.countryForm.controls.nameAL.value,
            nativeLanguage: this.countryForm.controls.nativeLanguage.value

        }
        let saveUpdate = this.ds.add(param)
        if (this.countryForm.value._id !== null) {
            const params: any = {
                _id: this.countryForm.controls._id.value,
                nameEN: this.countryForm.controls.nameEN.value,
                nameAL: this.countryForm.controls.nameAL.value,
                nativeLanguage: this.countryForm.controls.nativeLanguage.value

            }
            saveUpdate = this.ds.update(params)
        }
        saveUpdate.subscribe((resp: Resp<Country>) => {
                      this.waiting.save = false
            if (resp.success === true) {
                if (this.countryForm.value._id !== null) {
                    this.countriesList[this.selectedIndex] = resp.data as Country || []
                    this.countryForm.controls._id.setValue(null)
                    this.alert.success('Country Updated Successfully!!')
                } else {
                    this.countryForm.controls._id.setValue(resp.data?._id)
                    this.countriesList.unshift(this.countryForm.value)
                    this.countriesList[0] =  resp.data as Country || []
                    this.alert.success('Country  Added successfully!!')
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
        const _id = this.countriesList[this.selectedIndex]._id
        this.ds.delete({ _id }).subscribe((resp: any) => {
            if (resp.success === true) {
                this.waiting.save = false
                this.countriesList.splice(this.selectedIndex, 1)
                this.modalRef.hide()
                this.alert.success('Country Deleted Successfully!!')
            } else {
                this.alert.error(resp.message as string)
            }
        })
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
                this.countriesList[this.selectedIndex].status = 'active'
                this.modalRef.hide()
            } else {
                this.alert.error(resp.message as string)
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
    this.countriesList[this.selectedIndex].status = 'inactive'
                this.modalRef.hide()
            } else {
                this.alert.error(resp.message as string)
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

    showMunicipalities(countryId: any, name: string) {
        this.router.navigate(['admin/municipalities'], { queryParams: { country_id: countryId, fullName: name} })

    }


}
