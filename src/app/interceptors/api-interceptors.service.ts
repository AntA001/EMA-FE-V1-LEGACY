import { Injectable } from '@angular/core'
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http'

@Injectable({
    providedIn: 'root'
})
export class ApiInterceptorsService implements HttpInterceptor {
    constructor() {
        // code here
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const apiToken = localStorage.getItem('token')
        const date = new Date()
        const offset: number = date.getTimezoneOffset()
        if (apiToken) {
            const headers: any = {
                Authorization: `Bearer ${apiToken}`
            }
            headers['time-offset'] = `${offset}`

            const clonedReq = req.clone({
                setHeaders: headers
            })

            return next.handle(clonedReq)
        }

        return next.handle(req)
    }
}
