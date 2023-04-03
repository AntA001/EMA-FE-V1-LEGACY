import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from 'src/environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/instructor`

    constructor(public http: HttpClient) {
        // Code Here
    }

    getMessages(params: any): Observable<any> {
        const url = `${this.baseUrl}/instructor-messages`
        return this.http.get<any>(url, { params })
    }

    getdetail(params: any): Observable<any> {
        const url = `${this.baseUrl}/instructor-messages/detail`
        return this.http.get<any>(url , params)
    }

    read(params: any): Observable<any> {
        const url = `${this.baseUrl}/instructor-messages/mark-read`
        return this.http.post<any>(url, params)
    }

    unread(params: any): Observable<any> {
        const url = `${this.baseUrl}/instructor-messages/mark-unread`
        return this.http.post<any>(url, params)
    }

}
