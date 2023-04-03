import { LazyLoadImageModule } from 'ng-lazyload-image'
import { ImageCropperModule } from 'ngx-image-cropper'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { DataService } from './data.service'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UsefulContactComponent } from './useful-contact.component'
import { MunicipalSharedModule } from '../municipal-shared/municipal-shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { ModalModule } from 'ngx-bootstrap/modal'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        MunicipalSharedModule,
        ImageCropperModule,
        LazyLoadImageModule,
        ModalModule.forRoot(),
        RouterModule.forChild([{ path: '', component: UsefulContactComponent }])
    ],
    providers: [DataService],
    declarations: [UsefulContactComponent]
})
export class UsefulContactModule { }
