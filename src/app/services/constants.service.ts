import { Injectable } from '@angular/core'
import { Languages } from '../models/languages'
import { ApiService } from './api.service'

@Injectable({
    providedIn: 'root'
})

export class ConstantsService {
    public static USER_ROLES = {
        ADMIN: 'admin',
        MUNICIPAL: 'municipal-admin'
    }

    api: ApiService
    public PAYMENT_METHOD = ['Cash', 'Check', 'Credit Card']

    public EDITOR_CONFIG = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ['clean'],
            ['link', 'image', 'video']
        ]
    }

    public LANGUAGES: Languages = {
        en: 'English'
    }

    public MONTHS = {
        1: 'January',
        2: 'February',
        3: 'March',
        4: 'April',
        5: 'May',
        6: 'June',
        7: 'July',
        8: 'August',
        9: 'September',
        10: 'October',
        11: 'November',
        12: 'December'
    }

    public DAYS: any = {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday'
    }

    public DATE_TIME_FORMAT = {
        PRINT_DATE: 'MMMM Do YYYY, h:mm A',
        SYN_DATE: 'MM/DD/YYYY',
        CHAR_DATE: 'MMM DD, YYYY',
        INVOICE_MONTH: 'MMM YYYY',
        INVOICE_DATE: 'MMMM DD, YYYY HH:mm',
        SHORT_DATE: 'DD-MM-YYYY',
        DATE: 'dddd, MMMM DD, YYYY',
        TIME: 'HH:mm',
        DATE_TIME: 'dddd, MMMM DD, YYYY hh:mm A',
        AM_PM: 'HH:mm A',
        DOC_DATE: 'DD MMM, YYYY',
        DATE_AMPM: 'DD MMM, YYYY, h a'
    }

    public ATTENDANCE: any = {
        present: 'P',
        absent: 'A',
        other: 'O'
    }

    public SUPER_SEEDER: any = [
        'studentFirstName',
        'studentMiddleName',
        'studentLastName',
        'studentPhoneNumber',
        'studentBalance',
        'studentEmail',
        'contactFirstName',
        'contactLastName',
        'contactEmail',
        'contactPhoneNumber',
        'contactRelation',
        'lastFiveTransactions',
        'lastTenTransactions',
        'lastFifteenTransactions',
        'onlinePaymentLink'
    ]

    public SMSSUPER_SEEDER: any = [
        'studentFirstName',
        'studentMiddleName',
        'studentLastName',
        'studentPhoneNumber',
        'studentBalance',
        'studentEmail',
        'contactFirstName',
        'contactLastName',
        'contactEmail',
        'contactPhoneNumber',
        'contactRelation',
        'onlinePaymentLink'
    ]

    setLanguage(params: any) {
        if (params.municipality.country.nativeLanguage?.code === 'al') {
            this.LANGUAGES.al = params.municipality.country.nativeLanguage?.name

        }
        if (params.municipality.country.nativeLanguage?.code === 'el') {
            this.LANGUAGES.gr = params.municipality.country.nativeLanguage?.name

        }
        if (params.municipality.country.nativeLanguage?.code === 'bg') {
            this.LANGUAGES.bg = params.municipality.country.nativeLanguage?.name

        }
        if (params.municipality.country.nativeLanguage?.code === 'mk') {
            this.LANGUAGES.mk = params.municipality.country.nativeLanguage?.name

        }
    }
}
