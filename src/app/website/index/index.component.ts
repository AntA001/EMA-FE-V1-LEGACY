import { DataService } from './data.service'
import { Component } from '@angular/core'
import { ApiService } from 'src/app/services/api.service'
import { Router } from '@angular/router'

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.css']
})
export class IndexComponent {

    constructor(
        public api: ApiService,
        public ds: DataService,
        public router: Router
    ) {
        if (!this.api.user) {
            this.router.navigate(['/login'])
    }
    }
}
