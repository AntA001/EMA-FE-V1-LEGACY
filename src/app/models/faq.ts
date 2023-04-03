export interface Faq {
    id: number
    faqCategoryId: number
    questionEn: string
    answerEn: string
    collapse: boolean
    status?: 'active' | 'inactive'
    deleteStatus?: 'available' | 'deleted'
    created_at?: Date
    updated_at?: Date
}
