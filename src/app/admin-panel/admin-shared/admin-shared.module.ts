import { IPaginationModule } from './../../libs/ipagination/ipagination.module'
import { BreadcrumsComponent } from './breadcrums/breadcrums.component'
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component'
import { SkeletonTabelLoaderComponent } from './skeleton-tabel-loader/skeleton-tabel-loader.component'
import { NoDataComponent } from './no-data/no-data.component'
import { LoaderComponent } from './loader/loader.component'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { NgxMaskModule } from 'ngx-mask'
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component'
import { IAlertsModule } from 'src/app/libs/ialert/ialerts.module'

@NgModule({
    imports: [
        IAlertsModule,
        BsDropdownModule.forRoot(),
        CommonModule, FormsModule, RouterModule,
        NgxMaskModule.forRoot()
    ],
    declarations: [
        AdminSidebarComponent,
        SkeletonTabelLoaderComponent,
        LoaderComponent,
        NoDataComponent,
        NotAuthorizedComponent,
        BreadcrumsComponent
    ],
    providers: [
    ],
    exports: [
        AdminSidebarComponent, LoaderComponent, NoDataComponent, IPaginationModule,
        IAlertsModule, BsDropdownModule, SkeletonTabelLoaderComponent,
        CommonModule, FormsModule, RouterModule, NgxMaskModule, BreadcrumsComponent
    ]
})
export class AdminSharedModule { }
