import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/public`
    constructor(public http: HttpClient) {
        // code here
    }

    getContent(params: any): Observable<any> {
        const url = `${this.baseUrl}/contents/page-content`

        return this.http.get(url, { params })
    }
}
