"use server";
import { auth } from "@/lib/auth"
 
export const signIn = async ({email, password}:{email:string, password: string}) => {
    if (!email||!password) {
        return {"success":false, "msg":"Empty fields"}}
        try {
            const val=await auth.api.signInEmail({
                body: {
                    email,
                    password,
                }
            })
            return {"success":true, "msg":"Signed in successfully.", val}
        } catch (error) {
           return {"success":false, "msg":"User not found. Try signing up."} 
        }
}

 

export const signUp = async ({email, password, name}:{email:string, password: string, name:string}) => {
    if (!email||!password||!name) {
        return {"success":false, "msg":"Empty fields"}}
        try {
            
            const res=await auth.api.signUpEmail({
                body: {
                    email,
                    password,
                    name
                }
            })
           return {"success":true, "msg":"Signed up successfully", res} 

        } catch (error) {
           return {"success":false, "msg":(error as {body:{message:string}}).body.message} 
        }
}