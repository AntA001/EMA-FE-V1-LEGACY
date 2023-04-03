import { Category } from './category'
import { Municipal } from 'src/app/models/municipal'
import { Country } from './country'

export interface User {
    _id: number
    name: string
    email: string
    phoneNo: string
    password: string
    image: string
    category: Category
    municipality: Municipal
    userType: 'municipal-admin' | 'admin' | 'user'
    municipalAdminType: string
    fcmToken: string
    token: string
    step: number
    country: Country
    lastLogin?: Date
    createdAt?: Date
    updatedAt?: Date
}