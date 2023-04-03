import { Component, Input } from '@angular/core'

@Component({
    selector: 'app-component-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
    @Input() status = true
    constructor() { }
}
