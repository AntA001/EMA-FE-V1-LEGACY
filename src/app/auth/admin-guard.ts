import { Observable } from 'rxjs'
import { ApiService } from '../services/api.service'
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router'
import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivateChild {

    constructor(private api: ApiService, private router: Router) { }

    canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean {
        if (this.api.isAdmin()) {
            return true
        }
        this.router.navigateByUrl('login')
        return true
    }
}
