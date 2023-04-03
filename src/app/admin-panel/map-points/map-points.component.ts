import { Country } from './../../models/country'
import { Resp } from 'src/app/interfaces/response'
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
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { LocationCategory } from 'src/app/models/location-category'
import { MapPoint } from 'src/app/models/map-point'

@Component({
    selector: 'app-map-points',
    templateUrl: './map-points.component.html',
    styleUrls: ['./map-points.component.css']
})
export class MapPointsComponent implements OnInit, OnDestroy {
    mapPointsList: Array<any> = []
    countryList: Array<Country> = []
    municipalityList: Array<Municipal> = []
    municipalities: Array<Municipal> = []

    locationCategoryList: Array<LocationCategory>
    detail: Array<any> = []
    mapPointForm: FormGroup
    modalRef: BsModalRef
    selectedIndex: number
    country: any = ''
    selectedStatus: any
    selectedId: any
    dataStatus = 'fetching'
    pagination: Pagination<any>
    modalTitle = ''
    filters = {
        name: '',
        municipality: '',
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
            link: '/admin/map-points',
            value: 'Map Points'
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

        this.mapPointForm = this.fb.group({
            _id: new FormControl(null),
            nameEN: new FormControl(null, [Validators.required]),
            nameAL: new FormControl(null, [Validators.required]),
            addressEN: new FormControl(null, [Validators.required]),
            addressAL: new FormControl(null, [Validators.required]),
            lat: new FormControl(null, [Validators.required]),
            lng: new FormControl(null, [Validators.required]),
            country_id: new FormControl(null, [Validators.required]),
            category_id: new FormControl(null, [Validators.required]),
            municipality_id: new FormControl(null, [Validators.required]),
            phoneNo: new FormControl(null, [Validators.required])

        })

        this.ds.getCountryList().subscribe((resp: Resp<Array<Country>>) => {
            if (resp.success === true) {
                this.countryList = resp?.data as Array<any> || []
                console.log('this.countryList', this.countryList)

            }
        })

    }

    getMunicipality(event: any) {
        const _id = event.target.value
        this.getMunicipalityId(_id)
    }
    getMunicipalityId(id: any) {
        const _id = id
        this.ds.getMunicipiltyList(_id).subscribe((resp: any) => {
            this.municipalityList = resp.data

            if (this.selectedIndex > -1) {
                const municipalityId = this.mapPointsList[this.selectedIndex].municipality._id
                setTimeout(() => {
                    this.mapPointForm.controls.municipality_id.setValue(municipalityId)
                }, 0)
            }
        })
    }

    getLocationCategory(event: any) {
        const _id = event.target.value
        this.getLocationCategoryId(_id)
    }
    getLocationCategoryId(id: any) {
        const params = {
            municipality_id: id
        }
        this.ds.getLocationCategoryList(params).subscribe((resp: any) => {
            this.locationCategoryList = resp.data.locationCategories

            if (this.selectedIndex > -1) {
                const categoryId = this.mapPointsList[this.selectedIndex].category._id
                setTimeout(() => {
                    this.mapPointForm.controls.category_id.setValue(categoryId)
                }, 0)
            }
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
        this.router.navigate(['/admin/map-points'], {
            queryParams: this.filters,
            replaceUrl: true
        })
    }

    search(): void {
        this.waiting.userStatus = []
        this.waiting.search = true
        this.filters.name = this.searchKeyword
        this.ds.getList(this.filters).subscribe((resp: Resp<Array<MapPoint>>) => {
            this.waiting.search = false
            if (resp.success === true) {
                this.mapPointsList = resp?.data as Array<MapPoint> || []
                // this.pagination = resp.data as Pagination<any>
                this.dataStatus = 'done'
            }
        })
    }


    get g() {
        return this.mapPointForm.controls
    }

    openModal(modal: TemplateRef<any>, index: number) {
        this.selectedIndex = index
        this.modalTitle = 'Add New Map Point'
        if (index > -1) {
            this.mapPointForm.patchValue(this.mapPointsList[index])
            this.mapPointForm.controls._id.setValue(this.mapPointsList[index]._id)
            this.mapPointForm.controls.country_id.setValue(this.mapPointsList[index].municipality.country._id)
            this.getMunicipalityId(this.mapPointsList[index].municipality.country._id)
            this.getLocationCategoryId(this.mapPointsList[index].municipality._id)
            this.modalTitle = 'Edit Map Point'
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
        if (this.mapPointForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.waiting.save = false
            return
        }
        const param: any = {
            _id: this.mapPointForm.controls._id.value,
            nameEN: this.mapPointForm.controls.nameEN.value,
            nameAL: this.mapPointForm.controls.nameAL.value,
            addressEN: this.mapPointForm.controls.addressEN.value,
            addressAL: this.mapPointForm.controls.addressAL.value,
            lat: this.mapPointForm.controls.lat.value,
            lng: this.mapPointForm.controls.lng.value,
            municipality_id: this.mapPointForm.controls.municipality_id.value,
            category_id: this.mapPointForm.controls.category_id.value,
            phoneNo: this.mapPointForm.controls.phoneNo.value
        }
        let saveUpdate = this.ds.add(param)
        if (this.mapPointForm.value._id !== null) {
            const params: any = {
                _id: this.mapPointForm.controls._id.value,
                nameEN: this.mapPointForm.controls.nameEN.value,
                nameAL: this.mapPointForm.controls.nameAL.value,
                addressEN: this.mapPointForm.controls.addressEN.value,
                addressAL: this.mapPointForm.controls.addressAL.value,
                lat: this.mapPointForm.controls.lat.value,
                lng: this.mapPointForm.controls.lng.value,
                municipality_id: this.mapPointForm.controls.municipality_id.value,
                category_id: this.mapPointForm.controls.category_id.value,
                phoneNo: this.mapPointForm.controls.phoneNo.value
            }
            saveUpdate = this.ds.update(params)
        }

        saveUpdate.subscribe((resp: Resp<MapPoint>) => {
            this.waiting.save = false
            if (resp.success === true) {
                if (this.mapPointForm.value._id !== null) {
                    this.mapPointsList[this.selectedIndex] = resp.data as MapPoint || []
                    this.mapPointForm.controls._id.setValue(null)
                    this.alert.success('Map Point Updated Successfully!!')
                } else {
                    this.mapPointForm.controls._id.setValue(resp.data?._id)
                    this.mapPointsList.unshift(this.mapPointForm.value)
                    this.mapPointsList[0] = resp.data
                    this.alert.success('Map Point Added Added successfully!!')
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
        const _id = this.mapPointsList[this.selectedIndex]._id
        this.ds.delete({ _id }).subscribe((resp: any) => {
            if (resp.success === true) {
                this.waiting.save = false
                this.mapPointsList.splice(this.selectedIndex, 1)
                this.modalRef.hide()
                this.alert.success('Map Point Deleted Successfully!!')
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
                this.mapPointsList[this.selectedIndex].status = 'active'
                this.modalRef.hide()
            } else {
                this.alert.error(resp.errors?.general || '')
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
                this.mapPointsList[this.selectedIndex].status = 'inactive'
                this.modalRef.hide()
            } else {
                this.alert.error(resp.errors?.general || '')
            }
        })
    }


}
