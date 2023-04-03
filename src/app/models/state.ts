import { Country } from './country'

export interface State {
    id: number
    countryId: number
    fullName: string
    shortName: string
    code: string
    status?: 'active' | 'inactive'
    deleteStatus?: 'available' | 'deleted'
    created_at?: Date
    updated_at?: Date
    country: Country
}
