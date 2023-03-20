import { StyleSheet, Text, ScrollView, View } from 'react-native'
import { useState } from 'react'
import Constants from '../constants/Styles.js'

const Profile = () => {
    /* estado de prueba */
    const [user, setUser] = useState({
        email: "correotest@gmail.com",
        nombre: "Nombre Test",
        edad: 99,
    })
    return (
        <ScrollView contentContainerStyle={styles.profileContainer}>
            <View style={styles.itemsContainer}>
                <View style={styles.profileItem}>
                    <Text style={styles.profileItemLabel}><Text style={styles.profileItemIndicator}>●&nbsp;</Text><Text>Correo: </Text></Text>
                    <Text style={styles.profileItemText}>{user.email}</Text>
                </View>
                <View style={styles.profileItem}>
                    <Text style={styles.profileItemLabel}><Text style={styles.profileItemIndicator}>●&nbsp;</Text><Text>Nombre: </Text></Text>
                    <Text style={styles.profileItemText}>{user.nombre}</Text>
                </View>
                <View style={styles.profileItem}>
                    <Text style={styles.profileItemLabel}><Text style={styles.profileItemIndicator}>●&nbsp;</Text><Text>Edad: </Text></Text>
                    <Text style={styles.profileItemText}>{user.edad}</Text>
                </View>
            </View>
        </ScrollView>
    )
}

export default Profile

const styles = StyleSheet.create({
    profileContainer: {
        flex: 1,
        backgroundColor: Constants.colorDark,
        justifyContent: 'center',
        alignItems: 'center',
        color: Constants.colorWhite,
        width: '100%',
        padding: 10
    },
    itemsContainer: {
        minWidth: 300,
        maxWidth: 800,
        padding: 20,
        paddingBottom: 10,
        backgroundColor: Constants.colorPrimary,
        borderRadius: 8,
        borderWidth: 4,
        borderColor: Constants.colorPrimaryDark
    },
    profileItemIndicator: {
        fontFamily: Constants.fontPrimaryBold,
        fontSize: Constants.fontMd,
        color: Constants.colorPrimaryDark,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },  
    profileItem: {
        marginBottom: 20,
        justifyContent: 'start',
        alignItems: 'start'
    },
    profileItemLabel: {
        fontFamily: Constants.fontPrimary,
        fontSize: Constants.fontMd,
        color: Constants.colorWhite,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    profileItemText: {
        fontFamily: Constants.fontPrimaryBold,
        fontSize: Constants.fontMd,
        color: Constants.colorDark,
    }
})