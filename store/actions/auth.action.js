export const SIGN_UP = "SIGN_UP"
export const LOG_IN = "LOG_IN"
export const LOG_OUT = "LOG_OUT"
export const UPDATE_USERNAME = "UPDATE_USERNAME"
export const UPDATE_AVATAR = "UPDATE_AVATAR"
import { URL_AUTH_SIGNUP } from "../../constants/Database"
import { URL_AUTH_LOGIN } from "../../constants/Database"
import { URL_AUTH_UPDATE } from "../../constants/Database"

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

export const updateUsername = (username, updateUsernameLoading) => {
    updateUsernameLoading(true)
    userValidInput(false)

    return async dispatch => {
        try {
            const response = await fetch(URL_AUTH_UPDATE, {
                method: 'POST',
                header: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    displayName: username
                })
            })

            if (!response.ok) {
                const errorResData = await response.json();
                const errorId = errorResData.error.message;
                let message = 'cant_update_user';

                if (errorId === 'INVALID_ID_TOKEN') {
                    message = 'invalid_id_token';
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
            console.log("error updating user: ", e)
        } finally {
            updateUsernameLoading(false)
            userValidInput(true)
        }

    }
}

export const updateAvatar = (avatar, updateAvatarLoading) => {
    updateAvatarLoading(true)
    avatarValidInputs(false)

    return async dispatch => {
        try {
            const response = await fetch(URL_AUTH_UPDATE, {
                method: 'POST',
                header: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    displayName: avatar
                })
            })

            if (!response.ok) {
                const errorResData = await response.json();
                const errorId = errorResData.error.message;
                let message = 'cant_update_user';

                if (errorId === 'INVALID_ID_TOKEN') {
                    message = 'invalid_id_token';
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
            console.log("error updating user: ", e)
        } finally {
            updateUsernameLoading(false)
            userValidInput(true)
        }
    }
}