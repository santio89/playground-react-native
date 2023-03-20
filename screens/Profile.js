import { StyleSheet, Text, ScrollView, View, Image } from 'react-native'
import Constants from '../constants/Styles.js'
import { useState } from 'react'

const Profile = () => {
    /* estado de prueba */
    const [user, setUser] = useState({
        email: "correotest@gmail.com",
        nombre: "Nombre Test",
        avatar: "https://source.unsplash.com/random/"
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
                    <Text style={styles.profileItemLabel}><Text style={styles.profileItemIndicator}>●&nbsp;</Text><Text>Avatar: </Text></Text>
                    <Image
                        style={styles.profileItemImage}
                        source={{uri: user.avatar}}
                    />
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
        width: '100%',
        minWidth: 300,
        maxWidth: 800,
        padding: 20,
        paddingBottom: 0,
        backgroundColor: Constants.colorPrimary,
        borderRadius: 8,
        borderWidth: 4,
        borderColor: Constants.colorPrimaryDark,
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
    },
    profileItemImage: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
        borderRadius: 4,
        marginTop: 8
    }
})