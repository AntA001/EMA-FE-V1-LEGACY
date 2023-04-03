import { Pagination, Resp } from 'src/app/interfaces/response'
import { ApiService } from 'src/app/services/api.service'
import { Router, ActivatedRoute } from '@angular/router'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { DataService } from '../data.service'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { Component, TemplateRef, OnInit, OnDestroy } from '@angular/core'
import { News } from 'src/app/models/news'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { GuideArticle } from 'src/app/models/guide-article'
import { QuillEditorComponent } from 'ngx-quill'
@Component({
  selector: 'app-guides-list',
  templateUrl: './guides-list.component.html',
  styleUrls: ['./guides-list.component.css']
})
export class GuidesListComponent implements OnInit, OnDestroy {
    dataStatus = 'fetching'
    editor: QuillEditorComponent
    editorConfig: { }

    guideArticleList: Array<GuideArticle> = []
    guideArticleForm: FormGroup
    selectedIndex: number
    selectedStatus: string
    selectedId: any
    modalRef: BsModalRef
    pagination: Pagination<News>
    modalTitle = ''
    filters = {
        name: '',
        page: 1
    }
    breadCrum = [
        {
            link: '/admin/guide-articles/list',
            value: 'Guide Article'
        }
    ]
    loaderOptions = {
        rows: 5,
        cols: 8,
        colSpans: {
            0: 1
        }
    }
    waiting: {
        search: boolean
        save: boolean,
        userStatus: Array<any>
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

        this.waiting = {
            search: false,
            save: false,
            userStatus: []

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

        this.guideArticleForm = this.fb.group({
            _id: new FormControl(null),
            image: new FormControl(null),
            titleEN: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            descriptionEN: new FormControl(null, [Validators.required]),
            titleAL: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            descriptionAL: new FormControl(null, [Validators.required]),
            article: new FormControl(null, [Validators.required])

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
        this.router.navigate(['/admin/guide-article'], { queryParams: this.filters, replaceUrl: true })
    }

    addGuides(id: string) {
        this.router.navigateByUrl(`/admin/guide-articles/add?id=${id}`)
    }


    editGuide(id: string) {
        this.selectedId = id
        this.router.navigate(['admin/guide-articles/add'], { queryParams: { id: this.selectedId } })
    }


    search(): void {
        this.waiting.search = true
        this.filters.name = this.searchKeyword
        // this.ds.getList(this.filters).subscribe((resp: Resp<Pagination<News>>) => {
        this.ds.getList(this.filters).subscribe((resp: Resp<Array<GuideArticle>>) => {
            this.waiting.search = false
            if (resp.success === true) {
                this.guideArticleList = resp?.data as Array<GuideArticle> || []
                // this.guideArticleList = resp.data?.data || []
                // this.pagination = resp.data as Pagination<GuideArticle>
                this.dataStatus = 'done'
            }
        })
    }

    get g() {
        return this.guideArticleForm.controls
    }

    // openModal(modal: TemplateRef<any>, index: number) {
    //     this.selectedIndex = index
    //     this.modalTitle = 'Add New Guide Article'
    //     this.ds.guideId = '-1'
    //     this.thumbnailImage = ''
    //     if (index > -1) {
    //         this.guideArticleForm.controls._id.setValue(this.guideArticleList[index]._id)
    //         this.guideArticleForm.controls.article.setValue(this.guideArticleList[index].article)
    //         this.guideArticleForm.patchValue(this.guideArticleList[index])
    //         this.ds.guideId = this.guideArticleList[index]._id
    //         this.ds.newsUpdated = this.guideArticleList[index].updatedAt
    //         this.modalTitle = 'Edit Guide Article'
    //     }

    //     this.modalRef = this.ms.show(modal, {
    //         class: 'modal-lg modal-dialog-centered back-office-panel',
    //         backdrop: 'static',
    //         ignoreBackdropClick: true,
    //         keyboard: false
    //     })
    // }

    // function getDimensions(inputWidth, inputHeight, maxWidth, maxHeight) {
    //     if (inputWidth < maxWidth && inputHeight < maxHeight) {
    //       return [inputWidth, inputHeight];
    //     }
    //     if (inputWidth > maxWidth) {
    //       const newWidth = maxWidth;
    //       const newHeight = Math.floor((inputHeight / inputWidth) * newWidth);

    //       if (newHeight > maxHeight) {
    //           const newHeight = maxHeight;
    //           const newWidth = Math.floor((inputWidth / inputHeight) * newHeight);
    //           return [newWidth, newHeight];
    //       }
    //       else {
    //           return [newWidth, newHeight];
    //       }
    //     }
    //     if (inputHeight > maxHeight) {
    //       const newHeight = maxHeight;
    //       const newWidth = Math.floor((inputWidth / inputHeight) * newHeight);
    //       return [newWidth, newHeight];
    //     }
    //   }


    save(f: any) {
        this.waiting.save = true
        if (this.guideArticleForm.invalid) {
            this.waiting.save = false
            this.alert.error('Please fill-in valid data in all fields & try again.')
            return
        }

        const params: any = {
            _id: this.guideArticleForm.value._id,
            titleEN: this.guideArticleForm.value.titleEN,
            descriptionEN: this.guideArticleForm.value.descriptionEN,
            titleAL: this.guideArticleForm.value.titleAL,
            descriptionAL: this.guideArticleForm.value.descriptionAL,
            article: this.guideArticleForm.value.article,
            image: this.thumbnailImage !== '' ? this.thumbnailImage : null
        }

        if (params.image === null && params._id === null) {
            this.waiting.save = false
            this.alert.error('Please select image for Guide Article.')
            return
        }

        let saveUpdate = this.ds.add(params)
        if (this.guideArticleForm.value._id !== null) {
            saveUpdate = this.ds.update(params)
        }

        saveUpdate.subscribe((resp: Resp<GuideArticle>) => {
            this.waiting.save = false
            if (resp.success === true) {
                if (this.guideArticleForm.value._id !== null) {
                    this.guideArticleList[this.selectedIndex] = resp.data as GuideArticle || []
                    this.guideArticleForm.controls._id.setValue(null)
                    this.alert.success('Guide Article Updated Successfully!!')
                } else {
                    this.guideArticleForm.value._id = resp.data?._id
                    this.guideArticleList.unshift(resp.data as GuideArticle || [])
                    this.alert.success('Guide Article Added Successfully!!')
                }
            } else {
                // this.alert.error(resp.errors?.general as string)
                this.alert.error(resp.message as string)
                this.waiting.save = false
                return
            }
            // this.ds.guideId = -1
            this.ds.newsUpdated = null
            this.modalRef.hide()
            f.resetForm()
        })
    }

    delete() {
        this.waiting.save = true

        this.ds
            .delete({ _id: this.guideArticleList[this.selectedIndex]._id })
            .subscribe((resp: Resp<undefined>) => {
                this.waiting.save = false
                if (resp.success === false) {
                    this.alert.error(resp?.errors?.general as string)
                    this.modalRef.hide()
                    return
                }
                this.guideArticleList.splice(this.selectedIndex, 1)
                this.modalRef.hide()
                this.alert.success('Guide Article Deleted Successfully!!')
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
                this.guideArticleList[this.selectedIndex].status = 'active'
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
    this.guideArticleList[this.selectedIndex].status = 'inactive'
                this.modalRef.hide()
            } else {
                this.alert.error(resp.errors?.general || '')
            }
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
        this.guideArticleForm.value.image = this.thumbnailImage
        this.thumbnailModalRef.hide()
    }

    modalOpen(contentRef: TemplateRef<any>) {
        this.thumbnailModalRef = this.modalService.show(contentRef, {
            class: 'modal-md modal-dialog-centered website'
        })
    }
}
