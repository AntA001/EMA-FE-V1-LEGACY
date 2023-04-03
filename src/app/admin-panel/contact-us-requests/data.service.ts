import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/admin`

    constructor(public http: HttpClient) {
        // code here
    }

    getList(params: any): Observable<any> {
        const url = `${this.baseUrl}/contact-us-requests`
        return this.http.get<any>(url, { params })
    }
    markRead(params: any): Observable<any> {
        const url = `${this.baseUrl}/contact-us-requests/update`
        return this.http.post<any>(url, params)
    }
}
