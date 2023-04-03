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
import { TranslateService } from '@ngx-translate/core'
@Component({
    selector: 'app-municipal-admins',
    templateUrl: './municipal-admins.component.html',
    styleUrls: ['./municipal-admins.component.css']
})
export class MunicipalAdminsComponent implements OnInit, OnDestroy {
    municipalAdminsList: Array<any> = []
    countryList: Array<Country> = []
    municipalityList: Array<Municipal> = []
    municiaplAdminTypeList: Array<any> = []
    detail: Array<any> = []
    municipalAdminForm: FormGroup
    modalRef: BsModalRef
    selectedIndex: number
    selectedStatus: any
    selectedId: any
    dataStatus = 'fetching'
    pagination: Pagination<any>
    modalTitle = ''
    type: any = ''
    filters = {
        name: '',
        page: 1,
        perPage: 15
    }
    generalEnum: any = {
        gr: 'Γενικός Διοικ',
        en: 'General Admin',
        al: 'Administrata e Përgjithshme',
        mk: 'Генерален админ',
        bg: 'Общий администратор'
    }
    sosEnum: any = {
        gr: 'Διαχειριστής SOS',
        en: 'SOS Admin',
        al: 'SOS Admin',
        mk: 'СОС админ',
        bg: 'SOS-администратор'
    }
    fireSosEnum: any = {
        gr: 'Φωτιά SOS Διαχειρ',
        en: 'Fire SOS Admin',
        al: 'Fire SOS Admin',
        mk: 'Оган СОС админ',
        bg: 'Пожарный SOS-администратор'
    }
    healthEnum: any = {
        gr: 'Υγεία SOS Διαχειρ',
        en: 'Health SOS Admin',
        al: 'Shëndeti SOS Admin',
        mk: 'Здравје СОС Админ',
        bg: 'SOS-администратор здравоохранения'
    }
    policeEnum: any = {
        gr: 'Αστυνομία SOS Διοικ',
        en: 'Police SOS Admin',
        al: 'Policia SOS Admin',
        mk: 'Полицијата СОС админ',
        bg: 'SOS-администратор полиции'
    }
    newsEnum: any = {
        gr: 'διαχειριστής ειδήσεων',
        en: 'News Admin',
        al: 'Administratori i lajmeve',
        mk: 'Администратор за вести',
        bg: 'Администратор новостей'
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
            link: '/admin/municipal-admins',
            value: 'Municipal Admins'
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
        private modalService: BsModalService,
        public ts: TranslateService,
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

        this.municipalAdminForm = this.fb.group({
            _id: new FormControl(null),
            name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
            email: new FormControl(null, [Validators.required, Validators.email,]),
            phone_no: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
            password: new FormControl(null, [Validators.required, Validators.minLength(6),]),
            confirm_password: new FormControl(null, [Validators.required]),
            municipality_id: new FormControl(null, [Validators.required]),
            country_id: new FormControl(null, Validators.required),
            municipal_admin_type: new FormControl('general', [Validators.required]),
        })

        this.ds.getCountryList().subscribe((resp: Resp<Array<Country>>) => {
            if (resp.success === true) {
                this.countryList = resp?.data as Array<any> || []
                console.log('this.countryList', this.countryList)

            }
        })

        this.ds.getMunicipalAdminTypeList().subscribe((resp: any) => {
            this.municiaplAdminTypeList = resp.data
        })
    }

    getMunicipality(event: any) {
        console.log('event.target.value', event.target.value)
        const _id = event.target.value
        this.ds.getMunicipiltyList(_id).subscribe((resp: any) => {
            this.municipalityList = resp.data
        })
    }

