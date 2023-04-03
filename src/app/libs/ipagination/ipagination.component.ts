import {
    Component,
    OnInit,
    AfterViewInit,
    Output,
    Input,
    EventEmitter,
    ElementRef,
    ViewChild,
    OnChanges
} from '@angular/core'
import { Pagination } from 'src/app/interfaces/response'

@Component({
    selector: 'app-ipagination',
    templateUrl: './ipagination.component.html',
    styleUrls: ['./ipagination.component.css']
})
export class IPaginationComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() pagination: Pagination
    @Input() activePage: number = 1
    @Input() fontSize: number = 12
    @Input() fontColor: string = '#fff'
    @Input() buttonColor: string = ''
    @Input() currentPageLabel: boolean = true
    @Input() reqMaxButtons: number = 10

    @Output()
    public pageChangeEvent = new EventEmitter()

    @ViewChild('paginationContainer', { static: false })
    paginationContainer: ElementRef
    paginationContainerWidth: number
    labelWidth = 100
    sameLineLabel = false
    baseWidth = 107.53
    perButtonWidth = 31.92

    // logic controllers
    maxButtons = 10
    buttonOffset = 0
    firstButton = 1
    lastButton = 1

    constructor(private elementRef: ElementRef) {
        // code here
    }

    ngOnInit() {
        this.elementRef.nativeElement.style.setProperty('--font-size', this.fontSize + 'px')
        this.elementRef.nativeElement.style.setProperty('--font-color', this.fontColor)
        this.elementRef.nativeElement.style.setProperty('--button-color', this.buttonColor)
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.paginationContainerWidth = (
                this.paginationContainer.nativeElement as HTMLElement
            ).offsetWidth
            this.maxButtons = Math.floor(
                (this.paginationContainerWidth - this.baseWidth) / (this.perButtonWidth - 1)
            )

            const sameLineButtons = Math.floor(
                (this.paginationContainerWidth - this.baseWidth - this.labelWidth) /
                    this.perButtonWidth
            )

            if (sameLineButtons > 5) {
                this.sameLineLabel = true
            }

            this.setbuttons()
        }, 100)
    }

    printDetails(msg: string) {
        console.log('-----------' + msg + '-----------')
        console.log('this.firstButton', this.firstButton)
        console.log('this.lastButton', this.lastButton)
        console.log('this.buttonOffset', this.buttonOffset)
        console.log('this.activePage', this.activePage)
        console.log('this.maxButtons', this.maxButtons)
    }

    setbuttons() {
        this.maxButtons = this.maxButtons > this.reqMaxButtons ? this.reqMaxButtons : this.maxButtons
        this.maxButtons =
            this.maxButtons > this.pagination.last_page
            ? this.pagination.last_page
            : this.maxButtons
        this.buttonOffset = this.maxButtons - 1

        let intervalLastButton = this.buttonOffset === 0 ? 1 : this.buttonOffset
        let i = 0
        while (this.activePage > intervalLastButton) {
            intervalLastButton += this.buttonOffset
            i++
        }

        this.firstButton = (i * this.buttonOffset) === 0 ? 1 : (i * this.buttonOffset)
        this.lastButton =
            (this.firstButton + this.buttonOffset) < this.pagination.last_page
                ? (this.firstButton + this.buttonOffset)
                : this.pagination.last_page - 1
        // this.printDetails('----------- setButtons() -----------')
    }

    changePage(newPageNumber: number): void {
        this.activePage = newPageNumber
        this.setbuttons()
        this.pageChangeEvent.emit(newPageNumber)
        // this.printDetails('----------- changePage() -----------')
    }

    getPages(): Array<number> {
        const pages: Array<number> = []
        for (let i = this.firstButton; i < this.lastButton; i++) {
            pages.push(i)
        }
        // this.printDetails('----------- getButtons() -----------')
        return pages
    }

    ngOnChanges() {
        this.maxButtons = 10
        this.buttonOffset = 0
        this.firstButton = 1
        this.lastButton = 1
        this.setbuttons()
    }
}
