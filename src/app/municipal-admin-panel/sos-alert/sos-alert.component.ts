import { User } from 'src/app/models/user'
import { Pagination, Resp } from 'src/app/interfaces/response'
import { ApiService } from 'src/app/services/api.service'
import { Router, ActivatedRoute } from '@angular/router'
import { IAlertService } from 'src/app/libs/ialert/ialerts.service'
import { UIHelpers } from 'src/app/helpers/ui-helpers'
import { DataService } from './data.service'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { Component, TemplateRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core'
import { Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { SosAlert } from 'src/app/models/sos-alert'
import { Loader } from '@googlemaps/js-api-loader'
import { apis } from 'src/environments/environment'
import moment from 'moment'
import { TranslateService } from '@ngx-translate/core'
import { io } from 'socket.io-client'


@Component({
    selector: 'app-sos-alert',
    templateUrl: './sos-alert.component.html',
    styleUrls: ['./sos-alert.component.css']
})
export class SosAlertComponent implements OnInit, OnDestroy, AfterViewInit {
    sosList: Array<SosAlert> = []
    sos: any = ''
    fireEnum: any = {
        gr: 'Φωτιά',
        en: 'fire',
        al: 'zjarrit',
        mk: 'оган',
        bg: 'огън'
    }
    testEnum: any = {
        gr: 'δοκιμή',
        en: 'test',
        al: 'provë',
        mk: 'тест',
        bg: 'тест'
    }
    healthEnum: any = {
        gr: 'υγεία',
        en: 'health',
        al: 'shëndetin',
        mk: 'здравје',
        bg: 'здраве'
    }
    policeEnum: any = {
        gr: 'αστυνομία',
        en: 'police',
        al: 'policia',
        mk: 'полицијата',
        bg: 'полиция'
    }
    modalRef: BsModalRef
    lang: any
    selectedIndex: number
    lat: any = 33.551597
    lng: any = 73.12312
    map: google.maps.Map
    dataStatus = 'fetching'
    pagination: Pagination<any>
    markerDataTemplate: TemplateRef<any>
    modalTitle = ''
    socket: any = ''
    filters = {
        name: '',
        page: 1,
        perPage: 15
    }
    loaderOptions = {
        rows: 5,
        cols: 9,
        colSpans: {
            0: 1
        }
    }
    waiting: {
        search: boolean
        save: boolean
        messageStatus: Array<any>
    }
    breadCrum = [
        {
            link: '/municipal/sos-alert',
            value: 'Sos Alert'
        }
    ]
    SOCKET_ENDPOINT: any = `${apis.socketUrl}`

    searchKeyword = ''
    searchKeyword$: Subject<string> = new Subject<string>()
    searchKeywordSub: any

    constructor(
        public ds: DataService,
        private alert: IAlertService,
        public ui: UIHelpers,
        private route: ActivatedRoute,
        private router: Router,
        private ms: BsModalService,
        public ts: TranslateService,
        public api: ApiService,

    ) {

        this.lang = this.api.translate('municipal-admin.sos-Alert')
        this.lang.subscribe((d: any) => {
            this.lang = d
        })
        this.waiting = {
            search: false,
            save: false,
            messageStatus: []
        }

        this.route.queryParams.subscribe((params) => {
            if (params.page) {
                this.filters.page = params.page
            }
            if (params.perPage) {
                this.filters.perPage = params.perPage
            }
            if (params.name) {
                this.filters.name = params.name
            }
            if (params) {
                this.search()
            }
        })
    }

    ngOnInit(): void {
        this.socketconnection()
        this.searchKeywordSub = this.searchKeyword$
            .pipe(debounceTime(1000), distinctUntilChanged())
            .subscribe((searchKeyword) => {
                this.filters.page = 1
                this.search()
            })
    }

    ngAfterViewInit(): void {
        this.initMap()
        this.socket.emit('joinSOSChannel', {
            channelId: this.api.user.municipality._id,
        });
    }

    socketconnection() {
        this.socket = io(this.SOCKET_ENDPOINT);
        this.socket.on('sosAlert', (message: any) => {
            this.sosList.unshift(message)

        })
    }

    ngOnDestroy(): void {
        this.searchKeywordSub.unsubscribe()
        this.socket.emit('leaveSOSChannel', { channelId: this.api.user.municipality._id })

    }

    searchKeywordChange(value: string) {
        this.searchKeyword$.next(value)
    }

    setPagination(page: number) {
        this.filters.page = page
        this.router.navigate(['/municipal/sos-alert'], {
            queryParams: this.filters,
            replaceUrl: true
        })
    }

    sosType(type: any) {
        const lang = this.ts.currentLang
        if (type === 'health') {
            switch (lang) {
                case 'en':
                    this.sos = this.healthEnum.en
                    break;
                case 'gr':
                    this.sos = this.healthEnum.gr
                    break;
                case 'al':
                    this.sos = this.healthEnum.al
                    break;
                case 'mk':
                    this.sos = this.healthEnum.mk
                    break;
                case 'bg':
                    this.sos = this.healthEnum.bg
                    break;
                default:
                    this.healthEnum.en
            }
        } else if (type === 'fire') {
            switch (lang) {
                case 'en':
                    this.sos = this.fireEnum.en
                    break;
                case 'gr':
                    this.sos = this.fireEnum.gr
                    break;
                case 'al':
                    this.sos = this.fireEnum.al
                    break;
                case 'mk':
                    this.sos = this.fireEnum.mk
                    break;
                case 'bg':
                    this.sos = this.fireEnum.bg
                    break;
                default:
                    this.sos = this.fireEnum.en
            }

        } else if (type === 'test') {
            switch (lang) {
                case 'en':
                    this.sos = this.testEnum.en
                    break;
                case 'gr':
                    this.sos = this.testEnum.gr
                    break;
                case 'al':
                    this.sos = this.testEnum.al
                    break;
                case 'mk':
                    this.sos = this.testEnum.mk
                    break;
                case 'bg':
                    this.sos = this.testEnum.bg
                    break;
                default:
                    this.sos = this.testEnum.en
            }

        } else {
            switch (lang) {
                case 'en':
                    this.sos = this.policeEnum.en
                    break;
                case 'gr':
                    this.sos = this.policeEnum.gr
                    break;
                case 'al':
                    this.sos = this.policeEnum.al
                    break;
                case 'mk':
                    this.sos = this.policeEnum.mk
                    break;
                case 'bg':
                    this.sos = this.policeEnum.bg
                    break;
                default:
                    this.sos = this.policeEnum.en
            }
        }
        return this.sos

    }

    search(): void {
        this.waiting.messageStatus = []
        this.waiting.search = true
        this.filters.name = this.searchKeyword
        this.ds.getList(this.filters).subscribe((resp: Resp<Array<SosAlert>>) => {
            this.waiting.search = false
            if (resp.success === true) {
                this.sosList = resp?.data as Array<SosAlert> || []
                // this.pagination = resp.data as Pagination<any>
                this.dataStatus = 'done'
            }
        })
    }

    openModal(modal: TemplateRef<any>, index: number): void {
        if (this.sosList[index].new === true) {
            console.log(this.sosList[index].new);
            this.ds.newInfo(this.sosList[index]._id).subscribe((resp: Resp<Array<SosAlert>>) => {
                if (resp.success) {
                    console.log('oky');
                    this.sosList[index].new = false
                    console.log(this.sosList[index].new);

                }
            })
        }


        this.initMap()
        this.selectedIndex = index
        this.lat = this.sosList[this.selectedIndex].lat
        this.lng = this.sosList[this.selectedIndex].lng
        this.modalRef = this.ms.show(modal, {
            class: 'modal-lg modal-dialog-centered back-office-panel',
            backdrop: 'static',
            ignoreBackdropClick: true,
            keyboard: false
        })
    }

    initMap() {
        const loader = new Loader({
            apiKey: apis.googleApiKey,
            version: 'weekly',
            libraries: ['drawing', 'places']
        })

        loader.load().then(() => {
            this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
                center: new google.maps.LatLng(this.lat, this.lng),
                zoom: 12

            })

            const currentlatlng = { lat: this.lat, lng: this.lng }
            console.log('currentlatlng', currentlatlng)
            const marker = new google.maps.Marker({
                position: currentlatlng,
                map: this.map,
                icon: {
                    url: '/assets/images/map-pointer-arrow-down-red.png',
                    scaledSize: new google.maps.Size(30, 30), // scaled size
                    origin: new google.maps.Point(0, 0), // origin
                    anchor: new google.maps.Point(0, 0) // anchor
                }
            })
        })
    }

    getDifference(date: any) {
        return moment(date).format('DD/MM/YYYY') + ' ' + moment(date).format('LT')
    }

}

