import { apis } from 'src/environments/environment'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { ClassManager } from 'src/app/models/class-manager'
import { City } from 'src/app/models/city'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/admin`

    constructor(public http: HttpClient) {
        // code here
    }

    getList(params: any): Observable<any> {
        const url = `${this.baseUrl}/cities`
        return this.http.get<any>(url, { params })
    }

    add(params: object): Observable<any> {
        const url = `${this.baseUrl}/cities/save`
        return this.http.post<any>(url, params)
    }

    update(params: City): Observable<any> {
        const url = `${this.baseUrl}/cities/update`
        return this.http.post<any>(url, params)
    }

    delete(params: object): Observable<any> {
        const url = `${this.baseUrl}/cities/delete`
        return this.http.post<any>(url, params)
    }
}
