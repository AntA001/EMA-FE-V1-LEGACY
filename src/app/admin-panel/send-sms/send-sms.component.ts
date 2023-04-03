import { IAlertService } from '../../libs/ialert/ialerts.service'
import { ApiService } from '../../services/api.service'
import { Component, OnInit, ViewChild } from '@angular/core'
import { DataService } from './data.service'
import { ConstantsService } from 'src/app/services/constants.service'
import { Resp } from 'src/app/interfaces/response'
import { Student } from 'src/app/models/student'
import { ActivatedRoute, Router } from '@angular/router'
import { EmailTemplate } from 'src/app/models/email-template'
import { QuillEditorComponent } from 'ngx-quill'
import { SmsTemplate } from 'src/app/models/sms-template'
import { ClassManager } from 'src/app/models/class-manager'
import moment from 'moment'

@Component({
    selector: 'app-admin-send-sms',
    templateUrl: './send-sms.component.html',
    styleUrls: ['./send-sms.component.css']
})
export class SendSmsComponent {
    @ViewChild(QuillEditorComponent, { static: true })
    editor: QuillEditorComponent
    editorConfig = { }
    selectedStudents: any = []
    subject = ''
    body: any = ''
    dataStatus = 'fetching'
    spinnerGrey50 = '/assets/images/rolling-grey-50.svg'
    student: boolean = false
    classes: boolean = true
    saveLoading = false
    searchStudentList: Array<Student> = []
    classList: Array<any> = []
    classIds: Array<any> = []
    studentIds: Array<any> = []
    smsTempleteList: Array<SmsTemplate> = []
    emailDetail: any = []
    moment = moment
    public daysName: any = {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday'
    }

    breadCrum = [
        {
            link: '/admin/send-sms',
            value: 'Send SMS'
        }
    ]
    editorInstance: any

    constructor(
        public api: ApiService,
        public ds: DataService,
        public cs: ConstantsService,
        public alert: IAlertService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.editorConfig = this.cs.EDITOR_CONFIG

        this.route.queryParams.subscribe((param: any) => {
            if (param.ids) {
                const idsData = param.ids.split(',')
                idsData.forEach((id: any) => {
                    this.selectedStudents.push(+id)
                })
                this.student = false
                this.classes = true
            } else {
                this.student = true
                this.classes = false
            }
        })

        this.ds.getTempleteList().subscribe((resp: Resp<Array<SmsTemplate>>) => {
            if (resp.success === true) {
                this.smsTempleteList = resp.data as Array<SmsTemplate>
            } else {
                this.alert.error(resp.errors?.general as string)
            }
        })

        this.getStudents()
        this.getClasses()
        this.selectedEmailTemplete(null)
    }

    getStudents() {
        this.ds.getStudentsList().subscribe((resp: Resp<any>) => {
            if (this.selectedStudents.length > 0) {
                this.studentIds = this.selectedStudents
            }
            this.searchStudentList = resp.data || []
        })
    }
    getClasses() {
        this.ds.getClassesList().subscribe((resp: Resp<any>) => {
            this.classList = resp.data
        })
    }

    save() {
        const params = {
            // subject: this.subject,
            body: this.body,
            classIds: this.classIds,
            studentIds: this.studentIds
        }
        if (params.classIds.length === 0 && params.studentIds.length === 0) {
            this.alert.error('You must select atleast one class or student.')
            return
        }
        if (params.body === '') {
            this.alert.error('SMS Content is required')
            return
        }
        this.saveLoading = true
        this.ds.save(params).subscribe((resp: Resp<any>) => {
            this.saveLoading = false
            if (resp.success === true) {
                this.body = ''
                this.alert.success(resp.msg || 'Added Successfully')
                this.router.navigateByUrl('/admin/student-sms')
                this.saveLoading = false
            } else {
                this.body = ''
                this.alert.error(resp.errors?.general || '')
                this.saveLoading = false
            }
        })
    }

    students() {
        this.student = true
        this.classes = false
    }
    classess() {
        this.classes = true
        this.student = false
    }

    selectedEmailTemplete(e: any) {
        this.dataStatus = 'fetching'
        if (e === null) {
            this.dataStatus = 'done'
            this.subject = ''
            this.body = ''
        } else {
            const params = {
                id: e.target.value
            }
            this.ds.smsDetail(params).subscribe((resp: Resp<SmsTemplate>) => {
                if (resp.success === true) {
                    if (resp.data !== null) {
                        this.emailDetail = resp.data
                        this.subject = this.emailDetail.smsSubject
                        this.body = this.emailDetail.smsBody
                        this.dataStatus = 'done'
                    }
                } else {
                    this.dataStatus = 'done'
                    this.subject = ''
                    this.body = ''
                }
            })
        }
    }

    created(editorInstance: any) {
        this.editorInstance = editorInstance
    }

    // -----For Simple Text Area
    // setSuperSeeder(str: string) {
    //     str = ':' + str
    //     this.body = this.body + str + ' '
    // }
    setSuperSeeder(newText: any, e2: any = document.activeElement) {
        const el: any = document.getElementById('smsBody')
        const start = el.selectionStart
        const end = el.selectionEnd
        const text = el.value
        const before = text.substring(0, start)
        const after  = text.substring(end, text.length)
        el.value = (before + ':' + newText + after)
        el.selectionStart = el.selectionEnd = start + newText.length + 1
        el.focus()
        this.emailDetail.controls.smsBody.setValue(el.value)
        this.body = el.value
        console.log(this.body)
      }
    getSuperSeederFormat(superSeeder: string) {
        const superSeederFormat: any = {
            studentFirstName: 'Student First Name',
            studentMiddleName: 'Student Middle Name',
            studentLastName: 'Student Last Name',
            studentPhoneNumber: 'Student Phone Number',
            studentBalance: 'Student Balance',
            studentEmail: 'Student Email',
            contactFirstName: 'Contact First Name',
            contactLastName: 'Contact Last Name',
            contactEmail: 'Contact Email',
            contactPhoneNumber: 'Contact Phone Number',
            contactRelation: 'Contact Relation',
            onlinePaymentLink: 'Online Payment Link'
        }
        return superSeederFormat[superSeeder]
    }

    getClassName(c: ClassManager) {
        return `${c.course.title} - ${this.daysName[c.day]} - ${moment(
            c.startTime,
            'hh:mm:ss'
        ).format('hh:mm a')} - ${moment(c.endTime, 'hh:mm:ss').format('hh:mm a')}`
    }
}
