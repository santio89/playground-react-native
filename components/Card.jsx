import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'
import Constants from '../constants/Styles'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

const Card = ({ card, handleChoice, choiceOne, choiceTwo, disabled }) => {
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)

    const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);

    const handleClick = () => {
        if (disabled) { return }
        handleChoice(card)
    }

    const updateWindowWidth = () => {
        setWindowWidth(Dimensions.get('window').width)
    }

    useEffect(() => {
        const dimensionsHandler = Dimensions.addEventListener("change", updateWindowWidth)

        return () => {
            dimensionsHandler.remove()
        }
    })
    

    return (
        <Text style={[styles.card, card.matched && styles.cardMatched, card.matched && altColorTheme && styles.altShadow, windowWidth < 1400 && {margin: 6}]}>
            {
                card.matched || card.id === choiceOne?.id || card.id === choiceTwo?.id ?
                    <TouchableOpacity style={[styles.cardBackWrapper, styles.cardFront, altColorTheme && styles.altBackground, altColorTheme && styles.altBorder, altColorTheme && styles.altCardFront, windowWidth < 1400 && {width: 80, height: 80}]}>
                        <Text style={[styles.cardText, windowWidth < 1400 && {fontSize: Constants.fontXll}]}>{card.front}</Text>
                    </TouchableOpacity> :
                    <TouchableOpacity style={[styles.cardBackWrapper, styles.cardBack, altColorTheme && styles.altBackground, altColorTheme && styles.altBorder, windowWidth < 1400 && {width: 80, height: 80}]} onPress={handleClick}>
                        <Text style={[styles.cardText, windowWidth < 1400 && {fontSize: Constants.fontXll}]}>{card.back}</Text>
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
        width: 120,
        aspectRatio: 1,
        height: 120,
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