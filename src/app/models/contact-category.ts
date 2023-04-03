export interface ContactCategory {
        _id: number
        nameEN: string
        nameAL: string
        nameEL: string
        nameBG: string
        nameMK: string
        defaultCategory: boolean
        color: string
        status: string
        locked?: boolean
        password?: string
        confirmPassword?: string
        createdAt?: Date
        updatedAt?: Date

}
