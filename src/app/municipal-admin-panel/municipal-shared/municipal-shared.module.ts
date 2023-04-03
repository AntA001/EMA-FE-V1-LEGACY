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
import { MunicipalSidebarComponent } from './municipal-sidebar/municipal-sidebar.component'
import { IAlertsModule } from 'src/app/libs/ialert/ialerts.module'


@NgModule({
    imports: [
        IAlertsModule,
        BsDropdownModule.forRoot(),
        CommonModule, FormsModule, RouterModule,
        NgxMaskModule.forRoot()
    ],
    declarations: [
        MunicipalSidebarComponent,
        SkeletonTabelLoaderComponent,
        LoaderComponent,
        NoDataComponent,
        NotAuthorizedComponent,
        BreadcrumsComponent
    ],
    exports: [
        MunicipalSidebarComponent, LoaderComponent, NoDataComponent, IPaginationModule,
        IAlertsModule, BsDropdownModule, SkeletonTabelLoaderComponent,
        CommonModule, FormsModule, RouterModule, NgxMaskModule, BreadcrumsComponent
    ]
})
export class MunicipalSharedModule { }
