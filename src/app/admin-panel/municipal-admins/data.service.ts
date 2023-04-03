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
        const url = `${this.baseUrl}/municipal-admin/list`
        return this.http.get<any>(url, { params })
    }


    getCountryList(): Observable<any> {
        const url = `${apis.baseUrl}/public/country/list`
        return this.http.get<any>(url)
    }

    getMunicipalAdminTypeList(): Observable<any> {
        const url = `${this.baseUrl}/municipal-admin/types/list`
        return this.http.get<any>(url)
    }

    getMunicipiltyList(id: any): Observable<any> {
        const url = `${apis.baseUrl}/public/municipality/list/${id}`
        return this.http.get<any>(url)
    }

    add(params: any): Observable<any> {
        const url = `${this.baseUrl}/municipal-admin/add`
        return this.http.post<any>(url, params)
    }

    update(params: any): Observable<any> {
        const url = `${this.baseUrl}/municipal-admin/update`
        return this.http.post<any>(url, params)
    }

    delete(params: any): Observable<any> {
        const url = `${this.baseUrl}/municipal-admin/delete`
        return this.http.post<any>(url, params)
    }

    changeStatus(params: any): Observable<any> {
        const url = `${this.baseUrl}/municipal-admin/update-status`
        return this.http.post<any>(url, params)
    }


}
