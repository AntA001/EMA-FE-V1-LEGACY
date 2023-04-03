import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/admin`

    constructor(public http: HttpClient) {
        // code here
    }

    getList(params: any): Observable<any> {
        const url = `${this.baseUrl}/users`
        return this.http.get<any>(url, { params })
    }

    delete(params = new Object()): Observable<any> {
        const url = `${this.baseUrl}/users/delete`
        return this.http.post<any>(url, params)
    }

    update(params: any): Observable<any> {
        const url = `${this.baseUrl}/users/update`

        return this.http.post<any>(url, params)
    }

    activeUser(params: any): Observable<any> {
        const url = `${this.baseUrl}/users/activate`
        return this.http.post<any>(url, params)
    }

    inactiveUser(params: any): Observable<any> {
        const url = `${this.baseUrl}/users/deactivate`
        return this.http.post<any>(url, params)
    }
}
