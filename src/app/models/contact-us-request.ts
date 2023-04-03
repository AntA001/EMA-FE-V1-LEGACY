export interface ContactUsRequest {
    id: number
    name: string
    phone: string
    email: string
    message: string
    status?: number
    deleteStatus?: 'available' | 'deleted'
    created_at?: Date
    updated_at?: Date
}
