import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from 'src/environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/municipal-admin/sos-alerts`

    constructor(public http: HttpClient) {
        // Code Here
    }

    getList(params: any): Observable<any> {
        const url = `${this.baseUrl}/list`
        return this.http.get<any>(url, { params })
    }
    
    newInfo(_id: any): Observable<any> {
        const url = `${this.baseUrl}/read`
        return this.http.post<any>(url , {_id})
    }


}
