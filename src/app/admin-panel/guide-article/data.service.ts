import { apis } from 'src/environments/environment'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { News } from 'src/app/models/news'
import { GuideArticle } from 'src/app/models/guide-article'

@Injectable()
export class DataService {
    private baseUrl = `${apis.baseUrl}/admin`
    guideId : string = ''
    newsUpdated: any

    constructor(public http: HttpClient) {
        // code here
    }

    getList(params: any): Observable<any> {
        const url = `${this.baseUrl}/guide-articles/list`
        return this.http.get<any>(url, { params })
    }

    add(params: object): Observable<any> {
        const url = `${this.baseUrl}/guide-articles/add`
        return this.http.post<any>(url, params)
    }


    getGuide(params: any): Observable<any> {
        const url = `${this.baseUrl}/guide-articles/detail`
        return this.http.get<any>(url, { params })
    }


    update(params: object): Observable<any> {
        const url = `${this.baseUrl}/guide-articles/update`
        return this.http.post<any>(url, params)
    }

    delete(params: object): Observable<any> {
        const url = `${this.baseUrl}/guide-articles/delete`
        return this.http.post<any>(url, params)
    }

    guideImageUrl(guideId?: string) {
        guideId = guideId ? guideId : '-1'
        return `${apis.baseUrl}/public/guide-articles/image/${guideId}`
    }


    changeStatus(params: any): Observable<any> {
        const url = `${this.baseUrl}/guide-articles/update-status`
        return this.http.post<any>(url, params)
    }

    newsImageUrl(guideId: any, time: any) {
        console.log(guideId);
        
        guideId = guideId ? guideId : -1
        console.log(`${apis.baseUrl}/public/guide-articles/image/${guideId}?` + time);
        
        return `${apis.baseUrl}/public/guide-articles/image/${guideId}?` + time
    }
}
