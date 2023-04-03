import { Injectable, RendererFactory2, Renderer2, Inject } from '@angular/core'
import { Observable, BehaviorSubject, combineLatest } from 'rxjs'
import { DOCUMENT } from '@angular/common'

@Injectable({
    providedIn: 'root'
})
export class ThemeService {

    private _theme$: BehaviorSubject<string> = new BehaviorSubject<string>('dark')
    theme$: Observable<string> = this._theme$.asObservable()

    private _renderer: Renderer2
    private head: HTMLElement
    private themeLinks: HTMLElement[] = []

    // themeAndMode$: Observable<[string, boolean]>

    constructor(
        rendererFactory: RendererFactory2,
        @Inject(DOCUMENT) document: Document
    ) {
        this.head = document.head
        this._renderer = rendererFactory.createRenderer(null, null)
        // this.themeAndMode$ = combineLatest<BehaviorSubject<string>, BehaviorSubject<boolean>>([this._mainTheme$, this._darkMode$])
        this.theme$.subscribe(async (themeName: string) => {
            const cssExt = '.css'
            const cssFilename = themeName + cssExt
            await this.loadCss(cssFilename)
            if (this.themeLinks.length === 2) {
                this._renderer.removeChild(this.head, this.themeLinks.shift())
            }
        })
    }

    setTheme(name: string) {
        this._theme$.next(name)
        console.log('theme', name)
    }

    private async loadCss(filename: string) {
        return new Promise(resolve => {
            const linkEl: HTMLElement = this._renderer.createElement('link')
            this._renderer.setAttribute(linkEl, 'rel', 'stylesheet')
            this._renderer.setAttribute(linkEl, 'type', 'text/css')
            this._renderer.setAttribute(linkEl, 'href', filename)
            this._renderer.setProperty(linkEl, 'onload', resolve)
            this._renderer.appendChild(this.head, linkEl)
            this.themeLinks = [...this.themeLinks, linkEl]
        })
    }
}
