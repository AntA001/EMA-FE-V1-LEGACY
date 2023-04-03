import { Municipal } from './municipal'

export interface MapPoint {
    _id: string
    category_id: string,
    lat: number,
    lng: number,
    nameEN: string,
    nameAL?: string,
    addressEN?: string,
    addressAL?: string,
    phoneNo: string,
    status?: string,
    createdAt?: Date
    updatedAt?: Date
    municipality: Municipal,
}
