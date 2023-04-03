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
    selector: 'app-add-guide',
    templateUrl: './add-guide.component.html',
    styleUrls: ['./add-guide.component.css']
})
export class AddGuideComponent implements OnInit {
    mobile: any = ''
    editor: QuillEditorComponent
    editorConfig: {}
    spinnerSVG = '/assets/images/rolling.svg'
    thumbnailModalRef: BsModalRef
    thmbnailChangedEvent: any
    croppedThumbnail: any
    thumbnailPicked: boolean = false
    thumbnailImage: string = ''
    breadName = 'Add'
    profileImage: any
    guideArticleForm: FormGroup
    guideArticleDetail: any = []
    loginLoading = false
    breadCrum = [
        {
            link: '/admin/guide-articles/list',
            params: {},
            value: 'Guides Article List'
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
            this.ds.guideId = '' + route.snapshot.queryParams.id
            if (this.ds.guideId !== '') {
                this.getDetail()
                this.breadName = 'Edit'
            } else {
                this.breadName = 'Add'
            }
        } else {
            // code here
        }

        this.breadCrum.push({
            link: '/admin/guide-articles/add',
            params: { id: this.ds.guideId },
            value: this.breadName
        })


        this.waiting = {
            save: false
        }

        this.guideArticleForm = this.fb.group({
            _id: new FormControl(null),
            image: new FormControl(null),
            titleEN: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            descriptionEN: new FormControl(null, [Validators.required]),
            titleAL: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            descriptionAL: new FormControl(null, [Validators.required]),
            titleEL: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            descriptionEL: new FormControl(null, [Validators.required]),
            titleMK: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            descriptionMK: new FormControl(null, [Validators.required]),
            titleBG: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            descriptionBG: new FormControl(null, [Validators.required]),
            articleEN: new FormControl(null, [Validators.required]),
            articleAL: new FormControl(null, [Validators.required]),
            articleEL: new FormControl(null, [Validators.required]),
            articleMK: new FormControl(null, [Validators.required]),
            articleBG: new FormControl(null, [Validators.required])


        })
    }

    ngOnInit() {
        this.profileImage = this.ds.guideImageUrl(this.ds.guideId)
    }
    getDetail() {
        this.loadingStatus = true
        const params = {
            id: this.ds.guideId
        }

        this.ds.getGuide(params).subscribe((resp: any) => {
            if (resp.success) {
                this.loadingStatus = false
                this.guideArticleDetail = resp.data
                this.guideArticleForm.patchValue(resp.data)
                this.ds.newsUpdated = resp.data.updatedAt
            } else {
                this.alert.error(resp.errors.general)
            }
        })
    }

    get g() {
        return this.guideArticleForm.controls
    }

    cancel() {
        this.router.navigate(['admin/guide-articles/list'])
    }

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
            titleEL: this.guideArticleForm.value.titleEL,
            titleMK: this.guideArticleForm.value.titleMK,
            titleBG: this.guideArticleForm.value.titleBG,
            descriptionAL: this.guideArticleForm.value.descriptionAL,
            descriptionEL: this.guideArticleForm.value.descriptionEL,
            descriptionMK: this.guideArticleForm.value.descriptionMK,
            descriptionBG: this.guideArticleForm.value.descriptionBG,
            articleEN: this.guideArticleForm.value.articleEN,
            articleAL: this.guideArticleForm.value.articleAL,
            articleEL: this.guideArticleForm.value.articleEL,
            articleMK: this.guideArticleForm.value.articleMK,
            articleBG: this.guideArticleForm.value.articleBG,
            image: this.thumbnailImage !== '' ? this.thumbnailImage : null
        }

        if (params.image === null && params._id === null) {
            this.waiting.save = false
            this.alert.error('Please select image for Guide Article.')
            return
        }

        const requiredPromises: Array<any> = []
        const data = f.value
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

    sendCall(formData: any, f: any): void {
        let saveUpdate = this.ds.add(formData)
        if (this.guideArticleForm.value._id !== null) {
            saveUpdate = this.ds.update(formData)
        }

        saveUpdate.subscribe((resp: Resp<GuideArticle>) => {
            this.waiting.save = false

            if (resp.success === true) {
                this.loginLoading = false
                if (this.guideArticleForm.value._id !== null) {
                    this.alert.success('Guide Article Updated Successfully!!')
                } else {
                    this.alert.success('Guide Article  Added Successfully!!')
                    this.thumbnailImage = ''
                }
                this.router.navigateByUrl('/admin/guide-articles/list')
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
        this.thumbnailPicked = true
        this.thumbnailModalRef.hide()
    }

    modalOpen(contentRef: TemplateRef<any>) {
        this.thumbnailModalRef = this.modalService.show(contentRef, {
            class: 'modal-md modal-dialog-centered website'
        })
    }

}
