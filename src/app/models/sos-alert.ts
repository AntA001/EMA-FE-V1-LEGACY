import { User } from './user'

export interface SosAlert {
    _id: number
    lat: string
    lng: string
    type?: string
    new?: boolean
    user: User
    createdAt?: Date
    updatedAt?: Date
}
