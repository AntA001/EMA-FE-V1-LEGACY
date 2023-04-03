export interface Resp<T = void> {
    success: boolean
    data?: T
    message?: string
    errors?: {
        general: string
    }
}

export interface Pagination<T = void | any> {
    from: number
    to: number
    per_page: number
    total: number
    prev_page_url: string | null
    next_page_url: string | null
    last_page: number
    data: Array<T>
}
