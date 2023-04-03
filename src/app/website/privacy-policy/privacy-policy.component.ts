
import { Component } from '@angular/core'
import { ApiService } from 'src/app/services/api.service'
@Component({
    selector: 'app-privacy-policy',
    templateUrl: './privacy-policy.component.html',
    styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent {
    lang: any = new Object()

    constructor(public api: ApiService) {
        // Code Here
        this.api.translate('website.privacy-policy').subscribe((d: object) => {
            this.lang = d
        })
    }
}
