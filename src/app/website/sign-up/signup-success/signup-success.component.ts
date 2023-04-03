import { Component } from '@angular/core'

import { ApiService } from 'src/app/services/api.service'

@Component({
    selector: 'app-signup-success',
    templateUrl: './signup-success.component.html',
    styleUrls: ['./signup-success.component.scss']
})
export class SignupSuccessComponent {
    lang: any
    constructor(public api: ApiService) {
        this.lang = this.api.translate('website.registration-success')
        this.lang.subscribe((d: any) => {
            this.lang = d
        })
    }

}
