import { HttpClient } from '@angular/common/http'
import { apis } from 'src/environments/environment'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable()
export class DataService {
    baseUrl = apis.baseUrl

    constructor(private http: HttpClient) {
        // code here
    }

    registration(data: any): Observable<any> {
        const url = `${this.baseUrl}/public/signup/customer`
        return this.http.post(url, data)
    }
}
