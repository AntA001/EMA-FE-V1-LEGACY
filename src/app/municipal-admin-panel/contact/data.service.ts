import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { apis } from 'src/environments/environment'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/municipal-admin/emergency-contacts`
    contactId = -1
    contactUpdated: any

    constructor(public http: HttpClient) {
        // Code Here
    }

    getList(params: any): Observable<any> {
        const url = `${this.baseUrl}/list`
        return this.http.get<any>(url, { params })
    }


    add(params: any): Observable<any> {
        const url = `${this.baseUrl}/add`
        return this.http.post<any>(url, params)
    }
    saveContactOrder(params: any): Observable<any> {
        const url = `${this.baseUrl}/rearrange-list`
        return this.http.post<any>(url, params)
    }

    update(params: any): Observable<any> {
        const url = `${this.baseUrl}/update`
        return this.http.post<any>(url, params)
    }

    delete(params: any): Observable<any> {
        const url = `${this.baseUrl}/delete`
        return this.http.post<any>(url, params)
    }

    contactImageUrl(newsId?: number) {
        newsId = newsId ? newsId : -1
        return `${apis.baseUrl}/public/emergency-contacts/image/${newsId}`
    }

    newsImageUrl(newsId: any, time: any) {
        newsId = newsId ? newsId : -1
        //console.log(`${apis.baseUrl}/public/emergency-contacts/image/${newsId}?` + time);
        
        return `${apis.baseUrl}/public/emergency-contacts/image/${newsId}?` + time

    }

}
