import { PageContent } from 'src/app/models/page-content'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ContactUsRequest } from 'src/app/models/contact-us-request'
import { apis } from 'src/environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}`

    constructor(private http: HttpClient) {
        // Code here
    }

    contactUsRequestCreate(params: ContactUsRequest): Observable<any> {
        const url = `${this.baseUrl}/public/contact-us-requests/create`

        return this.http.post(url, params)
    }

    getContent(params: any): Observable<any> {
        const url = `${this.baseUrl}/public/contents/page-content`

        return this.http.get<any>(url, { params })
    }
}
