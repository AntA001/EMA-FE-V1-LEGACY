import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { UIHelpers } from '../../helpers/ui-helpers'
import { Component, TemplateRef } from '@angular/core'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { BsModalService } from 'ngx-bootstrap/modal'
import { DataService } from './data.service'
import { Router, ActivatedRoute } from '@angular/router'
import { Pagination, Resp } from 'src/app/interfaces/response'
import { User } from 'src/app/models/user'
@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent {
    dataStatus = 'fetching'
    usersList: Array<User> = []
    userForm: FormGroup
    selectedIndex: number
    modalRef: BsModalRef
    pagination: Pagination<User>
    filters = {
        name: '',
        page: 1,
        perPage: 10,
        userType: ''
    }

    loaderOptions = {
        rows: 5,
        cols: 6,
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
            link: '/admin/users',
            value: 'Users'
        }
    ]

    constructor(
        private ds: DataService,
        private fb: FormBuilder,
        public ui: UIHelpers,
        private alert: IAlertService,
        public router: Router,
        private route: ActivatedRoute,
        private ms: BsModalService
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

        this.userForm = this.fb.group({
            id: new FormControl(null),
            status: new FormControl(null),
            firstName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            lastName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            email: new FormControl(null, [Validators.required, Validators.email]),
            userType: new FormControl(null, [Validators.required]),
            contactOne: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
            contactTwo: new FormControl(null, [Validators.maxLength(15)]),
            address: new FormControl(null, [Validators.maxLength(255)])
        })
    }

    setPagination(page: number) {
        this.filters.page = page
        this.router.navigate(['/admin/users'], { queryParams: this.filters, replaceUrl: true })
    }

    search(): void {
        this.waiting.userStatus = []
        this.waiting.search = true

        this.ds.getList(this.filters).subscribe((resp: Resp<Pagination<User>>) => {
            this.waiting.search = false
            if (resp.success === true) {
                this.usersList = resp.data?.data || []
                this.usersList.forEach((element) => {
                    this.waiting.userStatus.push(false)
                })
                this.pagination = resp.data as Pagination<User>
                this.dataStatus = 'done'
            }
        })
    }

    get g() {
        return this.userForm.controls
    }

    openModal(modal: TemplateRef<any>, index: number) {
        this.selectedIndex = index
        if (index > -1) {
            const userType = this.usersList[index].userType
            this.userForm.patchValue(this.usersList[index])
            this.userForm.patchValue(this.usersList[index][userType])
        }

        this.modalRef = this.ms.show(modal, {
            class: 'modal-lg modal-dialog-centered back-office-panel',
            backdrop: 'static',
            ignoreBackdropClick: true,
            keyboard: false
        })
    }

    save(f: any) {
        this.waiting.save = true
        if (this.userForm.status === 'INVALID') {
            this.alert.error('Please fill-in valid data in all fields & try again.')
            this.waiting.save = false
            return
        }

        const data: User = this.userForm.getRawValue()
        this.ds.update(this.userForm.value).subscribe((resp: any) => {
            this.waiting.save = false
            if (resp.success === false) {
                this.alert.error(resp.errors.general)
                return
            }

            this.usersList[this.selectedIndex] = data
            this.usersList[this.selectedIndex][data.userType] = data
            this.userForm.controls.id.setValue(null)
            this.alert.success('Changes done successfully!!')

            this.modalRef.hide()
            f.resetForm()
        })
    }

    delete() {
        this.waiting.save = true
        this.ds.delete({ id: this.usersList[this.selectedIndex].id })
            .subscribe((resp: Resp<undefined>) => {
                this.waiting.save = false
                if (resp.success === false) {
                    this.alert.error(resp?.errors?.general as string)
                    this.modalRef.hide()

                    return
                }
                this.usersList.splice(this.selectedIndex, 1)
                this.modalRef.hide()
                this.alert.success('User deleted successfully!!')
            })
    }

    activeUser(index: number) {
        this.waiting.userStatus[index] = true
        const param = { id: this.usersList[index].id }

        this.ds.activeUser(param).subscribe((resp: Resp) => {
            this.waiting.userStatus[index] = false
            if (resp.success === true) {
                this.alert.success('user active successfully')
                this.usersList[index].status = 'active'
            } else {
                this.alert.error(resp.errors?.general || '')
            }
        })
    }

    inactiveUser(index: number) {
        this.waiting.userStatus[index] = true
        const param = { id: this.usersList[index].id }

        this.ds.inactiveUser(param).subscribe((resp: any) => {
            this.waiting.userStatus[index] = false
            if (resp.success === true) {
                this.usersList[index].status = 'inactive'
                this.alert.success('user deactive successfully')
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
        f.resetForm()
        this.modalRef.hide()
    }
}
