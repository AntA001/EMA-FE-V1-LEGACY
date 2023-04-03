import { LazyLoadImageModule } from 'ng-lazyload-image'
import { ImageCropperModule } from 'ngx-image-cropper'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { DataService } from './data.service'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ContactComponent } from './contact.component'
import { MunicipalSharedModule } from '../municipal-shared/municipal-shared.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { ModalModule } from 'ngx-bootstrap/modal'
import { ContactDirective } from './contact.directive';

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
        RouterModule.forChild([{ path: '', component: ContactComponent }])
    ],
    providers: [DataService],
    declarations: [ContactComponent, ContactDirective]
})
export class ContactModule { }
