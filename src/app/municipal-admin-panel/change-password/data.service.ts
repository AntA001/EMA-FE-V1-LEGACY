import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/municipal-admin`

    constructor(public http: HttpClient) {
    }

    changePassword(params: any): Observable<any> {
        const url = `${this.baseUrl}/change-password`
        return this.http.post<any>(url, params)
    }
}
