import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { apis } from '../../../environments/environment'
@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/public`
    constructor(private http: HttpClient) {
        // code here
    }

    getFaqsCat(): Observable<any> {
        const url = `${this.baseUrl}/faq-cats`
        return this.http.get(url)
    }

    getFaq(params: any): Observable<any> {
        const url = `${apis.baseUrl}/faqs`
        return this.http.get(url, { params })
    }

    getContent(params: any): Observable<any> {
        const url = `${apis.baseUrl}/public/contents/page-content`
        return this.http.get<any>(url, { params })
    }
}
