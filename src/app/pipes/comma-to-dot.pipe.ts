import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'ctd'
})
export class CommaToDotPipe implements PipeTransform {

    transform(value: string, args?: string): any {
        if (value === undefined || value === null || value === '' || value.length === 0) {
            return ''
        }
        const to = args ? args : '.'
        return value.replace(/,/g, to)
    }
}

