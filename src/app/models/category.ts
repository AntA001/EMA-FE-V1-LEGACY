export interface Category {
    _id: number
    nameEN: string
    nameAL: string
    nameEL: string
    nameBG: string
    nameMK: string
    status: string
    locked: boolean
    password: string
    confirmPassword: string
    createdAt?: Date
    updatedAt?: Date
}
