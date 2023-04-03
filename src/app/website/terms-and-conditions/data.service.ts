import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
    // private baseUrl = `${apis.baseUrl}`

    constructor(private http: HttpClient) {
        // code here
    }

    getContent(params: any): Observable<any> {
        const url = `${apis.baseUrl}/public/contents/page-content`
        return this.http.get<any>(url, { params })
    }
}
