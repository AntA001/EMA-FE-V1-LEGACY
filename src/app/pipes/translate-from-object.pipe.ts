import { TranslateService } from '@ngx-translate/core'
import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'trans'
})
export class TranslateFromObjectPipe implements PipeTransform {
    constructor(private ts: TranslateService) {

    }

    transform(key: string, obj: any): any {
        let lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : this.ts.getBrowserLang()
        if (!lang) {
            lang = 'en'
        }

        return obj[`${key}_${lang}`]
    }

}
