import { PageContent } from 'src/app/models/page-content'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/admin`

    constructor(public http: HttpClient) {
        // content Here
    }

    getContent(params: any): Observable<any> {
        const url = `${apis.baseUrl}/public/contents/page-content`
        return this.http.get<any>(url, { params })
    }

    saveContent(data: PageContent): Observable<any> {
        const url = `${this.baseUrl}/contents/save-page-content`
        return this.http.post<any>(url, data)
    }
}
