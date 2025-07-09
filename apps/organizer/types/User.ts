import { DateTime } from 'luxon'
import type Organisation from './Organisation';
export default interface User {
    accessToken: string
    userId: string;
    firstName: string
    lastName: string
    email: string
    gender: string
    phoneNumber: string
    profileImageUrl: string | undefined
    country: string
    state: string
    city: string
    dateOfBirth: DateTime
    verificationToken: string
    tokenExpiresAt  : DateTime
    resendCount : number
    lastResendAt : DateTime
    isVerified : boolean
    createdAt : DateTime
    updatedAt : DateTime
    organisations : Organisation[]

};