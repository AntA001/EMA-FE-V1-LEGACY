import { LazyLoadImageModule } from 'ng-lazyload-image'
import { IRangeSliderModule } from './../../libs/irange-slider/irange-slider.module'
import { FormsModule } from '@angular/forms'
import { SharedModule } from './../shared/shared.module'
import { NgModule } from '@angular/core'
import { IndexComponent } from './index.component'
import { RouterModule } from '@angular/router'
import { AutocompleteLibModule } from 'angular-ng-autocomplete'
import { DataService } from './data.service'
// import { AgmCoreModule } from '@agm/core'
import { IvyCarouselModule } from 'angular-responsive-carousel'
@NgModule({
    imports: [
        LazyLoadImageModule,
        // AgmCoreModule.forRoot({
        //     apiKey: apis.googleApiKey,
        //     libraries: ['places']
        // }),
        AutocompleteLibModule,
        IRangeSliderModule,
        SharedModule,
        IvyCarouselModule,
        FormsModule,
        RouterModule.forChild([
            { path: '', component: IndexComponent }
        ])
    ],
    declarations: [IndexComponent],
    providers: [DataService]
})
export class IndexModule { }
