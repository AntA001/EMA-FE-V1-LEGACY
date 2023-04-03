import { apis } from 'src/environments/environment'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Faq } from 'src/app/models/faq'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/admin`

    constructor(public http: HttpClient) {
        // code here
    }

    getList(params: any): Observable<any> {
        const url = `${this.baseUrl}/faqs`
        return this.http.get<any>(url, { params })
    }

    add(params: Faq): Observable<any> {
        const url = `${this.baseUrl}/faqs/save`
        return this.http.post<any>(url, params)
    }

    update(params: Faq): Observable<any> {
        const url = `${this.baseUrl}/faqs/update`

        return this.http.post<any>(url, params)
    }

    delete(params: object): Observable<any> {
        const url = `${this.baseUrl}/faqs/delete`

        return this.http.post<any>(url, params)
    }
}
