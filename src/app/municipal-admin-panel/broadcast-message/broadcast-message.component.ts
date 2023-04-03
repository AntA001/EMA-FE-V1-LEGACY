import { ActivatedRoute, Router } from '@angular/router'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { Subject } from 'rxjs'
import { Pagination, Resp } from 'src/app/interfaces/response'
import { DataService } from './data.service'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { BroadcastMessage } from 'src/app/models/broadcast-message'
import { Category } from 'src/app/models/category'
import moment from 'moment'
import { ApiService } from 'src/app/services/api.service'
import { TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'app-broadcast-message',
    templateUrl: './broadcast-message.component.html',
    styleUrls: ['./broadcast-message.component.css']
})
export class BroadcastMessageComponent implements OnInit, OnDestroy {
    broadcastMsgList: Array<any> = []
    detail: Array<any> = []
    categoryTypeList: Array<Category> = []
    broadcastMsgForm: FormGroup
    modalRef: BsModalRef
    selectedIndex: number
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
        cols: 7,
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
            link: '/municipal/broadcast-message',
            value: 'Broadcast Message'
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
        public ts: TranslateService,

        public api: ApiService,
        private ms: BsModalService
    ) {
        this.lang = this.api.translate('municipal-admin.broadcast-Messages')
        this.lang.subscribe((d: any) => {
            this.lang = d
        })
        this.waiting = {
            search: false,
            save: false,
            messageStatus: []
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

        this.broadcastMsgForm = this.fb.group({
            _id: new FormControl(null),
            category_id: new FormControl(''),
            title: new FormControl(null, [Validators.required]),
            message: new FormControl(null, [Validators.required]),
            notification: new FormControl(false),
            sms: new FormControl(false),
            template: new FormControl(false)
        })

        this.ds.getCategoryList().subscribe((resp: Resp<Array<Category>>) => {
            if (resp.success === true) {
                this.categoryTypeList = resp?.data as Array<Category> || []
            }
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
        this.router.navigate(['/municipal/broadcast-message'], {
            queryParams: this.filters,
            replaceUrl: true
        })
    }

    search(): void {
        this.waiting.messageStatus = []
        this.waiting.search = true
        this.filters.name = this.searchKeyword
        this.ds.getList(this.filters).subscribe((resp: Resp<Array<BroadcastMessage>>) => {
            this.waiting.search = false
            if (resp.success === true) {
                this.broadcastMsgList = resp?.data as Array<BroadcastMessage> || []
                // this.pagination = resp.data as Pagination<any>
                this.dataStatus = 'done'
            }
        })
    }


    get g() {
        return this.broadcastMsgForm.controls
    }

    openModal(modal: TemplateRef<any>, index: number) {
        this.selectedIndex = index
        this.modalTitle = this.lang.addNewBroadcast
        this.broadcastMsgForm.controls.category_id.setValue('')
        if (index > -1) {
            this.broadcastMsgForm.controls._id.setValue(this.broadcastMsgList[index]._id)
            if (this.broadcastMsgList[index].category !== null) {
                this.broadcastMsgForm.controls.category_id.setValue(this.broadcastMsgList[index].category._id)
            }
            if (this.broadcastMsgList[index].category === null) {
            this.broadcastMsgForm.controls.category_id.setValue('')
            }

            this.broadcastMsgForm.patchValue(this.broadcastMsgList[index])
            this.modalTitle = this.lang.addNewBroadcast
        }

        this.modalRef = this.ms.show(modal, {
            class: 'modal-md modal-dialog-centered back-office-panel',
            backdrop: 'static',
            ignoreBackdropClick: true,
            keyboard: false
        })
    }

    getDifference(date: any) {
        return moment(date).format('DD/MM/YYYY') + ' ' + moment(date).format('LT')
    }

    saveContact(f: any) {
        this.waiting.save = true
        if (this.broadcastMsgForm.value.sms === undefined || this.broadcastMsgForm.value.sms === null) {
            this.broadcastMsgForm.controls.sms.setValue(false)
        }
        if (this.broadcastMsgForm.value.notification === undefined || this.broadcastMsgForm.value.notification === null) {
            this.broadcastMsgForm.controls.notification.setValue(false)
        }
        if (this.broadcastMsgForm.value.template === undefined || this.broadcastMsgForm.value.template === null) {
            this.broadcastMsgForm.controls.template.setValue(false)
        }

        if (this.broadcastMsgForm.invalid) {
            this.waiting.save = false
            this.alert.error('Please fill-in valid data in all fields & try again.')
            return
        }

        this.ds.add(this.broadcastMsgForm.value).subscribe((resp: Resp<BroadcastMessage>) => {
            this.waiting.save = false
            if (resp.success === true) {
                this.broadcastMsgList.unshift(resp.data as BroadcastMessage || [])
                this.alert.success('Broadcast Message Send successfully!!')
            } else {
                // this.alert.error(resp.errors?.general as string)
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
        const _id = this.broadcastMsgList[this.selectedIndex]._id
        this.ds.delete({ _id }).subscribe((resp: any) => {
            if (resp.success === true) {
                this.waiting.save = false
                this.broadcastMsgList.splice(this.selectedIndex, 1)
                this.modalRef.hide()
                this.alert.success('Broadcast Message Deleted Successfully!!')
            } else {
                this.alert.error(resp.message)
            }
        })
    }

    cancelButton(f: any) {
        f.resetForm()
        this.modalRef.hide()
    }

}
