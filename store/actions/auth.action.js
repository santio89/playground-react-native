export const SIGN_UP = "SIGN_UP"
export const LOG_IN = "LOG_IN"
import { URL_AUTH_SIGNUP } from "../../constants/Database"
import { URL_AUTH_LOGIN } from "../../constants/Database"

export const signUp = (email, password, displayName, setEmailError, setModalVisible, setSignUpLoading, setValidInputs, setAccountCreatedModal, setAccountEmail, settings, setSettingsFirebase) => {

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

            /* envio a firebase settings actuales como default del usuario */
            dispatch(setSettingsFirebase(settings, data.localId))

            /* seteo modal */
            setAccountEmail(`${data.email}\n${data.displayName}`)
            setAccountCreatedModal(true)

            dispatch({
                type: SIGN_UP,
                token: data.idToken,
                userId: data.localId,
                displayName: data.displayName
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

            setAccountEmail(data.displayName)
            setLogInSuccess(true);

            dispatch({
                type: LOG_IN,
                token: data.idToken,
                userId: data.localId,
                displayName: data.displayName
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