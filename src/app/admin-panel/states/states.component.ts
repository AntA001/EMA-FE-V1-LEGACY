import { State } from './../../models/state'
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

@Component({
    selector: 'app-states',
    templateUrl: './states.component.html',
    styleUrls: ['./states.component.css']
})
export class StatesComponent {
    dataStatus = 'fetching'
    stateList: Array<State> = []
    stateForm: FormGroup
    selectedIndex: number
    modalRef: BsModalRef
    pagination: Pagination<State>
    modalTitle = ''
    filters = {
        name: '',
        page: 1
    }
    breadCrum = [
        {
            link: '/admin/states',
            value: 'States'
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
    countryId = ''

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
            if (params.countryId) {
                this.countryId = params.countryId
            }

            if (params.title) {
                this.filters.name = params.title
            }
            if (params) {
                this.search()
            }
        })

        this.stateForm = this.fb.group({
            id: new FormControl(null),
            fullName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            shortName: new FormControl(null, [Validators.required]),
            code: new FormControl(null, [Validators.required])

        })
    }

    setPagination(page: number) {
        this.filters.page = page
        this.router.navigate(['/admin/states'], { queryParams: this.filters, replaceUrl: true })
    }

    search(): void {
        this.waiting.search = true
        const params = {
            countryId: this.countryId,
            page: this.filters.page,
            name: this.filters.name
        }

        this.ds.getList(params).subscribe((resp: Resp<Pagination<State>>) => {
            this.waiting.search = false
            if (resp.success === true) {
                this.stateList = resp.data?.data || []
                this.pagination = resp.data as Pagination<State>
                this.dataStatus = 'done'
            }
        })
    }

    get g() {
        return this.stateForm.controls
    }

    openModal(modal: TemplateRef<any>, index: number) {
        this.selectedIndex = index
        this.modalTitle = 'Add New State'
        if (index > -1) {
            this.stateForm.controls.id.setValue(this.stateList[index].id)
            this.stateForm.patchValue(this.stateList[index])
            this.modalTitle = 'Edit State'

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
        if (this.stateForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.waiting.save = false
            return
        }
        const params = {
            id: this.stateForm.value.id,
            countryId: this.countryId,
            fullName: this.stateForm.value.fullName,
            shortName: this.stateForm.value.shortName,
            code: this.stateForm.value.code
        }
        let saveUpdate = this.ds.add(params)
        if (this.stateForm.value.id !== null) {
            saveUpdate = this.ds.update(this.stateForm.value)
        }

        saveUpdate.subscribe((resp: Resp<State>) => {
            this.waiting.save = false
            if (resp.success === true) {
                if (this.stateForm.value.id !== null) {
                    this.stateList[this.selectedIndex] = resp.data as State || []
                    this.stateForm.controls.id.setValue(null)
                    this.alert.success('State Updated successfully!!')
                } else {
                    this.stateForm.value.id = resp.data?.id
                    this.stateList.unshift(resp.data as State || [])
                    this.alert.success('State Added Successfully!!')
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
            .delete({ id: this.stateList[this.selectedIndex].id })
            .subscribe((resp: Resp<undefined>) => {
                this.waiting.save = false
                if (resp.success === false) {
                    this.alert.error(resp?.errors?.general as string)
                    this.modalRef.hide()
                    return
                }
                this.stateList.splice(this.selectedIndex, 1)
                this.modalRef.hide()
                this.alert.success('State Deleted Successfully!!')
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
    showCities(stateId: number) {
        this.router.navigate(['admin/cities'], { queryParams: { stateId} })
    }
}
