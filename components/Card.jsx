import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import Constants from '../constants/Styles'
import { useSelector } from 'react-redux'

const Card = ({ card, handleChoice, choiceOne, choiceTwo, disabled }) => {
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)

    const handleClick = () => {
        if (disabled) { return }
        handleChoice(card)
    }
    

    return (
        <Text style={[styles.card, card.matched && styles.cardMatched, card.matched && altColorTheme && styles.altShadow]}>
            {
                card.matched || card.id === choiceOne?.id || card.id === choiceTwo?.id ?
                    <TouchableOpacity style={[styles.cardBackWrapper, styles.cardFront, altColorTheme && styles.altBackground, altColorTheme && styles.altBorder, altColorTheme && styles.altCardFront]}>
                        <Text style={styles.cardText}>{card.front}</Text>
                    </TouchableOpacity> :
                    <TouchableOpacity style={[styles.cardBackWrapper, styles.cardBack, altColorTheme && styles.altBackground, altColorTheme && styles.altBorder]} onPress={handleClick}>
                        <Text style={styles.cardText}>{card.back}</Text>
                    </TouchableOpacity>
            }
        </Text>
    )
}

export default Card

const styles = StyleSheet.create({
    card: {
        margin: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },
    cardMatched: {
        shadowColor: Constants.colorPrimary,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },
    cardText: {
        fontSize: Constants.fontXxl,
    },
    cardBackWrapper: {
        width: 130,
        aspectRatio: 1,
        height: 130,
        backgroundColor: Constants.colorPrimaryDark,
        borderColor: Constants.colorPrimary,
        borderRadius: 8,
        borderWidth: 2,
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardFront: {
        cursor: 'default',
        pointerEvents: 'none',
        userSelect: 'none',
        backgroundColor: Constants.colorPrimary,
        borderColor: Constants.colorPrimaryDark,
    },
    cardBack: {
        userSelect: 'none'
    },
    /* for alt color theme */
    altShadow: {
        shadowColor: Constants.colorSecondary,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },
    altBackground: {
        backgroundColor: Constants.colorSecondaryDark,
    },
    altBorder: {
        borderColor: Constants.colorSecondary,
    },
    altCardFront: {
        backgroundColor: Constants.colorSecondary,
        borderColor: Constants.colorSecondaryDark,
    },
})