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
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { Municipal } from 'src/app/models/municipal'

@Component({
    selector: 'app-municipalities',
    templateUrl: './municipalities.component.html',
    styleUrls: ['./municipalities.component.css']
})
export class MunicipalitiesComponent implements OnInit, OnDestroy {
    municipalitiesList: Array<Municipal> = []
    detail: Array<any> = []
    municipalityForm: FormGroup
    countryId: any
    modalRef: BsModalRef
    selectedIndex: number
    selectedStatus: any
    selectedId: any
    dataStatus = 'fetching'
    pagination: Pagination<any>
    spinnerSVG = '/assets/images/rolling.svg'
    thumbnailModalRef: BsModalRef
    thmbnailChangedEvent: any
    thumbnailPicked: boolean = false
    croppedThumbnail: any
    thumbnailImage: string = ''
    title = 'Countries'
    name: any
    modalTitle = ''
    filters = {
        name: '',
        country_id: '',
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
            link: '/admin/municipalities',
            value: 'Municipalities'
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

        if (this.route.snapshot.queryParamMap.get('country_id') &&
            this.route.snapshot.queryParamMap.get('fullName')) {
            // this.ds.name = route.snapshot.queryParams.fullName
            // this.name = this.ds.name
            this.name = route.snapshot.queryParams.fullName
            this.title = this.name
        }

        this.route.queryParams.subscribe((params) => {
            if (params.country_id) {
                this.countryId = params.country_id
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

        this.breadCrum.unshift({
            link: '/admin/countries',
            // value: this.ds.name
            value: this.title
        })

        this.municipalityForm = this.fb.group({
            _id: new FormControl(null),
            nameEN: new FormControl(null, [Validators.required]),
            nameAL: new FormControl(null),
            max_sms_count: new FormControl(null, [Validators.required]),
            facebookLink: new FormControl(null),
            twitterLink: new FormControl(null),
            webLink: new FormControl(null),
            instagramLink: new FormControl(null),
            youtubeLink: new FormControl(null)

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
        this.router.navigate(['/admin/municipalities'], {
            queryParams: this.filters,
            replaceUrl: true
        })
    }

    search(): void {
        this.waiting.userStatus = []
        this.waiting.search = true
        this.filters.name = this.searchKeyword
        this.filters.country_id = this.countryId
        this.ds.getList(this.filters).subscribe((resp) => {
            this.waiting.search = false
            if (resp.success === true) {
                this.municipalitiesList = resp.data// ?.data as Array<municipality> || []
                this.pagination = resp.data as Pagination<any>
                this.dataStatus = 'done'

                // this.title = resp.data[0].country.nameEN
                this.breadCrum.shift()
                this.breadCrum.unshift({
                    link: '/admin/countries',
                    value: this.title
                })
            }

        })
    }


    get g() {
        return this.municipalityForm.controls
    }

    openModal(modal: TemplateRef<any>, index: number) {
        this.selectedIndex = index
        this.thumbnailPicked = false
        this.modalTitle = 'Add New Municipality'
        if (index > -1) {
            this.municipalityForm.patchValue(this.municipalitiesList[index])
            this.ds.municipalityId = this.municipalitiesList[index]._id
            this.ds.municipalityUpdate = this.municipalitiesList[index].updatedAt
            this.municipalityForm.controls.max_sms_count.setValue(this.municipalitiesList[index].maxSmsCount)
            this.municipalityForm.controls._id.setValue(this.municipalitiesList[index]._id)
            this.municipalityForm.controls.facebookLink.setValue(this.municipalitiesList[index].facebookLink)
            this.municipalityForm.controls.twitterLink.setValue(this.municipalitiesList[index].twitterLink)
            this.municipalityForm.controls.webLink.setValue(this.municipalitiesList[index].webLink)
            this.municipalityForm.controls.instagramLink.setValue(this.municipalitiesList[index].instagramLink)
            this.municipalityForm.controls.youtubeLink.setValue(this.municipalitiesList[index].youtubeLink)

            this.modalTitle = 'Edit Municipality'
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
        if (this.municipalityForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.waiting.save = false
            return
        }
        if (this.municipalityForm.controls.nameAL.value === '' || this.municipalityForm.controls.nameAL.value === undefined) {
            this.municipalityForm.controls.nameAL.setValue(null)
        }
        if (this.municipalityForm.controls.twitterLink.value === '' ) {
            this.municipalityForm.controls.twitterLink.setValue(null)
        }
        if (this.municipalityForm.controls.webLink.value === '' ) {
            this.municipalityForm.controls.webLink.setValue(null)
        }
        if (this.municipalityForm.controls.facebookLink.value === '' ) {
            this.municipalityForm.controls.facebookLink.setValue(null)
        }
        if (this.municipalityForm.controls.instagramLink.value === '' ) {
            this.municipalityForm.controls.instagramLink.setValue(null)
        }
        if (this.municipalityForm.controls.youtubeLink.value === '' ) {
            this.municipalityForm.controls.youtubeLink.setValue(null)
        }

        const requiredPromises: Array<any> = []
        const data = f.value
        // if(this.dataForm.value._id === null) {
        // delete data._id
        // }
        const formData = this.api.jsonToFormData(data)
        formData.append('country_id', this.countryId)

        const thumbnailPromise = fetch(this.thumbnailImage)
            .then(res => res.blob())
            .then(blob => {
                const imageFile = new File([blob], 'image', { type: 'image/png' })
               if (this.thumbnailPicked) {
                formData.append('logo', imageFile)
}
            })
        requiredPromises.push(thumbnailPromise)
        Promise.all(requiredPromises)
            .then(_ => this.sendCall(formData, f))
        }


        sendCall(formData: FormData, f: any): void {
            console.log('formData', formData)

            let saveUpdate = this.ds.add(formData)
            if (this.municipalityForm.value._id !== null) {
                saveUpdate = this.ds.update(formData)
            }

        saveUpdate.subscribe((resp: any) => {
            this.waiting.save = false
            if (resp.success === true) {
                if (this.municipalityForm.value._id !== null) {
                    this.municipalitiesList[this.selectedIndex].nameEN = this.municipalityForm.controls.nameEN.value
                    this.municipalitiesList[this.selectedIndex].nameAL = this.municipalityForm.controls.nameAL.value
                    this.municipalitiesList[this.selectedIndex].maxSmsCount = this.municipalityForm.controls.max_sms_count.value
                    this.municipalitiesList[this.selectedIndex].facebookLink = this.municipalityForm.controls.facebookLink.value
                    this.municipalitiesList[this.selectedIndex].twitterLink = this.municipalityForm.controls.twitterLink.value
                    this.municipalitiesList[this.selectedIndex].webLink = this.municipalityForm.controls.webLink.value
                    this.municipalitiesList[this.selectedIndex].instagramLink = this.municipalityForm.controls.instagramLink.value
                    this.municipalitiesList[this.selectedIndex].youtubeLink = this.municipalityForm.controls.youtubeLink.value
                    this.municipalitiesList[this.selectedIndex].updatedAt = resp.data.updatedAt


                    this.municipalityForm.controls._id.setValue(null)
                    this.alert.success('Municipality Updated Successfully!!')
                } else {
                    this.municipalityForm.controls._id.setValue(resp.data._id)
                    this.municipalitiesList.unshift(this.municipalityForm.value)
                    this.municipalitiesList[0] = resp.data
                    this.municipalitiesList[0].status = 'active'
                    this.alert.success('Municipality  Added successfully!!')
                }
            } else {
                this.alert.error(resp.message as string)
                this.waiting.save = false
                return
            }
            this.modalRef.hide()
            this.ds.municipalityId = -1
            this.thumbnailImage = ''
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
        const _id = this.municipalitiesList[this.selectedIndex]._id
        this.ds.delete({ _id }).subscribe((resp: any) => {
            if (resp.success === true) {
                this.waiting.save = false
                this.municipalitiesList.splice(this.selectedIndex, 1)
                this.modalRef.hide()
                this.alert.success('Municipality Deleted Successfully!!')
            } else {
                this.alert.error(resp.message)
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
                this.municipalitiesList[this.selectedIndex].status = 'active'
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
                this.municipalitiesList[this.selectedIndex].status = 'inactive'
                this.modalRef.hide()
            } else {
                this.alert.error(resp.errors?.general || '')
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


    showMunicipalities(municipalityId: any, name: string) {
        this.router.navigate(['admin/location-categories'], { queryParams: { municipality_id: municipalityId, fullName: name, countryName: this.title, countryId: this.countryId } })

    }

    browseThumbnailImage() {
        document.getElementById('thubnail-file')?.click()
    }

    openThumbnailModal(event: Event, contentRef: TemplateRef<any>) {
        this.thmbnailChangedEvent = event
        this.thumbnailModalRef = this.modalService.show(contentRef, {
            class: 'modal-md modal-dialog-centered back-office-panel'
        })
    }

    cropComplete() {
        this.thumbnailImage = this.croppedThumbnail
        this.thumbnailPicked = true
        this.thumbnailModalRef.hide()
    }

    modalOpen(contentRef: TemplateRef<any>) {
        this.thumbnailModalRef = this.modalService.show(contentRef, {
            class: 'modal-md modal-dialog-centered website'
        })
    }
}
