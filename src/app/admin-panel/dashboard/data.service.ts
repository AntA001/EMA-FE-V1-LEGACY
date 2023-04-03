import { Observable } from 'rxjs'
// import { apis } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { apis } from '../../../environments/environment'

@Injectable()
export class DataService {
    // private baseUrl = `${apis.baseUrl}`
    activeMenu = 'dashboard'
    private baseUrl = `${apis.baseUrl}/admin`
    constructor(public http: HttpClient) {
        // code here
    }

    getContent(): Observable<any> {
        const url = `${this.baseUrl}/dashboard-insights`
        return this.http.get(url)
    }
}
