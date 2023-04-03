import { FaqCategory } from 'src/app/models/faq-category'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from 'src/environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/admin`

    constructor(public http: HttpClient) {
        // code here
    }

    getList(params: any): Observable<any> {
        const url = `${this.baseUrl}/faq-cats`
        return this.http.get<any>(url, { params })
    }

    add(params: FaqCategory): Observable<any> {
        const url = `${this.baseUrl}/faq-cats/save`
        return this.http.post<any>(url, params)
    }

    update(params: FaqCategory): Observable<any> {
        const url = `${this.baseUrl}/faq-cats/update`

        return this.http.post<any>(url, params)
    }

    delete(params: object): Observable<any> {
        const url = `${this.baseUrl}/faq-cats/delete`

        return this.http.post<any>(url, params)
    }
}
