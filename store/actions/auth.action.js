export const SIGN_UP = "SIGN_UP"
export const LOG_IN = "LOG_IN"
export const LOG_OUT = "LOG_OUT"
export const REFRESH_TOKEN = "REFRESH_TOKEN"
export const UPDATE_USERNAME = "UPDATE_USERNAME"
export const UPDATE_AVATAR = "UPDATE_AVATAR"
import { URL_AUTH_SIGNUP, URL_AUTH_LOGIN, URL_AUTH_UPDATE, URL_AUTH_REFRESH } from "../../constants/Database"

export const signUp = (email, password, displayName, setEmailError, setModalVisible, setSignUpLoading, setValidInputs, setAccountCreatedModal, setAccountEmail, settings, setSettingsFirebase, setListItems, setMemoScore) => {

    return async dispatch => {
        setSignUpLoading(true)
        setValidInputs(false)

        try {
            const response = await fetch(URL_AUTH_SIGNUP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    displayName,
                    returnSecureToken: true
                })
            })

            if (!response.ok) {
                const errorResData = await response.json();
                const errorId = errorResData.error.message;
                let message = 'cant_register';

                if (errorId === 'EMAIL_EXISTS') {
                    message = 'email_exists';
                } else if (errorId === "TOO_MANY_ATTEMPTS_TRY_LATER") {
                    message = 'blocked_requests'
                }
                throw new Error(message);
            }

            const data = await response.json()

            /* envio a firebase configs default de usuario */
            dispatch(setSettingsFirebase(settings, data.localId))
            dispatch(setListItems(data.localId, []))
            dispatch(setMemoScore(data.localId, "-"))

            /* seteo modal */
            setAccountEmail(`${data.email}`)
            setAccountCreatedModal(true)

            dispatch({
                type: SIGN_UP,
                token: data.idToken,
                refreshToken: data.refreshToken,
                userId: data.localId,
                displayName: data.displayName.slice(2),
                avatar: [...data.displayName][0],
                email: data.email,
            })


        } catch (e) {
            if (e.message === 'email_exists') {
                setEmailError('email_exists');
                setModalVisible(true)
            } else if (e.message === 'blocked_requests') {
                setEmailError('blocked_requests');
                setModalVisible(true)
            }
        } finally {
            setSignUpLoading(false)
            setValidInputs(true)
        }
    }
}

export const logIn = (email, password, setLogInError, setModalVisible, setLogInLoading, setValidInput, setLogInSuccess, setAccountEmail) => {

    return async dispatch => {
        setLogInLoading(true)
        setValidInput(false)

        try {
            const response = await fetch(URL_AUTH_LOGIN, {
                method: 'POST',
                header: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken: true
                })
            })

            if (!response.ok) {
                const errorResData = await response.json();
                const errorId = errorResData.error.message;
                let message = 'cant_login';

                if (errorId === 'INVALID_PASSWORD' || 'EMAIL_NOT_FOUND') {
                    message = 'wrong_credentials';
                }
                throw new Error(message);
            }

            const data = await response.json()

            setAccountEmail(`${data.displayName.slice(2).toLocaleUpperCase()}\n${[...data.displayName][0]}`)
            setLogInSuccess(true);

            dispatch({
                type: LOG_IN,
                token: data.idToken,
                refreshToken: data.refreshToken,
                userId: data.localId,
                displayName: data.displayName.slice(2),
                avatar: [...data.displayName][0],
                email: data.email
            })


        } catch (e) {
            if (e.message === 'wrong_credentials') {
                setLogInError('wrong_credentials');
                setModalVisible(true)
            }
        } finally {
            setLogInLoading(false)
            setValidInput(true)
        }
    }
}

export const logOut = () => {

    return dispatch => {
        dispatch({ type: LOG_OUT })
    }
}

export const refreshToken = (refresh_token) => {

    return async dispatch => {

        try {
            const response = await fetch(URL_AUTH_REFRESH, {
                method: 'POST',
                header: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    grant_type: 'refresh_token',
                    refresh_token
                })
            })

            if (!response.ok) {
                const errorResData = await response.json();
                const errorId = errorResData.error.message;
                let message = 'cant_refresh__';

                throw new Error(message + errorId);
            }

            const data = await response.json()


            dispatch({
                type: REFRESH_TOKEN,
                token: data.id_token,
                refreshToken: data.refresh_token,
            })


        } catch (e) {
            console.log("error refreshing token: ", e)
        }
    }
}

export const updateUsername = (token, username, setUpdateUsernameLoading, setUsernameModal, dispatchRefreshToken, getAuthToken) => {

    return async dispatch => {
        setUpdateUsernameLoading(true)

        try {
            let flag = true
            let response = null
            let tok = token
            while (flag) {
                response = await fetch(URL_AUTH_UPDATE, {
                    method: 'POST',
                    header: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        idToken: tok,
                        displayName: username
                    })
                })

                if (!response.ok) {
                    const errorResData = await response.json();
                    const errorId = errorResData.error.message;
                    let message = 'cant_update_user__';

                    if (errorId === 'INVALID_ID_TOKEN') {
                        dispatchRefreshToken()
                        tok = getAuthToken()
                    } else {
                        throw new Error(message + errorId);
                    }
                } else {
                    flag = false
                }
            }

            const data = await response.json()

            dispatch({
                type: UPDATE_USERNAME,
                displayName: data.displayName.slice(2),
            })


        } catch (e) {
            console.log("error updating user: ", e)
        } finally {
            setUpdateUsernameLoading(false)
            setUsernameModal(false)
        }

    }
}

export const updateAvatar = (token, username, setAvatarModal, setUpdateAvatarLoading, dispatchRefreshToken, getAuthToken) => {

    return async dispatch => {
        setUpdateAvatarLoading(true)

        try {
            let flag = true
            let response = null
            let tok = token
            while (flag) {
                response = await fetch(URL_AUTH_UPDATE, {
                    method: 'POST',
                    header: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        idToken: tok,
                        displayName: username
                    })
                })

                if (!response.ok) {
                    const errorResData = await response.json();
                    const errorId = errorResData.error.message;
                    let message = 'cant_update_user__';

                    if (errorId === 'INVALID_ID_TOKEN') {
                        dispatchRefreshToken()
                        tok = getAuthToken()
                    } else {
                        throw new Error(message, e);
                    }
                } else {
                    flag = false
                }
            }

            const data = await response.json()

            dispatch({
                type: UPDATE_AVATAR,
                avatar: [...data.displayName][0],
            })


        } catch (e) {
            console.log("error updating user: ", e)
        } finally {
            setAvatarModal(false)
            setUpdateAvatarLoading(false)
        }

    }
}

