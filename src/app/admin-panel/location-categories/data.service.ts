import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from 'src/environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/admin`
    contactId = -1
    contactUpdated: any
    name = ''
    constructor(public http: HttpClient) {
        // Code Here
    }

    getList(params: any): Observable<any> {
        const url = `${this.baseUrl}/location-category/list`
        return this.http.get<any>(url, { params })
    }

    add(params: any): Observable<any> {
        const url = `${this.baseUrl}/location-category/add`
        return this.http.post<any>(url, params)
    }

    update(params: any): Observable<any> {
        const url = `${this.baseUrl}/location-category/update `
        return this.http.post<any>(url, params)
    }

    delete(params: any): Observable<any> {
        const url = `${this.baseUrl}/location-category/delete `
        return this.http.post<any>(url, params)
    }

    changeStatus(params: any): Observable<any> {
        const url = `${this.baseUrl}/location-category/update-status`
        return this.http.post<any>(url, params)
    }

}
