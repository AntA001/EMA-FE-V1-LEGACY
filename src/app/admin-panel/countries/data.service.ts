import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from 'src/environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/admin`
    contactId = -1
    contactUpdated: any

    constructor(public http: HttpClient) {
        // Code Here
    }

    getList(params: any): Observable<any> {
        const url = `${this.baseUrl}/country/list`
        return this.http.get<any>(url, { params })
    }

    getListNative(): Observable<any> {
        const url = `${apis.baseUrl}/admin/country/language/list`
        return this.http.get<any>(url)
    }

    add(params: any): Observable<any> {
        const url = `${this.baseUrl}/country/add`
        return this.http.post<any>(url, params)
    }

    update(params: any): Observable<any> {
        const url = `${this.baseUrl}/country/update `
        return this.http.post<any>(url, params)
    }

    delete(params: any): Observable<any> {
        const url = `${this.baseUrl}/country/delete `
        return this.http.post<any>(url, params)
    }

    changeStatus(params: any): Observable<any> {
        const url = `${this.baseUrl}/country/update-status`
        return this.http.post<any>(url, params)
    }

}
