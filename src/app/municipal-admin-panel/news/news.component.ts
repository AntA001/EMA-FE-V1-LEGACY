import { Pagination, Resp } from 'src/app/interfaces/response'
import { ApiService } from 'src/app/services/api.service'
import { Router, ActivatedRoute } from '@angular/router'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { DataService } from './data.service'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { Component, TemplateRef, OnInit, OnDestroy } from '@angular/core'
import { News } from 'src/app/models/news'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import moment from 'moment'

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit, OnDestroy {
    dataStatus = 'fetching'
    newsList: Array<News> = []
    newsForm: FormGroup
    selectedIndex: number
    modalRef: BsModalRef
    thumbnailPicked: boolean = false
    pagination: Pagination<News>
    modalTitle = ''
    lang: any
    filters = {
        name: '',
        page: 1
    }
    breadCrum = [
        {
            link: '/municipal/news',
            value: 'News'
        }
    ]
    loaderOptions = {
        rows: 5,
        cols: 10,
        colSpans: {
            0: 1
        }
    }
    waiting: {
        search: boolean
        save: boolean
    }
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
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        public router: Router,
        private route: ActivatedRoute,
        private ms: BsModalService,
        public api: ApiService,
        private modalService: BsModalService
    ) {

        this.lang = this.api.translate('municipal-admin.news')
        this.lang.subscribe((d: any) => {
            this.lang = d
        })

        this.waiting = {
            search: false,
            save: false
        }

        this.route.queryParams.subscribe((params) => {
            if (params.page) {
                this.filters.page = params.page
            }
            if (params.title) {
                this.filters.name = params.title
            }
            if (params) {
                this.search()
            }
        })

        this.newsForm = this.fb.group({
            _id: new FormControl(null),
            image: new FormControl(null),
            titleEN: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            descriptionEN: new FormControl(null, [Validators.required]),
            titleAL: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            descriptionAL: new FormControl(null, [Validators.required])
        })

    }

    ngOnInit(): void {
        this.searchKeywordSub = this.searchKeyword$
            .pipe(debounceTime(1000), distinctUntilChanged())
            .subscribe((searchKeyword) => {
                console.log('searchKeyword')
                this.filters.page = 1
                this.search()
            })
    }

    ngOnDestroy(): void {
        console.log('ngOnDestroy')
        this.searchKeywordSub.unsubscribe()
    }

    searchKeywordChange(value: string) {
        this.searchKeyword$.next(value)
    }

    setPagination(page: number) {
        this.filters.page = page
        this.router.navigate(['/municipal/news'], { queryParams: this.filters, replaceUrl: true })
    }

    search(): void {
        this.waiting.search = true
        this.filters.name = this.searchKeyword
        // this.ds.getList(this.filters).subscribe((resp: Resp<Pagination<News>>) => {
        this.ds.getList(this.filters).subscribe((resp: Resp<Array<News>>) => {
            this.waiting.search = false
            if (resp.success === true) {
                this.newsList = resp?.data as Array<News> || []
                // this.newsList = resp.data?.data || []
                // this.pagination = resp.data as Pagination<News>
                this.dataStatus = 'done'
            }
        })
    }

    get g() {
        return this.newsForm.controls
    }

    openModal(modal: TemplateRef<any>, index: number) {
        this.selectedIndex = index
        this.modalTitle = this.lang.addNewNews
        this.ds.newsId = -1
        this.thumbnailPicked = false

        this.thumbnailImage = ''
        if (index > -1) {
            this.newsForm.controls._id.setValue(this.newsList[index]._id)
            this.newsForm.patchValue(this.newsList[index])
            this.ds.newsId = this.newsList[index]._id
            this.ds.newsUpdated = this.newsList[index].updatedAt
            this.modalTitle = this.lang.editNews
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
        if (this.newsForm.invalid) {
            this.waiting.save = false
            this.alert.error(this.lang.fillDataErrorMsg)
            return
        }
        const params = {
            _id: this.newsForm.value._id,
            titleEN: this.newsForm.value.titleEN,
            descriptionEN: this.newsForm.value.descriptionEN,
            titleAL: this.newsForm.value.titleAL,
            descriptionAL: this.newsForm.value.descriptionAL,
            image: this.thumbnailImage !== '' ? this.thumbnailImage : null
        }

        if (params.image === null && params._id === null) {
            this.waiting.save = false
            this.alert.error(this.lang.imageErrorMsg)
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

     sendCall(formData:any , f: any) {

        let saveUpdate = this.ds.add(formData)
        if (this.newsForm.value._id !== null) {
            saveUpdate = this.ds.update(formData)
        }

        saveUpdate.subscribe((resp: Resp<News>) => {
            this.waiting.save = false
            if (resp.success === true) {
                if (this.newsForm.value._id !== null) {
                    this.newsList[this.selectedIndex] = resp.data as News || []
                    this.newsForm.controls._id.setValue(null)
                    this.alert.success(this.lang.msg2)
                } else {
                    this.newsForm.value._id = resp.data?._id
                    this.newsList.unshift(resp.data as News || [])
                    this.alert.success(this.lang.msg1)
                }
            } else {
                // this.alert.error(resp.errors?.general as string)
                this.alert.error(resp.message as string)
                this.waiting.save = false
                return
            }
            this.ds.newsId = -1
            this.ds.newsUpdated = null
            this.modalRef.hide()
            f.resetForm()
            this.search()
        })
    }
    getDifference(date: any) {
        return moment(date).format('DD/MM/YYYY') + ' ' + moment(date).format('LT')
    }


    delete() {
        this.waiting.save = true

        this.ds
            .delete({ _id: this.newsList[this.selectedIndex]._id })
            .subscribe((resp: Resp<undefined>) => {
                this.waiting.save = false
                if (resp.success === false) {
                    this.alert.error(resp?.errors?.general as string)
                    this.modalRef.hide()
                    return
                }
                this.newsList.splice(this.selectedIndex, 1)
                this.modalRef.hide()
                this.alert.success(this.lang.msg3)
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
        this.thumbnailImage = ''
        f.resetForm()
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
