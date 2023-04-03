import { Component, Input } from '@angular/core'

@Component({
    selector: 'app-breadcrums',
    templateUrl: './breadcrums.component.html',
    styleUrls: ['./breadcrums.component.css']
})
export class BreadcrumsComponent {
    @Input()
    data: any

    constructor() { }
}
