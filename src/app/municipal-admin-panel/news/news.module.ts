import { LazyLoadImageModule } from 'ng-lazyload-image'
import { ImageCropperModule } from 'ngx-image-cropper'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { RouterModule } from '@angular/router'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { NewsComponent } from './news.component'
import { ModalModule } from 'ngx-bootstrap/modal'
import { MunicipalSharedModule } from '../municipal-shared/municipal-shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DataService } from './data.service'


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
        RouterModule.forChild([{ path: '', component: NewsComponent }])
    ],
    declarations: [NewsComponent],
    providers: [DataService]
})
export class NewsModule { }
