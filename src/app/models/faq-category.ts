import { Faq } from './faq'

export interface FaqCategory {
    id: number
    nameEn: string
    descriptionEn: string
    status?: 'active' | 'inactive'
    deleteStatus?: 'available' | 'deleted'
    created_at?: Date
    updated_at?: Date

    faq: Array<Faq>
}
