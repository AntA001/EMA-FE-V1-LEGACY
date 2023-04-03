import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GuideArticleComponent } from './guide-article.component'
import { LazyLoadImageModule } from 'ng-lazyload-image'
import { ImageCropperModule } from 'ngx-image-cropper'
import { SharedModule } from 'src/app/website/shared/shared.module'
import { RouterModule } from '@angular/router'
import { ModalModule } from 'ngx-bootstrap/modal'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DataService } from './data.service'
import { AdminSharedModule } from '../admin-shared/admin-shared.module'
import { QuillModule } from 'ngx-quill'
import { GuidesListComponent } from './guides-list/guides-list.component'
import { AddGuideComponent } from './add-guide/add-guide.component'
import { GuideArticleRoutes } from './guide-artilce.routing'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        AdminSharedModule,
        ImageCropperModule,
        LazyLoadImageModule,
        GuideArticleRoutes,
        ModalModule.forRoot(),
        QuillModule.forRoot()
    ],
    declarations: [
        GuideArticleComponent,
        GuidesListComponent,
        AddGuideComponent],
    providers: [DataService]
})
export class GuideArticleModule { }
