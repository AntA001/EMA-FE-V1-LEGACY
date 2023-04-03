import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { apis } from 'src/environments/environment'

@Injectable()
export class DataService {
    private baseUrl = apis.baseUrl + '/public/pay-now'
    constructor(public http: HttpClient) {
        // Code Here
    }
    paymentDetails(id: any): Observable<any> {
        const url = `${this.baseUrl}/payment-details/${id}`
        return this.http.get<any>(url)
    }
}
