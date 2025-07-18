import NextAuth from 'next-auth';
import User from './User';
import Organisation from './Organisation';

declare module 'next-auth' {
    interface Session {
        user: User
        activeOrganisation : Organisation
    }
}