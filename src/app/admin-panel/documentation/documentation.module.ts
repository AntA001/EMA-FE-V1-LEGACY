import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { DocumentationComponent } from './documentation.component'
import { AdminSharedModule } from '../admin-shared/admin-shared.module'

@NgModule({
    imports: [
        AdminSharedModule,
        RouterModule.forChild([
            { path: '', component: DocumentationComponent }
        ])
    ],
    declarations: [DocumentationComponent]

})
export class DocumentationModule { }
