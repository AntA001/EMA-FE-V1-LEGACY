import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from 'src/environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/municipal-admin/broadcast-message`

    constructor(public http: HttpClient) {
        // Code Here
    }

    getCategoryList(): Observable<any> {
        const url = `${apis.baseUrl}/public/category/list`
        return this.http.get<any>(url)
    }

    getList(params: any): Observable<any> {
        const url = `${this.baseUrl}/list`
        return this.http.get<any>(url, { params })
    }


    add(params: any): Observable<any> {
        const url = `${this.baseUrl}/send`
        return this.http.post<any>(url, params)
    }

    update(params: any): Observable<any> {
        const url = `${this.baseUrl}/update`
        return this.http.post<any>(url, params)
    }

    delete(params: any): Observable<any> {
        const url = `${this.baseUrl}/delete`
        return this.http.post<any>(url, params)
    }

}
