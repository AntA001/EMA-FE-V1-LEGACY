import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from 'src/environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/municipal-admin`
    contactId = -1
    contactUpdated: any

    constructor(public http: HttpClient) {
        // Code Here
    }

    getList(params: any): Observable<any> {
        const url = `${this.baseUrl}/user/list`
        return this.http.get<any>(url, { params })
    }

    getCategoriesList(): Observable<any> {
        const url = `${apis.baseUrl}/public/category/list`
        return this.http.get<any>(url)
    }

    add(params: any): Observable<any> {
        const url = `${this.baseUrl}/category/add`
        return this.http.post<any>(url, params)
    }

    update(params: any): Observable<any> {
        const url = `${this.baseUrl}/category/update `
        return this.http.post<any>(url, params)
    }

    delete(params: any): Observable<any> {
        const url = `${this.baseUrl}/category/delete `
        return this.http.post<any>(url, params)
    }

    changeStatus(params: any): Observable<any> {
        const url = `${this.baseUrl}/category/update-status`
        return this.http.post<any>(url, params)
    }

}
