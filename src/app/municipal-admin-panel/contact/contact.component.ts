import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { Pagination } from './../../interfaces/response'
import { DataService } from './data.service'
import { Component, TemplateRef, OnDestroy, OnInit } from '@angular/core'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { ActivatedRoute, Router } from '@angular/router'
import { ApiService } from 'src/app/services/api.service'
import { Resp } from 'src/app/interfaces/response'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { Contact } from 'src/app/models/contact'
import { Subject } from 'rxjs'
@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {
    contactList: Array<any> = []
    detail: Array<any> = []
    contactForm: FormGroup
    modalRef: BsModalRef
    thumbnailPicked: boolean = false
    selectedIndex: number
    selectedId: string
    dataStatus = 'fetching'
    pagination: Pagination<any>
    sourceElementIndex: any
    destElementIndex: any
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
            link: '/municipal/emergency-contact',
            value: 'Emergency Contact'
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
        private ms: BsModalService,
        private modalService: BsModalService
    ) {
        this.waiting = {
            search: false,
            save: false,
            messageStatus: []
        }


        this.lang = this.api.translate('municipal-admin.emergenacy-Contacts')
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
            contact: new FormControl(null, [Validators.required])
        })
    }

    ngOnInit(): void {


        this.searchKeywordSub = this.searchKeyword$
            .pipe(debounceTime(1000), distinctUntilChanged())
            .subscribe((searchKeyword) => {
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
        this.router.navigate(['/municipal/emergency-contact'], {
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
        this.modalTitle = this.lang.addNewEmergency
        this.ds.contactId = -1
        this.thumbnailImage = ''
        this.thumbnailPicked = false
        if (id != -1) {
            const index = this.contactList.findIndex((item: any) => item._id === this.selectedId)
            console.log('ind',index)
            this.contactForm.controls._id.setValue(this.contactList[index]._id)
            this.contactForm.patchValue(this.contactList[index])
            this.ds.contactId = this.contactList[index]._id
            this.ds.contactUpdated = this.contactList[index].updatedAt
            this.modalTitle = this.lang.editEmergencyContact
        }
       /* this.selectedIndex = index
        this.modalTitle = this.lang.addNewEmergency
        this.ds.contactId = -1
        this.thumbnailImage = ''
        this.thumbnailPicked = false
        if (index > -1) {
            this.contactForm.controls._id.setValue(this.contactList[index]._id)
            this.contactForm.patchValue(this.contactList[index])
            this.ds.contactId = this.contactList[index]._id
            this.ds.contactUpdated = this.contactList[index].updatedAt
            this.modalTitle = this.lang.editEmergencyContact
        }*/

        this.modalRef = this.ms.show(modal, {
            class: 'modal-md modal-dialog-centered back-office-panel',
            backdrop: 'static',
            ignoreBackdropClick: true,
            keyboard: false
        })
    }

    returnUpdatedList(data: any) {
        this.contactList = data
        const params = {
            oldIndex: this.sourceElementIndex,
            newIndex: this.destElementIndex

        }
        this.ds.saveContactOrder(params).subscribe((resp: any) => {
            this.alert.success(resp.message)
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
            image: this.thumbnailImage !== '' ? this.thumbnailImage : null
        }

        if (params.image === null && params._id === null) {
            this.waiting.save = false
            this.alert.error('Please select image for emergency contact.')
            return
        }
        const requiredPromises: Array<any> = []
        const data = f.value
        // if(this.dataForm.value._id === null) {
        // delete data._id
        // }
        const formData = this.api.jsonToFormData(data)

        const thumbnailPromise = fetch(this.thumbnailImage)
            .then(res => res.blob())
            .then(blob => {
                const imageFile = new File([blob], 'image', { type: 'image/png' })
               if (this.thumbnailPicked) {
                formData.append('image', imageFile)
}
            })
        requiredPromises.push(thumbnailPromise)
        Promise.all(requiredPromises)
            .then(_ => this.sendCall(formData, f))
        }

        sendCall(formData: any, f: any) {

        let saveUpdate = this.ds.add(formData)
        if (this.contactForm.value._id !== null) {
            saveUpdate = this.ds.update(formData)
        }

        saveUpdate.subscribe((resp: Resp<Contact>) => {
            this.waiting.save = false
            if (resp.success === true) {
                if (this.contactForm.value._id !== null) {
                    this.contactList[this.selectedIndex] = resp.data as Contact || []
                    this.contactForm.controls._id.setValue(null)
                    this.alert.success('Emergency Contact Updated Successfully!!')
                } else {
                    this.contactForm.value._id = resp.data?._id
                    this.contactList.unshift(resp.data as Contact || [])
                    this.alert.success('Emergency Contact Added successfully!!')
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
            this.search()
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
        console.log('ind', index)
        const _id = this.selectedId
        this.ds.delete( { _id } ).subscribe((resp: any) => {
            if (resp.success === true) {
                this.waiting.save = false
                this.contactList.splice(index, 1)
                this.modalRef.hide()
                this.alert.success('Contact Deleted Successfully!!')
            } else {
                this.alert.error(resp.message)
            }
        })
       /*const _id = this.contactList[this.selectedIndex]._id
        this.ds.delete({ _id }).subscribe((resp: any) => {
            if (resp.success === true) {
                this.waiting.save = false
                this.contactList.splice(this.selectedIndex, 1)
                this.modalRef.hide()
                this.alert.success('Contact Deleted Successfully!!')
            } else {
                this.alert.error(resp.message)
            }
        })*/
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
        this.thumbnailPicked = true
        this.thumbnailModalRef.hide()
    }

    modalOpen(contentRef: TemplateRef<any>) {
        this.thumbnailModalRef = this.modalService.show(contentRef, {
            class: 'modal-md modal-dialog-centered website'
        })
    }
}
