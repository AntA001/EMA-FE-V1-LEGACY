import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { Component, OnInit, TemplateRef } from '@angular/core'
import { ApiService } from 'src/app/services/api.service'
import { DataService } from './data.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { ActivatedRoute } from '@angular/router'
import { Router } from '@angular/router'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Resp } from 'src/app/interfaces/response'
import { Instructor } from 'src/app/models/instructor'

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
    breadCrum = [
        {
            link: '/instructor/edit-user',
            value: 'Edit Profile'
        }
    ]
    spinnerSVG = '/assets/images/rolling.svg'
    userForm: FormGroup
    profileImage: string
    user: any
    userDetail: any
    inprogress: boolean = false
    thumbnailModalRef: BsModalRef
    thmbnailChangedEvent: any
    croppedThumbnail: any
    thumbnailImage: string = ''

    constructor(
        public ds: DataService,
        private alert: IAlertService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private activeRoute: ActivatedRoute,
        private router: Router,
        public api: ApiService,
        private modalService: BsModalService
    ) {
        this.userForm = this.fb.group({
            image: new FormControl(null),
            id: new FormControl(null),
            firstName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            lastName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            middleName: new FormControl(null),
            mobileNumber: new FormControl(null, [Validators.required])
        })
    }

    ngOnInit(): void {
        this.user = JSON.parse(localStorage.getItem('user') as string)

        this.profileImage = this.api.userProfileImageUrl(this.user.instructor.id)

        const param = {
            id: this.user.instructor.id
        }
        this.ds.getUserDetail(param).subscribe((response: Resp<any>) => {
            if (response.success === false) {
            } else {
                this.userDetail = response.data
                this.userForm.patchValue(this.userDetail)
                // this.userForm.patchValue(this.userDetail.customer)
            }
        })
    }
    get g() {
        return this.userForm.controls
    }

    userUpdation(data: any): void {
        if (data.status === 'INVALID') {
            this.alert.error('Please fill out valid data in all fields and try again')
            return
        }
        this.inprogress = true

        const requiredPromises: Array<any> = []
        const formData = this.api.jsonToFormData(data.value)
        if (this.thumbnailImage) {
            const thumbnailPromise = fetch(this.thumbnailImage)
                .then((res) => res.blob())
                .then((blob) => {
                    const imageFile = new Blob([blob]) // for microsoft edge support
                    formData.append('image', imageFile)
                })
            requiredPromises.push(thumbnailPromise)
            Promise.all(requiredPromises).then((_) => this.sendCall(formData))
        } else {
            this.sendCall(formData)
        }
    }

    sendCall(formData: FormData): void {
        this.ds.updateUserDetail(formData).subscribe((response: Resp<Instructor>) => {
            this.inprogress = false
            if (response.success === false) {
                this.alert.error(response.errors?.general as string)
                return
            }
            const user = localStorage.getItem('user') as string
            const data = JSON.parse(user)
            data.instructor = response.data as Instructor
            localStorage.removeItem('user')
            localStorage.setItem('user', JSON.stringify(data))
            this.thumbnailImage = ''
            this.router.navigate(['/instructor/dashboard'])
            this.alert.success('Profile Updated Successfully!!')
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
            class: 'modal-md modal-dialog-centered back-office-panel'
        })
    }
}
