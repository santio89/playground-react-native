export const SIGN_UP = "SIGN_UP"
import { URL_AUTH_SIGNUP } from "../../constants/Database"

export const signUp = (email, password, setEmailError, setModalVisible, setSignUpLoading, setValidInputs, setAccountCreatedModal, setAccountEmail) => {

    return async dispatch => {
        setSignUpLoading(true)
        setValidInputs(false)

        try {
            const response = await fetch(URL_AUTH_SIGNUP, {
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
                let message = 'cant_register';

                if (errorId === 'EMAIL_EXISTS') {
                    message = 'email_exists';
                } else if (errorId === "TOO_MANY_ATTEMPTS_TRY_LATER") {
                    message = 'blocked_requests'
                }
                throw new Error(message);
            }

            const data = await response.json()
            setAccountEmail(email)
            setAccountCreatedModal(true);
            dispatch({
                type: SIGN_UP,
                token: data.idToken,
                userId: data.localId
            })

  
        } catch (e) {
            if (e.message === 'email_exists') {
                setEmailError('email_exists');
                setModalVisible(true)
            } else if (e.message === 'blocked_requests') {
                setEmailError('blocked_requests');
                setModalVisible(true)
            }
        } finally{
            setSignUpLoading(false)
            setValidInputs(true)
        }
    }
}