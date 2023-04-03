import { Resp } from 'src/app/interfaces/response'
import { ApiService } from 'src/app/services/api.service'
import { Router, ActivatedRoute } from '@angular/router'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { DataService } from './data.service'
import { Pagination } from '../../interfaces/response'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { Component, OnInit, TemplateRef } from '@angular/core'
import { City } from 'src/app/models/city'

@Component({
    selector: 'app-cities',
    templateUrl: './cities.component.html',
    styleUrls: ['./cities.component.css']
})
export class CitiesComponent {
    dataStatus = 'fetching'
    cityList: Array<City> = []
    cityForm: FormGroup
    selectedIndex: number
    modalRef: BsModalRef
    pagination: Pagination<City>
    modalTitle = ''
    filters = {
        name: '',
        page: 1
    }
    breadCrum = [
        {
            link: '/admin/cities',
            value: 'Cities'
        }
    ]
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
    }
    stateId = ''

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

        this.waiting = {
            search: false,
            save: false
        }

        this.route.queryParams.subscribe((params) => {
            if (params.page) {
                this.filters.page = params.page
            }
            if (params.stateId) {
                this.stateId = params.stateId
            }

            if (params.title) {
                this.filters.name = params.title
            }
            if (params) {
                this.search()
            }
        })

        this.cityForm = this.fb.group({
            id: new FormControl(null),
            fullName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            shortName: new FormControl(null, [Validators.required]),
            code: new FormControl(null, [Validators.required])

        })
    }

    setPagination(page: number) {
        this.filters.page = page
        this.router.navigate(['/admin/cities'], { queryParams: this.filters, replaceUrl: true })
    }

    search(): void {
        this.waiting.search = true
        const params = {
            stateId: this.stateId,
            page: this.filters.page,
            name: this.filters.name
        }
        this.ds.getList(params).subscribe((resp: Resp<Pagination<City>>) => {
            this.waiting.search = false
            if (resp.success === true) {
                this.cityList = resp.data?.data || []
                this.pagination = resp.data as Pagination<City>
                this.dataStatus = 'done'
            }
        })
    }

    get g() {
        return this.cityForm.controls
    }

    openModal(modal: TemplateRef<any>, index: number) {
        this.selectedIndex = index
        this.modalTitle = 'Add New Cities'
        if (index > -1) {
            this.cityForm.controls.id.setValue(this.cityList[index].id)
            this.cityForm.patchValue(this.cityList[index])
            this.modalTitle = 'Edit Cities'

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
        if (this.cityForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.waiting.save = false
            return
        }

        const params = {
            id: this.cityForm.value.id,
            stateId: this.stateId,
            fullName: this.cityForm.value.fullName,
            shortName: this.cityForm.value.shortName,
            code: this.cityForm.value.code
        }

        let saveUpdate = this.ds.add(params)
        if (this.cityForm.value.id !== null) {
            saveUpdate = this.ds.update(this.cityForm.value)
        }

        saveUpdate.subscribe((resp: Resp<City>) => {
            this.waiting.save = false
            if (resp.success === true) {
                if (this.cityForm.value.id !== null) {
                    this.cityList[this.selectedIndex] = resp.data as City || []
                    this.cityForm.controls.id.setValue(null)
                    this.alert.success('Updated City Successfully!!')
                } else {
                    this.cityForm.value.id = resp.data?.id
                    this.cityList.unshift(resp.data as City || [])
                    this.alert.success('City Added successfully!!')
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
            .delete({ id: this.cityList[this.selectedIndex].id })
            .subscribe((resp: Resp<undefined>) => {
                this.waiting.save = false
                if (resp.success === false) {
                    this.alert.error(resp?.errors?.general as string)
                    this.modalRef.hide()
                    return
                }
                this.cityList.splice(this.selectedIndex, 1)
                this.modalRef.hide()
                this.alert.success('City Deleted Successfully!!')
            })
    }

    confirmDelModal(template: TemplateRef<any>, i: number) {
        this.selectedIndex = i
        this.modalRef = this.ms.show(template, {
            class: 'modal-sm modal-dialog-centered back-office-panel'
        })
    }

    cancelRegionButton(f: any) {
        this.modalRef.hide()
        f.resetForm()
    }
}
