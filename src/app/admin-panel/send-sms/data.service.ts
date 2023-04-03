import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from '../../../environments/environment'
import { PageContent } from 'src/app/models/page-content'

@Injectable()
export class DataService {
    // private baseUrl = `${apis.baseUrl}`
    // activeMenu = 'dashboard'
    private baseUrl = `${apis.baseUrl}/admin`

    constructor(public http: HttpClient) {
        // code here
    }
    getContent(params: any): Observable<any> {
        const url = `${apis.baseUrl}/public/contents/page-content`
        return this.http.get<any>(url, { params })
    }

    save(data: object): Observable<any> {
        const url = `${this.baseUrl}/sms/send-general-sms`
        return this.http.post<any>(url, data)
    }
    getStudentsList(): Observable<any> {
        const url = `${apis.baseUrl}/public/students`
        return this.http.get<any>(url)
    }
    getClassesList(): Observable<any> {
        const url = `${this.baseUrl}/classes`
        return this.http.get<any>(url)
    }

    getTempleteList(): Observable<any> {
        const url = `${apis.baseUrl}/public/sms-templates`
        return this.http.get<any>(url)
    }

    smsDetail(params: any): Observable<any> {
        const url = `${this.baseUrl}/sms-templates/detail`
        return this.http.get<any>(url, { params })
    }
}
