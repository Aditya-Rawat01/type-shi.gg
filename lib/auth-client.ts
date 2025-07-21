import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */

    /*not needed as i am already using the nextjs, same domain for fe and be*/
    baseURL: "http://localhost:3000"
})
//localhost