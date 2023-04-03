import { ApiService } from 'src/app/services/api.service'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Resp } from 'src/app/interfaces/response'
import { User } from 'src/app/models/user'

@Component({
    selector: 'app-social-login',
    templateUrl: './social-login.component.html',
    styleUrls: ['./social-login.component.css']
})
export class SocialLoginComponent implements OnInit {
    code: string | null
    codeStatus: string = 'inProgress'
    lang: any = new Object()
    constructor(public api: ApiService, private route: ActivatedRoute, private router: Router) {
        this.code = this.route.snapshot.paramMap.get('code')

        this.api.translate('website.social-login').subscribe((d: object) => {
            this.lang = d
        })
    }

    ngOnInit() {
        const params = {
            code: this.code
        }
        this.api.checkVerificationCode(params).subscribe((resp: Resp<User>) => {
            if (resp.success === false) {
                this.codeStatus = 'expire'
                return
            }
            this.codeStatus = 'valid'
            this.api.user = resp.data as User
            localStorage.setItem('token', this.api.user.token || '')
            localStorage.setItem('user', JSON.stringify(resp.data))
            this.api.userLoggedInSource.next(true)

            this.api.doUserRedirects(resp.data as User, this.router)
        })
    }
}
