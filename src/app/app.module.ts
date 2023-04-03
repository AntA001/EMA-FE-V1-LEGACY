import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { UIHelpers } from './helpers/ui-helpers'
import { HttpErrorsInterceptorService } from './interceptors/http-errors-interceptor.service'
import { ConstantsService } from './services/constants.service'
import { ApiInterceptorsService } from './interceptors/api-interceptors.service'
import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http'
import { QuillModule } from 'ngx-quill'
import { AppComponent } from './app.component'
import { AppRoutes } from './app.routing'
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { ConstantsServiceNo } from './services/constants-no.service'

// AOT compilation support
export const httpTranslateLoader = (http: HttpClient) => {
    return new TranslateHttpLoader(http)
}

export const constantsServiceFactoryProvider = (translate: TranslateService) => {
    switch (localStorage.getItem('lang')) {
        case 'en': {
            return new ConstantsService()
        }
        case 'no': {
            return new ConstantsServiceNo()
        }
        default: {
            return new ConstantsService()
        }
    }
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        QuillModule.forRoot(),
        BrowserAnimationsModule,
        AppRoutes,
        HttpClientModule,
        TranslateModule.forRoot({
            defaultLanguage: 'en',
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        ConstantsService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiInterceptorsService,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorsInterceptorService,
            multi: true
        },
        UIHelpers
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    // code here
}
