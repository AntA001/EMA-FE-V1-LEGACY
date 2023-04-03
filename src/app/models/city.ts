import { State } from './state'

export interface City {
    id: number
    stateId: number
    fullName: string
    shortName: string
    code: string
    status?: 'active' | 'inactive'
    deleteStatus?: 'available' | 'deleted'
    created_at?: Date
    updated_at?: Date
    state: State
}
