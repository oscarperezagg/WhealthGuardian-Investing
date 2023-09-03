import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import {connect} from '@/lib/mongodb'
import User from '@/models/user'
import { th } from "date-fns/locale";
import bcrypt from 'bcryptjs'

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "email", placeholder: "m@example.com" },
                password: { label: "Password", type: "password", placeholder: "********" }
            },
            async authorize(credentials, req) {
                await connect()
                console.log(credentials)

                const userFound = await User.findOne({ email: credentials?.email }).select('+password')
                console.log(userFound)
                if (!userFound) throw new Error('Invalid credentials')

                const passwordMatch =await bcrypt.compare(credentials!.password, userFound.password)

                if (!passwordMatch) throw new Error('Invalid credentials')

                console.log(userFound)

                return userFound
            }
        })
    ],
    callbacks: {
        jwt({ account, token, user, profile, session }) {
            if (user) token.user = user;
            return token;
        },
        session({ session, token }) {
            session.user = token.user as any;
            return session;
        }
    },
    pages: {
        signIn: '/login',
        newUser: '/signup',
    }
    
})


export { handler as GET, handler as POST }