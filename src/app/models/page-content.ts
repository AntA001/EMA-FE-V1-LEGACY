export interface PageContent {
    id: number
    route: string
    contentEn: string
    deleteStatus?: 'available' | 'deleted'
    created_at?: Date
    updated_at?: Date
}
