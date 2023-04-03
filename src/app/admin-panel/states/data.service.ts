import { apis } from 'src/environments/environment'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { State } from 'src/app/models/state'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/admin`

    constructor(public http: HttpClient) {
        // code here
    }

    getList(params: any): Observable<any> {
        const url = `${this.baseUrl}/states`
        return this.http.get<any>(url, { params })
    }

    add(params: object): Observable<any> {
        const url = `${this.baseUrl}/states/save`
        return this.http.post<any>(url, params)
    }

    update(params: State): Observable<any> {
        const url = `${this.baseUrl}/states/update`
        return this.http.post<any>(url, params)
    }

    delete(params: object): Observable<any> {
        const url = `${this.baseUrl}/states/delete`
        return this.http.post<any>(url, params)
    }
}
