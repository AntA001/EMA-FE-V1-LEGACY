import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { Pagination } from '../../interfaces/response'
import { DataService } from './data.service'
import { Component, TemplateRef, OnDestroy, OnInit } from '@angular/core'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { ActivatedRoute, Router } from '@angular/router'
import { ApiService } from 'src/app/services/api.service'
import { Resp } from 'src/app/interfaces/response'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { Subject } from 'rxjs'
import { UsefulContact } from 'src/app/models/useful-contact'
import { TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'app-useful-contact',
    templateUrl: './useful-contact.component.html',
    styleUrls: ['./useful-contact.component.css']
})
export class UsefulContactComponent implements OnInit, OnDestroy {
    contactList: Array<any> = []
    categoriesList : any = []
    detail: Array<any> = []
    contactForm: FormGroup
    modalRef: BsModalRef
    selectedIndex: number
    selectedId: string
    dataStatus = 'fetching'
    pagination: Pagination<any>
    modalTitle = ''
    lang: any
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
        messageStatus: Array<any>
    }
    breadCrum = [
        {
            link: '/municipal/useful-contact',
            value: 'Useful Contact'
        }
    ]
    searchKeyword = ''
    searchKeyword$: Subject<string> = new Subject<string>()
    searchKeywordSub: any

    spinnerSVG = '/assets/images/rolling.svg'
    thumbnailModalRef: BsModalRef
    thmbnailChangedEvent: any
    croppedThumbnail: any
    thumbnailImage: string = ''

    constructor(
        public ds: DataService,
        private alert: IAlertService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private route: ActivatedRoute,
        private router: Router,
        public api: ApiService,
        public ts: TranslateService,
        private ms: BsModalService,
        private modalService: BsModalService
    ) {
        this.waiting = {
            search: false,
            save: false,
            messageStatus: []
        }

        this.lang = this.api.translate('municipal-admin.useful-Contacts')
        this.lang.subscribe((d: any) => {
            this.lang = d
        })

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

        this.contactForm = this.fb.group({
            _id: new FormControl(null),
            image: new FormControl(null),
            titleEN: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
            titleAL: new FormControl(null, [Validators.required, Validators.maxLength(30)]),
            contact: new FormControl(null, [Validators.required]),
            categoryId: new FormControl('', [Validators.required])

        })
    }

    ngOnInit(): void {
        this.searchKeywordSub = this.searchKeyword$
            .pipe(debounceTime(1000), distinctUntilChanged())
            .subscribe((searchKeyword) => {
                this.filters.page = 1
                this.search()
            })

            this.ds.getListCategories().subscribe((resp) => {
                if (resp.success) {
                    this.categoriesList = resp.data
                }

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
        this.router.navigate(['/municipal/useful-contact'], {
            queryParams: this.filters,
            replaceUrl: true
        })
    }

    search(): void {
        this.waiting.messageStatus = []
        this.waiting.search = true
        this.filters.name = this.searchKeyword
        this.ds.getList(this.filters).subscribe((resp) => {
            this.waiting.search = false
            if (resp.success === true) {
                this.contactList = resp.data// ?.data as Array<Contact> || []
                this.pagination = resp.data as Pagination<any>
                this.dataStatus = 'done'
            }
        })
    }


    get g() {
        return this.contactForm.controls
    }

    addContactModal(modal: TemplateRef<any>, id: any) {
        this.selectedId = id
        this.modalTitle = this.lang.addNewUseful
        this.ds.contactId = -1
        this.contactForm.controls.categoryId.setValue('')
        this.thumbnailImage = ''
        if (id !== -1) {
            const index = this.contactList.findIndex((item: any) => item._id === this.selectedId)
            this.contactForm.controls._id.setValue(this.contactList[index]._id)
            this.contactForm.patchValue(this.contactList[index])
            this.contactForm.controls.categoryId.setValue(this.contactList[index].category._id)
            this.ds.contactId = this.contactList[index]._id
            this.ds.contactUpdated = this.contactList[index].updatedAt
            this.modalTitle = this.lang.editUseful
        }

        this.modalRef = this.ms.show(modal, {
            class: 'modal-md modal-dialog-centered back-office-panel',
            backdrop: 'static',
            ignoreBackdropClick: true,
            keyboard: false
        })
    }

    saveContact(f: any) {
        this.waiting.save = true
        if (this.contactForm.invalid) {
            this.waiting.save = false
            this.alert.error('Please fill-in valid data in all fields & try again.')
            return
        }

        const params = {
            _id: this.contactForm.value._id,
            titleEN: this.contactForm.value.titleEN,
            titleAL: this.contactForm.value.titleAL,
            contact: this.contactForm.value.contact,
            categoryId: this.contactForm.value.categoryId

            // image: this.thumbnailImage !== '' ? this.thumbnailImage : null
        }

        // if (params.image === null && params._id === null) {
        //     this.waiting.save = false
        //     this.alert.error('Please select image for emergency contact.')
        //     return
        // }

        let saveUpdate = this.ds.add(params)
        if (this.contactForm.value._id !== null) {
            saveUpdate = this.ds.update(params)
        }

        saveUpdate.subscribe((resp: Resp<UsefulContact>) => {
            this.waiting.save = false
            if (resp.success === true) {
                if (this.contactForm.value._id !== null) {
                    this.contactList[this.selectedIndex] = resp.data as UsefulContact || []
                    this.contactForm.controls._id.setValue(null)
                    this.alert.success('Useful Contact Updated Successfully!!')
                } else {
                    this.contactForm.value._id = resp.data?._id
                    this.contactList.unshift(resp.data as UsefulContact || [])
                    this.alert.success('Useful Contact Added successfully!!')
                }
            } else {
                // this.alert.error(resp.errors?.general as string)
                this.alert.error(resp.message as string)
                this.waiting.save = false
                return
            }
            this.ds.contactId = -1
            this.ds.contactUpdated = null
            this.modalRef.hide()
            f.resetForm()
        })
    }

    confirmDelModal(template: TemplateRef<any>, id: string) {
        this.selectedId = id
        this.modalRef = this.ms.show(template, {
            class: 'modal-sm modal-dialog-centered back-office-panel'
        })
    }

    delete() {
        this.waiting.save = true
        const index = this.contactList.findIndex((item: any) => item._id === this.selectedId)
        const _id = this.contactList[index]._id
        this.ds.delete({ _id }).subscribe((resp: any) => {
            if (resp.success === true) {
                this.waiting.save = false
                this.contactList.splice(index, 1)
                this.modalRef.hide()
                this.alert.success('Useful Contact Deleted Successfully!!')
            } else {
                this.alert.error(resp.message)
            }
        })
    }

    cancelButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
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
        this.contactForm.value.image = this.thumbnailImage
        this.thumbnailModalRef.hide()
    }

    modalOpen(contentRef: TemplateRef<any>) {
        this.thumbnailModalRef = this.modalService.show(contentRef, {
            class: 'modal-md modal-dialog-centered website'
        })
    }
}
