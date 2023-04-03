
export interface GuideArticle {
    _id: number
    title: string
    description: string
    image: string | null
    status?: 'active' | 'inactive'
    articleEN: string,
    articleAL: string,
    deleteStatus?: 'available' | 'deleted'
    createdAt?: Date
    updatedAt?: Date
}
