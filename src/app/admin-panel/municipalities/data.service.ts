import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from 'src/environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/admin`
    municipalityId: any = -1
    municipalityUpdate: any
    name = ''
    constructor(public http: HttpClient) {
        // Code Here
    }

    getList(params: any): Observable<any> {
        const url = `${this.baseUrl}/municipality/list`
        return this.http.get<any>(url, { params })
    }

    add(params: any): Observable<any> {
        const url = `${this.baseUrl}/municipality/add`
        return this.http.post<any>(url, params)
    }

    update(params: any): Observable<any> {
        const url = `${this.baseUrl}/municipality/update `
        return this.http.post<any>(url, params)
    }

    delete(params: any): Observable<any> {
        const url = `${this.baseUrl}/municipality/delete `
        return this.http.post<any>(url, params)
    }

    changeStatus(params: any): Observable<any> {
        const url = `${this.baseUrl}/municipality/update-status`
        return this.http.post<any>(url, params)
    }


    newsImageUrl(_id: any, time: any) {
        _id = _id ? _id : -1
        return `${apis.baseUrl}/public/municipality/image/${_id}?` + time
    }

}
