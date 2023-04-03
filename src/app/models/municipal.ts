import { Country } from './country'
import { LocationCategory } from './location-category'

export interface Municipal {
    _id: number
    nameEN: string
    nameAL: string
    maxSmsCount: number
    smsCount: number
    status: string
    country: Country
    facebookLink: string
    twitterLink: string
    webLink: string
    instagramLink: string
    youtubeLink?: string
    createdAt?: Date
    updatedAt?: Date
    locationCategories : Array <LocationCategory>
}
