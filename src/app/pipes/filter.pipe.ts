import { Pipe, PipeTransform, Injectable } from '@angular/core'

@Pipe({
    name: 'filter',
    pure: false
})
@Injectable()
export class FilterPipe implements PipeTransform {
    transform(items: any[], searchString: string): any[] {
        if (!items) {
            return []
        }
        if (!searchString) {
            return items
        }

        searchString = searchString.toLowerCase()

        return items.filter((item: object) => {
            const a = this.findMatch(item, searchString)
            return a
        })
    }

    findMatch(item: object | any, searchString: string) {
        return Object.keys(item).some((key) => {
            const value = item[key] ? item[key] : ''

            if (typeof value === 'object') {
                if (this.findMatch(value, searchString)) {
                    return true
                }
                return false
            }
            if (value.toString().toLowerCase().includes(searchString)) {
                return true
            }
            return false
        })
    }
}
