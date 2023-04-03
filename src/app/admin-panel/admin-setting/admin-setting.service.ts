import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from 'src/environments/environment'

@Injectable()
export class AdminSettingService {
    private baseUrl = `${apis.baseUrl}`

    constructor(public http: HttpClient) { }

    settings(): Observable<any> {
        const url = `${this.baseUrl}/admin/settings`

        return this.http.get<any>(url)
    }

    save(params: any): Observable<any> {
        const url = `${this.baseUrl}/admin/settings/update`
        return this.http.post<any>(url, params)
    }

}
