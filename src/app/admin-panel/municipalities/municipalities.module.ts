import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MunicipalitiesComponent } from './municipalities.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { AdminSharedModule } from 'src/app/admin-panel/admin-shared/admin-shared.module'
import { ModalModule } from 'ngx-bootstrap/modal'
import { RouterModule } from '@angular/router'
import { DataService } from './data.service'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ImageCropperModule } from 'ngx-image-cropper'
import { LazyLoadImageModule } from 'ng-lazyload-image'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ImageCropperModule,
        LazyLoadImageModule,
        AdminSharedModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        RouterModule.forChild([{ path: '', component: MunicipalitiesComponent }])
    ],
    declarations: [MunicipalitiesComponent],
    providers: [DataService]
})
export class MunicipalitiesModule {
    // code here
}
