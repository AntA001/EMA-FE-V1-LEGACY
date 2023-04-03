
export interface News {
    _id: number
    titleEN: string
    descriptionEN: string
    titleAL: string
    descriptionAL: string
    image: string | null
    status?: 'active' | 'inactive'
    deleteStatus?: 'available' | 'deleted'
    createdAt?: Date
    updatedAt?: Date
}
