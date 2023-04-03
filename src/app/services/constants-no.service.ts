import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root'
})
export class ConstantsServiceNo {
    public static EDITOR_CONFIG = {
        editable: true,
        spellcheck: false,
        height: 'auto',
        minHeight: '500',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        translate: 'yes',
        enableToolbar: true,
        showToolbar: true,
        placeholder: 'Enter your Content Here',
        defaultParagraphSeparator: '',
        defaultFontName: 'calibri',
        defaultFontSize: '12',
        fonts: [
            { class: 'arial', name: 'Arial' },
            { class: 'times-new-roman', name: 'Times New Roman' },
            { class: 'calibri', name: 'Calibri' },
            { class: 'comic-sans-ms', name: 'Comic Sans MS' }
        ],
        // uploadUrl: 'v1/image',
        uploadWithCredentials: false,
        sanitize: true,
        toolbarPosition: 'top',
        toolbarHiddenButtons: [
            [
                'customClasses',
                'insertVideo',
                'insertHorizontalRule',
                'removeFormat',
                'fontName'
                // 'toggleEditorMode'
            ]
        ]
    }

    public static USER_ROLES = {
        ADMIN: 'admin',
        CUSTOMER: 'customer'
    }

    public LANGUAGES = {
        en: 'English',
        no: 'Norwegian'
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
    public DATE_TIME_FORMAT = {
        PRINT_DATE: 'MMMM Do YYYY, h:mm A',
        CHAR_DATE: 'MMM DD, YYYY',
        INVOICE_MONTH: 'MMM YYYY',
        INVOICE_DATE: 'MMM DD, YYYY HH:mm',
        SHORT_DATE: 'DD-MM-YYYY',
        DATE: 'dddd, MMMM DD, YYYY',
        TIME: 'HH:mm',
        DATE_TIME: 'dddd, MMMM DD, YYYY hh:mm A',
        AM_PM: 'HH:mm A',
        DOC_DATE: 'DD MMM, YYYY',
        DATE_AMPM: 'DD MMM, YYYY, h a'
    }
}
