import { DateTime } from "luxon"

export default interface Currency {
    currencyId: string
    currencyName: string
    isoCode: string
    exchangeRate: number
    createdAt: DateTime
    updatedAt: DateTime
}