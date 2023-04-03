export interface Menu {
    title: string
    link?: string
    icon?: string
    active?: boolean
    queryParams?: { }
    badge?: {
        class: string
        text: string
    },
    visibility?: string,
    type: 'simple' | 'dropdown' | 'header',
    submenus?: Array<Menu>
}
