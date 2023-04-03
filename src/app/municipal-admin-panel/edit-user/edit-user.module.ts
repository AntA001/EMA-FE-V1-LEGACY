import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { DataService } from './data.service'
import { EditUserComponent } from './edit-user.component'
import { ImageCropperModule } from 'ngx-image-cropper'
import { ModalModule } from 'ngx-bootstrap/modal'
import { InstructorSharedModule } from '../instructor-shared/instructor-shared.module'
import { LazyLoadImageModule } from 'ng-lazyload-image'

@NgModule({
    declarations: [EditUserComponent],
    imports: [
        InstructorSharedModule,
        FormsModule,
        ReactiveFormsModule,
        ImageCropperModule,
        LazyLoadImageModule,
        ModalModule.forRoot(),

        RouterModule.forChild([{ path: '', component: EditUserComponent }])
    ],
    providers: [DataService]
})
export class EditUserModule {
    // Code Here
}
