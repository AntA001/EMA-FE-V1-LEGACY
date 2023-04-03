import { Component, OnInit, TemplateRef } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { DataService } from '../data.service'
import { ActivatedRoute, Router } from '@angular/router'
import { Pagination, Resp } from 'src/app/interfaces/response'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { ApiService } from 'src/app/services/api.service'
import { GuideArticle } from 'src/app/models/guide-article'
import { QuillEditorComponent } from 'ngx-quill'

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.css']
})
export class AddNewsComponent implements OnInit {
    mobile: any = ''
    editor: QuillEditorComponent
    editorConfig: { }
    spinnerSVG = '/assets/images/rolling.svg'
    thumbnailModalRef: BsModalRef
    thmbnailChangedEvent: any
    croppedThumbnail: any
    thumbnailImage: string = ''
    breadName = 'Add'
    profileImage: any
    newsForm: FormGroup
    newsDetail: any = []
    loginLoading = false
    breadCrum = [
        {
            link: '/municipal/news/list',
            params: { },
            value: 'News List'
        }
    ]
    waiting: {
        save: boolean
    }
    modalRef: any
    loadingStatus: boolean = false
    constructor(
        private modalService: BsModalService,
        public ds: DataService,
        public api: ApiService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        private route: ActivatedRoute,
        public router: Router
    ) {
        if (this.route.snapshot.queryParams.hasOwnProperty('id')) {
            this.ds.newsId = '' + route.snapshot.queryParams.id
            if (this.ds.newsId !== '') {
                this.getDetail()
                this.breadName = 'Edit'
            } else {
                this.breadName = 'Add'
            }
        } else {
            // code here
        }

        this.breadCrum.push({
            link: '/municipal/news/add',
            params: { id: this.ds.newsId },
            value: this.breadName
        })


        this.waiting = {
            save: false
        }

        this.newsForm = this.fb.group({
            _id: new FormControl(null),
            image: new FormControl(null),
            titleEN: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            descriptionEN: new FormControl(null, [Validators.required]),
            titleAL: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            descriptionAL: new FormControl(null, [Validators.required])

        })
    }

    ngOnInit() {
        this.profileImage = this.ds.newsImageUrl(this.ds.newsId)
    }
    getDetail() {
        this.loadingStatus = true
        const params = {
            id: this.ds.newsId
        }

        this.ds.getNews(params).subscribe((resp: any) => {
            if (resp.success) {
                this.loadingStatus = false
                this.newsDetail = resp.data
                this.newsForm.patchValue(resp.data)
            } else {
                this.alert.error(resp.errors.general)
            }
        })
    }

    get g() {
        return this.newsForm.controls
    }

    cancel() {
        this.router.navigate(['municipal/news/list'])
    }

    save(f: any) {
        this.waiting.save = true
        if (this.newsForm.invalid) {
            this.waiting.save = false
            this.alert.error('Please fill-in valid data in all fields & try again.')
            return
        }

        const params: any = {
            _id: this.newsForm.value._id,
            titleEN: this.newsForm.value.titleEN,
            descriptionEN: this.newsForm.value.descriptionEN,
            titleAL: this.newsForm.value.titleAL,
            descriptionAL: this.newsForm.value.descriptionAL,
            image: this.thumbnailImage !== '' ? this.thumbnailImage : null
        }

        if (params.image === null && params._id === null) {
            this.waiting.save = false
            this.alert.error('Please select image for News.')
            return
        }

        let saveUpdate = this.ds.add(params)
        if (this.newsForm.value._id !== null) {
            saveUpdate = this.ds.update(params)
        }

        saveUpdate.subscribe((resp: Resp<GuideArticle>) => {
            this.waiting.save = false

                if (resp.success === true) {
                    this.loginLoading = false
                    if (this.newsForm.value._id !== null) {
                        this.alert.success('News Updated Successfully!!')
                    } else {
                        this.alert.success('News  Added Successfully!!')
                        this.thumbnailImage = ''
                    }
                    this.router.navigateByUrl('/municipal/news/list')
                    this.thumbnailImage = ''
                } else {
                    this.loginLoading = false
                    this.alert.error(resp.errors?.general as string)
                }
            })
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
        this.thumbnailModalRef.hide()
    }

    modalOpen(contentRef: TemplateRef<any>) {
        this.thumbnailModalRef = this.modalService.show(contentRef, {
            class: 'modal-md modal-dialog-centered website'
        })
    }

}
