import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IPaginationComponent } from './ipagination.component'

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [IPaginationComponent],
    exports: [IPaginationComponent]
})
export class IPaginationModule { }
