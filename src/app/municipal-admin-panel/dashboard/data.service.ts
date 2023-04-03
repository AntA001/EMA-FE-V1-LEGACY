import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
    // private baseUrl = `${apis.baseUrl}`
    activeMenu = 'dashboard'
    private baseUrl = `${apis.baseUrl}/municipal-admin`
    constructor(public http: HttpClient) {
        // code here
    }

    getContent(): Observable<any> {
        const url = `${this.baseUrl}/municipality/sms-count`
        return this.http.get(url)
    }

    getMessages(params: any): Observable<any> {
        const url = `${this.baseUrl}/instructor-messages/unread-messages`
        return this.http.get<any>(url, { params })
    }

    read(params: any): Observable<any> {
        const url = `${this.baseUrl}/instructor-messages/mark-read`
        return this.http.post<any>(url, params)
    }
}
