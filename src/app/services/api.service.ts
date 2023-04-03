import { Router } from '@angular/router'
import { ConstantsService } from './constants.service'
import { map } from 'rxjs/operators'
import { apis } from '../../environments/environment'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, BehaviorSubject, Subject } from 'rxjs'
import { TranslateService } from '@ngx-translate/core'
import { User } from '../models/user'

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    baseUrl: string
    userLoggedInSource = new BehaviorSubject(false)
    scrollBottom: boolean
    scrollBottomChange = new Subject<boolean>()
    userImage = new Subject<string>()
    userLoggedInObs = this.userLoggedInSource.asObservable()
    user: User
    permissoins: Array<any>
    data: Array<any>

    constructor(
        public http: HttpClient,
        public cs: ConstantsService,
        private ts: TranslateService
    ) {
        this.baseUrl = apis.baseUrl + '/public'

        if (localStorage.getItem('token')) {
            this.user = JSON.parse(localStorage.getItem('user') as string)
            if (this.user.userType !== 'admin') {
                this.cs.setLanguage(this.user)
            }
            this.userLoggedInSource.next(true)
        } else {
            this.userLoggedInSource.next(false)
        }
    }

    login(params: any): Observable<any> {
        const url = `${this.baseUrl}/auth/login`

        return this.http.post<any>(url, params).pipe(
            map((resp) => {
                if (resp && resp.success && resp.data.token) {
                    localStorage.setItem('token', resp.data.token)
                    localStorage.setItem('user', JSON.stringify(resp.data))
                    this.user = resp.data
                    if (this.user.userType !== 'admin') {
                        this.cs.setLanguage(this.user)
                        if (this.ts.currentLang !== 'en') {
                            if (this.ts.currentLang !== this.user.municipality.country.nativeLanguage?.code && !(this.ts.currentLang === 'gr' && this.user.municipality.country.nativeLanguage?.code === 'el')) {
                                this.changeLanguage('en')
                                }
                        }
                    }
                    this.userLoggedInSource.next(true)

                }

                return resp
            })
        )
    }

    googleLogin(): Observable<any> {
        const url = `${this.baseUrl}/login/${'google'}`

        return this.http.get<any>(url).pipe(
            map((resp) => {
                if (resp && resp.success && resp.data.token) {
                    localStorage.setItem('token', resp.data.token)
                    localStorage.setItem('user', JSON.stringify(resp.data))
                    this.user = resp.data
                    this.userLoggedInSource.next(true)
                }

                return resp
            })
        )
    }

    doUserRedirects(user: User, router: Router) {
        switch (user.userType) {
            case ConstantsService.USER_ROLES.ADMIN: {
                router.navigate(['/admin/dashboard'])
                break
            }
            case ConstantsService.USER_ROLES.MUNICIPAL: {
                router.navigate(['/municipal/dashboard'])
                break
            }
        }
    }

    logOut(): boolean {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('permissions')
        this.user._id = 0
        this.userLoggedInSource.next(false)

        return true
    }

    logOutSession(): Observable<any> {
        const url = `${this.baseUrl}/logout`

        return this.http.post<any>(url, new Object())
    }

    isAuthenticated(): boolean {
        if (localStorage.getItem('token')) {
            return true
        }
        return false
    }

    isAdmin(): boolean {
        if (this.isAuthenticated() && this.user.userType === ConstantsService.USER_ROLES.ADMIN) {
            return true
        }
        return false
    }

    isMunicipal(): boolean {
        if (this.isAuthenticated() && this.user.userType === ConstantsService.USER_ROLES.MUNICIPAL) {
            return true
        }
        return false
    }

    translate(key: string) {
        return this.ts.get(key)
    }

    getCurrentLang() {
        let lang = localStorage.getItem('lang')
            ? localStorage.getItem('lang')
            : this.ts.getBrowserLang()
        if (!lang) {
            lang = 'en'
        }
        return lang
    }

    changeLanguage(lang: string) {
        console.log(lang)
        this.ts.currentLang = lang
        localStorage.setItem('lang', lang)
        this.ts.setDefaultLang(lang)
        this.ts.use(lang)
        location.reload()
    }

    jsonToFormData(jsonObject: object | any, parentKey?: any, carryFormData?: FormData): FormData {
        const formData = carryFormData || new FormData()
        let index = 0

        // tslint:disable-next-line: forin
        for (const key in jsonObject) {
            if (jsonObject.hasOwnProperty(key)) {
                if (jsonObject[key] !== null && jsonObject[key] !== undefined) {
                    let propName = parentKey || key
                    if (parentKey && this.isObject(jsonObject)) {
                        propName = parentKey + '[' + key + ']'
                    }
                    if (parentKey && this.isArray(jsonObject)) {
                        propName = parentKey + '[' + index + ']'
                    }
                    if (jsonObject[key] instanceof File) {
                        formData.append(propName, jsonObject[key])
                    } else if (jsonObject[key] instanceof FileList) {
                        for (let j = 0; j < jsonObject[key].length; j++) {
                            formData.append(propName + '[' + j + ']', jsonObject[key].item(j))
                        }
                    } else if (this.isArray(jsonObject[key]) || this.isObject(jsonObject[key])) {
                        this.jsonToFormData(jsonObject[key], propName, formData)
                    } else if (typeof jsonObject[key] === 'boolean') {
                        formData.append(propName, +jsonObject[key] ? '1' : '0')
                    } else {
                        formData.append(propName, jsonObject[key])
                    }
                }
            }
            index++
        }

        return formData
    }

    isArray(val: any) {
        const toString = new Object().toString

        return toString.call(val) === '[object Array]'
    }

    isObject(val: any) {
        return !this.isArray(val) && typeof val === 'object' && !!val
    }

    checkVerificationCode(data: object): Observable<any> {
        const url = `${this.baseUrl}/verify-email`

        return this.http.post<any>(url, data)
    }

    resendVerificationCode(data: any): Observable<any> {
        const url = `${this.baseUrl}/resend-code`

        return this.http.post<any>(url, data)
    }

    userImageUrl(userId?: number) {
        userId = userId ? userId : -1

        return `${apis.baseUrl}/public/profile-image/${userId}`
    }

    checkResetCode(data: any): Observable<any> {
        const url = `${this.baseUrl}/verify-code`
        return this.http.post<any>(url, data)
    }

    resetPass(data: any): Observable<any> {
        const url = `${this.baseUrl}/reset-password`
        return this.http.post<any>(url, data)
    }
    userProfileImageUrl(userId?: number) {
        userId = userId ? userId : -1
        return `${apis.baseUrl}/public/image/${userId}`
    }
    getInstructorImage(userId?: number) {
        userId = userId ? userId : -1
        return `${apis.baseUrl}/public/instructors/image/${userId}`
    }
    studentProfileImageUrl(userId?: number) {
        userId = userId ? userId : -1
        return `${apis.baseUrl}/public/students/image/${userId}`
    }

    checkPermission(permission: string): boolean {
        /*if (this.user.userType === 'municipal-admin') {
          
            return true
        }*/
        
        this.data = JSON.parse(localStorage.permissions)
        //console.log('data', this.data)
        const index = this.data.findIndex((item: any) => item.name === permission)


        if (index > -1) {
            return true
        }

        return false
    }
}
