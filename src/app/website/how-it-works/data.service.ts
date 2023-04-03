import { apis } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable()
export class DataService {
    // private baseUrl = `${apis.baseUrl}`

    constructor(private http: HttpClient) {
    }

    getContent(params: any): Observable<any> {
        const url = `${apis.baseUrl}/public/contents/page-content`
        return this.http.get<any>(url, { params })
    }
}
