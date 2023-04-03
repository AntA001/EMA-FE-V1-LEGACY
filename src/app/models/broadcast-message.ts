import { Category } from './category'
export interface BroadcastMessage {
    _id: number
    category_id: Category
    title: string
    message: string
    notification: boolean
    sms: boolean
    template: boolean
    createdAt?: Date
    updatedAt?: Date
}