    getMunicipalityId(id: any) {
        const _id = id
        this.ds.getMunicipiltyList(_id).subscribe((resp: any) => {
            this.municipalityList = resp.data
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
        this.router.navigate(['/admin/municipal-admins'], {
            queryParams: this.filters,
            replaceUrl: true
        })
    }

    municipalAdminType(type: any) {
        const lang = this.ts.currentLang
        if (type === 'general') {
            switch (lang) {
                case 'en':
                    this.type = this.generalEnum.en
                    break;
                case 'gr':
                    this.type = this.generalEnum.gr
                    break;
                case 'al':
                    this.type = this.generalEnum.al
                    break;
                case 'mk':
                    this.type = this.generalEnum.mk
                    break;
                case 'bg':
                    this.type = this.generalEnum.bg
                    break;
                default:
                    this.generalEnum.en
            }
        } else if (type === 'SOS') {
            switch (lang) {
                case 'en':
                    this.type = this.sosEnum.en
                    break;
                case 'gr':
                    this.type = this.sosEnum.gr
                    break;
                case 'al':
                    this.type = this.sosEnum.al
                    break;
                case 'mk':
                    this.type = this.sosEnum.mk
                    break;
                case 'bg':
                    this.type = this.sosEnum.bg
                    break;
                default:
                    this.type = this.sosEnum.en
            }

        }else if (type === 'fire-SOS') {
            switch (lang) {
                case 'en':
                    this.type = this.fireSosEnum.en
                    break;
                case 'gr':
                    this.type = this.fireSosEnum.gr
                    break;
                case 'al':
                    this.type = this.fireSosEnum.al
                    break;
                case 'mk':
                    this.type = this.fireSosEnum.mk
                    break;
                case 'bg':
                    this.type = this.fireSosEnum.bg
                    break;
                default:
                    this.type = this.fireSosEnum.en
            }

        }else if (type === 'health-SOS') {
            switch (lang) {
                case 'en':
                    this.type = this.healthEnum.en
                    break;
                case 'gr':
                    this.type = this.healthEnum.gr
                    break;
                case 'al':
                    this.type = this.healthEnum.al
                    break;
                case 'mk':
                    this.type = this.healthEnum.mk
                    break;
                case 'bg':
                    this.type = this.healthEnum.bg
                    break;
                default:
                    this.type = this.healthEnum.en
            }

        } else if (type === 'police-SOS') {
            switch (lang) {
                case 'en':
                    this.type = this.policeEnum.en
                    break;
                case 'gr':
                    this.type = this.policeEnum.gr
                    break;
                case 'al':
                    this.type = this.policeEnum.al
                    break;
                case 'mk':
                    this.type = this.policeEnum.mk
                    break;
                case 'bg':
                    this.type = this.policeEnum.bg
                    break;
                default:
                    this.type = this.policeEnum.en
            }

        }  else {
            switch (lang) {
                case 'en':
                    this.type = this.newsEnum.en
                    break;
                case 'gr':
                    this.type = this.newsEnum.gr
                    break;
                case 'al':
                    this.type = this.newsEnum.al
                    break;
                case 'mk':
                    this.type = this.newsEnum.mk
                    break;
                case 'bg':
                    this.type = this.newsEnum.bg
                    break;
                default:
                    this.type = this.newsEnum.en
            }
        }
        return this.type

    }
    search(): void {
        this.waiting.userStatus = []
        this.waiting.search = true
        this.filters.name = this.searchKeyword
        this.ds.getList(this.filters).subscribe((resp) => {
            this.waiting.search = false
            if (resp.success === true) {
                this.municipalAdminsList = resp.data// ?.data as Array<Contact> || []
                this.pagination = resp.data as Pagination<any>
                this.dataStatus = 'done'
            }
        })
    }


    get g() {
        return this.municipalAdminForm.controls
    }

    addMunicipalAdmin(modal: TemplateRef<any>, index: number) {
        this.selectedIndex = index
        this.modalTitle = 'Add New Municipal Admin'
        if (index > -1) {
            this.getMunicipalityId(this.municipalAdminsList[index].municipality.country._id)
            this.municipalAdminForm.controls.password.setValidators([])
            this.municipalAdminForm.controls.password.updateValueAndValidity()
            this.municipalAdminForm.controls.confirm_password.setValidators([])
            this.municipalAdminForm.controls.confirm_password.updateValueAndValidity()
            this.municipalAdminForm.controls._id.setValue(this.municipalAdminsList[index]._id)
            this.municipalAdminForm.controls.phone_no.setValue(this.municipalAdminsList[index].phoneNo)
            this.municipalAdminForm.patchValue(this.municipalAdminsList[index])
            this.municipalAdminForm.controls.country_id.setValue(this.municipalAdminsList[index].municipality.country._id)
            this.municipalAdminForm.controls.municipality_id.setValue(this.municipalAdminsList[index].municipality._id)
            this.municipalAdminForm.controls.municipal_admin_type.setValue(this.municipalAdminsList[index].municipalAdminType)

            this.modalTitle = 'Edit Municipal Admin'
        } else {

            this.municipalAdminForm.controls.password.setValidators([Validators.required, Validators.minLength(6)])
            this.municipalAdminForm.controls.password.updateValueAndValidity()
            this.municipalAdminForm.controls.confirm_password.setValidators([Validators.required])
            this.municipalAdminForm.controls.confirm_password.updateValueAndValidity()
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
        if (this.municipalAdminForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.waiting.save = false
            return
        }
        const params = {
            _id: this.municipalAdminForm.value._id,
            name: this.municipalAdminForm.value.name,
            email: this.municipalAdminForm.value.email,
            phone_no: this.municipalAdminForm.value.phone_no,
            password: this.municipalAdminForm.value.password,
            confirm_password: this.municipalAdminForm.value.confirm_password,
            municipality_id: this.municipalAdminForm.value.municipality_id,
            municipal_admin_type: this.municipalAdminForm.value.municipal_admin_type

        }
        let saveUpdate = this.ds.add(params)
        if (this.municipalAdminForm.value._id !== null) {
            const param = {
                _id: this.municipalAdminForm.value._id,
                name: this.municipalAdminForm.value.name,
                email: this.municipalAdminForm.value.email,
                phone_no: this.municipalAdminForm.value.phone_no,
                municipality_id: this.municipalAdminForm.value.municipality_id,
                municipal_admin_type: this.municipalAdminForm.value.municipal_admin_type

            }
            saveUpdate = this.ds.update(param)
        }

        saveUpdate.subscribe((resp: any) => {
            this.waiting.save = false
            if (resp.success === true) {
                if (this.municipalAdminForm.value._id !== null) {
                    this.municipalAdminsList[this.selectedIndex] = resp.data
                    this.municipalAdminForm.controls._id.setValue(null)
                    this.alert.success('Municipal Admin Updated Successfully!!')
                } else {
                    this.municipalAdminForm.controls._id.setValue(resp.data._id)
                    this.municipalAdminsList.unshift(this.municipalAdminForm.value)
                    this.municipalAdminsList[0] = resp.data
                    this.alert.success('Municipal Admin Added successfully!!')
                }
            } else {
                this.alert.error(resp.message as string)
                this.waiting.save = false
                return
            }
            this.modalRef.hide()
            f.resetForm()
            this.municipalAdminForm.controls.municipal_admin_type.setValue('general')
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
        const _id = this.municipalAdminsList[this.selectedIndex]._id
        this.ds.delete({ _id }).subscribe((resp: any) => {
            if (resp.success === true) {
                this.waiting.save = false
                this.municipalAdminsList.splice(this.selectedIndex, 1)
                this.modalRef.hide()
                this.alert.success('Municipal Admin Deleted Successfully!!')
            } else {
                this.alert.error(resp.message)
            }
        })
    }

    cancelButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
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
                this.municipalAdminsList[this.selectedIndex].status = 'active'
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
                this.municipalAdminsList[this.selectedIndex].status = 'inactive'
                this.modalRef.hide()
            } else {
                this.alert.error(resp.errors?.general || '')
            }
        })
    }
}
