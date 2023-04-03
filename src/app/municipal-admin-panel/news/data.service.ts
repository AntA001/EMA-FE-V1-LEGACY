import { apis } from 'src/environments/environment'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { News } from 'src/app/models/news'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/municipal-admin`
    newsId = -1
    newsUpdated: any

    constructor(public http: HttpClient) {
        // code here
    }

    getList(params: any): Observable<any> {
        const url = `${this.baseUrl}/news/list`
        return this.http.get<any>(url, { params })
    }

    add(params: News): Observable<any> {
        const url = `${this.baseUrl}/news/add`
        return this.http.post<any>(url, params)
    }

    update(params: News): Observable<any> {
        const url = `${this.baseUrl}/news/update`
        return this.http.post<any>(url, params)
    }

    delete(params: object): Observable<any> {
        const url = `${this.baseUrl}/news/delete`
        return this.http.post<any>(url, params)
    }

    newsImageUrl(newsId?: number) {
        newsId = newsId ? newsId : -1
        return `${apis.baseUrl}/public/news/image/${newsId}`
    }

    newsImageUrl1(newsId: any, time: any) {
        newsId = newsId ? newsId : -1
        return `${apis.baseUrl}/public/news/image/${newsId}?` + time
    }
    
}
