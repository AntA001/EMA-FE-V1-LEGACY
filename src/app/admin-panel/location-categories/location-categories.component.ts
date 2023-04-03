import { Country } from './../../models/country'
import { ApiService } from 'src/app/services/api.service'
import { Router, ActivatedRoute } from '@angular/router'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { DataService } from './data.service'
import { Pagination } from '../../interfaces/response'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { Component, TemplateRef, OnDestroy, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { Municipal } from 'src/app/models/municipal'
import { Category } from 'src/app/models/category'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

@Component({
    selector: 'app-location-categories',
    templateUrl: './location-categories.component.html',
    styleUrls: ['./location-categories.component.css']
})
export class LocationCategoriesComponent implements OnInit, OnDestroy {
    locationCategorysList: Array<Category> = []
    countryList: Array<Country> = []
    municipalityList: Array<Municipal> = []
    detail: Array<any> = []
    locationCategoryForm: FormGroup
    modalRef: BsModalRef
    selectedIndex: number
    selectedStatus: any
    selectedId: any
    dataStatus = 'fetching'
    pagination: Pagination<any>
    municipalityId: any = ''
    countryId: any = ''
    modalTitle = ''
    countryName = ''
    municipalityName = ''
    filters = {
        name: '',
        municipality_id: '',
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
            link: '/admin/location-categories',
            value: 'Location-Categories',
            params: { }
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

        if (this.route.snapshot.queryParamMap.get('countryName') &&
            this.route.snapshot.queryParamMap.get('fullName')) {
            this.ds.name = route.snapshot.queryParams.countryName
            this.countryId = route.snapshot.queryParams.countryId

            this.countryName = this.ds.name
            this.municipalityName = route.snapshot.queryParams.fullName
        }

        this.route.queryParams.subscribe((params) => {
            if (params.municipality_id) {
                this.municipalityId = params.municipality_id
            }
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

        this.locationCategoryForm = this.fb.group({
            _id: new FormControl(null),
            nameAL: new FormControl(null),
            nameEN: new FormControl(null, [Validators.required])
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
        this.router.navigate(['/municipal/location-categories'], {
            queryParams: this.filters,
            replaceUrl: true
        })
    }

    search(): void {
        this.waiting.userStatus = []
        this.waiting.search = true
        this.filters.name = this.searchKeyword
        this.filters.municipality_id = this.municipalityId
        this.ds.getList(this.filters).subscribe((resp) => {
            this.waiting.search = false
            if (resp.success === true) {
                this.locationCategorysList = resp.data.locationCategories// ?.data as Array<category> || []
                this.pagination = resp.data as Pagination<any>
                this.dataStatus = 'done'

            }
        })

        if (this.breadCrum.length < 3 ) {
        this.breadCrum.shift()
        this.breadCrum.unshift({
            link: '/admin/location-categories',
            value: 'Location-Categories',
            params: { }
        })
        this.breadCrum.unshift({
            link: `/admin/municipalities`,
            value: this.municipalityName,
            params: { country_id: this.countryId}
        })
        this.breadCrum.unshift({
            link: '/admin/countries',
            value: this.countryName,
            params: { }
        })
    }
    }


    get g() {
        return this.locationCategoryForm.controls
    }

    openModal(modal: TemplateRef<any>, index: number) {
        this.selectedIndex = index
        this.modalTitle = 'Add New Location Categories'
        if (index > -1) {
            this.locationCategoryForm.patchValue(this.locationCategorysList[index])
            this.locationCategoryForm.controls._id.setValue(this.locationCategorysList[index]._id)
            this.modalTitle = 'Edit Location Categories'
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
        if (this.locationCategoryForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.waiting.save = false
            return
        }
        const param: any = {
            _id: this.locationCategoryForm.controls._id.value,
            nameEN: this.locationCategoryForm.controls.nameEN.value,
            nameAL: this.locationCategoryForm.controls.nameAL.value,
            municipality_id: this.municipalityId


        }
        let saveUpdate = this.ds.add(param)
        if (this.locationCategoryForm.value._id !== null) {
            const params: any = {
                _id: this.locationCategoryForm.controls._id.value,
                nameEN: this.locationCategoryForm.controls.nameEN.value,
                nameAL: this.locationCategoryForm.controls.nameAL.value,
                municipality_id: this.municipalityId

            }
            saveUpdate = this.ds.update(params)
        }

        saveUpdate.subscribe((resp: any) => {
            this.waiting.save = false
            if (resp.success === true) {
                if (this.locationCategoryForm.value._id !== null) {
                    this.locationCategorysList[this.selectedIndex].nameEN = this.locationCategoryForm.controls.nameEN.value
                    this.locationCategorysList[this.selectedIndex].nameAL = this.locationCategoryForm.controls.nameAL.value
                    this.locationCategoryForm.controls._id.setValue(null)
                    this.alert.success('Location Category Updated Successfully!!')
                } else {
                    this.locationCategoryForm.controls._id.setValue(resp.data._id)
                    this.locationCategorysList.unshift(this.locationCategoryForm.value)
                    this.locationCategorysList[0].status = 'active'
                    this.alert.success('Location Category Added Successfully!!')
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
        const _id = this.locationCategorysList[this.selectedIndex]._id
        this.ds.delete({ _id }).subscribe((resp: any) => {
            if (resp.success === true) {
                this.waiting.save = false
                this.locationCategorysList.splice(this.selectedIndex, 1)
                this.modalRef.hide()
                this.alert.success('Location Category Deleted Successfully!!')
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

}
