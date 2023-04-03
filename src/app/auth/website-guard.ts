import { Observable } from 'rxjs'
import { ApiService } from '../services/api.service'
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router'
import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root'
})
export class WebsiteGuard implements CanActivateChild {

    constructor(private api: ApiService) { }

    canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean {
        if (this.api.isAuthenticated()) {
            return true
        }
        return true
    }
}
