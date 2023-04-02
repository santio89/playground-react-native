export const SIGN_UP = "SIGN_UP"

export const signUp = (email, password) =>({
    type: SIGN_UP,
    payload: {email, password}
})