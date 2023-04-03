import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { apis } from 'src/environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/public`
    private baseUrlInstructor = `${apis.baseUrl}/instructor`

    constructor(public http: HttpClient) {
        // Code Here
    }

    getUserDetail(params: any): Observable<any> {
        const url = `${this.baseUrlInstructor}/profile/detail`
        return this.http.get<any>(url, { params })
    }

    updateUserDetail(params: any): Observable<any> {
        const url = `${this.baseUrlInstructor}/profile/update`
        return this.http.post<any>(url, params)
    }

    userProfileImageUrl(id?: number) {
        id = id ? id : -1
        return `${apis.baseUrl}/public/instructors/image/${id}`
    }
}
