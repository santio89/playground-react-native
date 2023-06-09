import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import uuid from 'react-native-uuid';
import Constants from '../constants/Styles.js';
import { LANGS } from '../constants/Langs.js';
import Card from '../components/Card';
import emojis from '../constants/Emojis.js';
import { storageSetItem } from '../utils/AsyncStorage.js';
import { setMemoScore } from '../store/actions/apps.action.js';

const MemoGame = ({ navigation }) => {
    const dispatch = useDispatch()
    const [cardPics, setCardPics] = useState([])
    const [cards, setCards] = useState([])
    const [turns, setTurns] = useState(0)
    const [choiceOne, setChoiceOne] = useState(null)
    const [choiceTwo, setChoiceTwo] = useState(null)
    const [disabled, setDisabled] = useState(false)
    const [winner, setWinner] = useState(false)
    const [startState, setStartState] = useState(false)

    const memoScore = useSelector(state => state.apps.memoGame.bestScore)
    const [bestScore, setBestScore] = useState(memoScore);


    const userId = useSelector(state => state.auth.userId)
    const altColorTheme = useSelector(state => state.settings.altColorTheme.enabled)
    const darkMode = useSelector(state => state.settings.darkMode.enabled)
    const { selected: languageSelected } = useSelector(state => state.settings.language)

    const [text, setText] = useState(LANGS.find(lang => lang.lang === languageSelected).text)

    const appLoading = useSelector(state => state.apps.isLoading)

    /* elijo emojis al azar */
    const selectEmojis = () => {
        const emojisArray = [...emojis]
        const newArray = []

        for (let i = 0; i < 6; i++) {
            const randomElement = emojisArray[Math.floor(Math.random() * emojisArray.length)];

            /* si ya existe en el array de cards, busco de nuevo */
            const found = newArray.find(card => card.front === randomElement)

            if (found) {
                i--
                continue;
            }
            newArray.push({ "front": randomElement, "back": "🔥", "matched": false })
        }
        setCardPics(newArray)
    }

    /* mezclar cards */
    const shuffleCards = () => {
        selectEmojis()
        /* duplico cards */
        const cards = [...cardPics, ...cardPics]
            /* mezclo al azar con sort */
            .sort(() => Math.random() - 0.5)
            /* retorno un array con ids unicas */
            .map(card => ({ ...card, id: uuid.v4() }))

        setStartState(true)
        setWinner(false)
        setCards(cards)
        setChoiceOne(null)
        setChoiceTwo(null)
        setDisabled(false)
        setTurns(0)
    }

    const handleChoice = (card) => {
        choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
    }

    const resetChoice = () => {
        setChoiceOne(null)
        setChoiceTwo(null)
        setTurns(turns => turns + 1)
        setDisabled(false)
    }

    useEffect(() => {
        selectEmojis()
    }, [])

    useEffect(() => {
        setBestScore(memoScore)
    }, [memoScore])

    useEffect(() => {
        if (choiceOne && choiceTwo) {
            setDisabled(true)
            if (choiceOne.front === choiceTwo.front) {
                setCards(cards => {
                    return cards.map(card => card.front === choiceOne.front ? { ...card, "matched": true } : card)
                })
                resetChoice()
            } else {
                setTimeout(() => { resetChoice() }, 1000)
            }
        }
    }, [choiceOne, choiceTwo])

    useEffect(() => {
        const everyMatch = cards.length > 0 && cards.every(card => card.matched === true)

        if (everyMatch) {
            setTimeout(() => {
                bestScore === "-" ? dispatch(setMemoScore(userId, turns, storageSetItem)) : (turns < bestScore && dispatch(setMemoScore(userId, turns, storageSetItem)))

                setWinner(true)
            }, 1000)
        }
    }, [cards])

    useEffect(() => {
        bestScore !== "-" && dispatch(setMemoScore(userId, bestScore, storageSetItem))
    }, [bestScore])

    useEffect(() => {
        setText(LANGS.find(lang => lang.lang === languageSelected).text)
    }, [languageSelected])

    useEffect(() => {
        navigation.setOptions({
            title: `${text.memoGame} | PLAYGROUND`,
        })
    }, [text])


    return (
        <View style={[styles.memoGameContainer, !darkMode && styles.backgroundWhite]}>
            <View style={[styles.gameContainer, !darkMode && styles.backgroundWhite]}>
                {
                    !startState ?
                        <>
                            <TouchableOpacity disabled={appLoading} onPress={shuffleCards}>
                                <Text style={[styles.newGame, altColorTheme && styles.altNewGame, , appLoading && { backgroundColor: 'gray', borderColor: 'dimgray' }]}>{text.newGame}</Text>
                            </TouchableOpacity>
                            <View style={styles.bestScore}><Text style={[styles.bestScoreText, !darkMode && styles.colorDark]}>{text.bestScore}: </Text><Text style={[styles.bestScoreNumber, altColorTheme && styles.altBestScoreNumber]}>{appLoading ? <ActivityIndicator size="small" color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} /> : bestScore}</Text></View>
                        </> :
                        <>
                            {winner === true ?
                                <>
                                    <View style={[styles.winner, altColorTheme && styles.altWinner]}>
                                        <Text style={{ fontSize: Constants.fontLg }}>🔥</Text>
                                        <Text style={styles.winnerText}>{text.completed}</Text>
                                        <View><Text style={styles.winnerButtonsTurns}>{text.turns}: {turns}</Text></View>
                                    </View>
                                    <View style={styles.winnerButtons}>
                                        <TouchableOpacity onPress={shuffleCards} style={styles.winnerButtonsWrapper}>
                                            <Text style={[styles.winnerButtonsText, altColorTheme && styles.altWinnerButtonsText]}>{text.newGame}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </> :
                                <>
                                    <View style={[styles.bestScore, { flexDirection: 'row' }]}><Text style={[styles.bestScoreText, { alignSelf: 'center' }, !darkMode && styles.colorDark]}>{text.bestScore}: </Text><Text style={[styles.bestScoreText, { fontSize: Constants.fontLg, fontFamily: Constants.fontPrimaryBold, color: Constants.colorPrimary, padding: 2 }, altColorTheme && { color: Constants.colorSecondary }]}>{appLoading ? <ActivityIndicator size="small" color={altColorTheme ? Constants.colorSecondary : Constants.colorPrimary} /> : bestScore}</Text></View>
                                    <View style={styles.turnsButtonsContainer}>
                                        <View style={[styles.turns, altColorTheme && styles.altTurns]}>
                                            <Text style={styles.turnsText}>{text.turns}: {turns}</Text>
                                        </View>

                                        <TouchableOpacity onPress={shuffleCards} style={[styles.turns, altColorTheme && styles.altTurns]}>
                                            <Text style={styles.turnsText}>{text.reset}</Text>
                                        </TouchableOpacity>

                                    </View>
                                    <View style={styles.cardsWrapper}>
                                        {
                                            <FlatList contentContainerStyle={styles.cardsContainer}
                                                data={cards}
                                                numColumns={4}
                                                renderItem={({ item }) => (
                                                    <Card card={item} handleChoice={handleChoice} choiceOne={choiceOne} choiceTwo={choiceTwo} disabled={disabled} />
                                                )}
                                                key={'-'}
                                                keyExtractor={card => ("-" + card.id)}
                                            />
                                        }
                                    </View>
                                </>}
                        </>
                }
            </View>
        </View>
    )
}


export default MemoGame

const styles = StyleSheet.create({
    memoGameContainer: {
        flex: 1,
        backgroundColor: Constants.colorDark,
        justifyContent: 'center',
        alignItems: 'center',
        color: Constants.colorWhite,
        width: '100%',
        /* padding: 10, */
    },
    gameContainer: {
        width: '100%',
        minWidth: 300,
        maxWidth: 800,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Constants.colorDark,
        flex: 1
    },
    newGame: {
        fontSize: Constants.fontXl,
        fontFamily: Constants.fontPrimaryBold,
        padding: 10,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: Constants.colorPrimaryDark,
        backgroundColor: Constants.colorPrimary,
        color: Constants.colorWhite,
        margin: 20,
        textAlign: 'center'
    },
    bestScore: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
        height: 38,
        minHeight: 38,
        maxHeight: 38
    },
    bestScoreText: {
        fontSize: Constants.fontMd,
        color: Constants.colorWhite,
        fontFamily: Constants.fontPrimary,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bestScoreNumber: {
        fontFamily: Constants.fontPrimaryBold,
        color: Constants.colorPrimary,
        fontSize: Constants.fontXl,
        height: 48,
        minHeight: 48,
        maxHeight: 48,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    winner: {
        padding: 10,
        borderRadius: 4,
        borderWidth: 8,
        borderColor: Constants.colorPrimaryDark,
        backgroundColor: Constants.colorPrimary,
        margin: 40,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        shadowColor: Constants.colorPrimary,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.8,
        shadowRadius: 16.00,
        elevation: 24,
    },
    winnerText: {
        display: 'flex',
        marginTop: 20,
        marginBottom: 20,
        fontSize: Constants.fontLg,
        color: Constants.colorWhite,
        fontFamily: Constants.fontPrimaryBold,
    },
    winnerButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
        minWidth: 320
    },
    winnerButtonsTurns: {
        fontSize: Constants.fontMd,
        padding: 10,
        color: Constants.colorWhite,
        fontFamily: Constants.fontPrimary,
    },
    winnerButtonsText: {
        fontSize: Constants.fontMd,
        padding: 10,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: Constants.colorPrimaryDark,
        backgroundColor: Constants.colorPrimary,
        color: Constants.colorWhite,
        margin: 4,
        fontFamily: Constants.fontPrimaryBold,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    winnerButtonsWrapper: {
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    turns: {
        borderRadius: 4,
        borderWidth: 2,
        borderColor: Constants.colorPrimaryDark,
        backgroundColor: Constants.colorPrimary,
        marginVertical: 4,
        marginLeft: '2%',
        marginRight: '2%',
        padding: 4,
        flex: 1,
        maxWidth: 140
    },
    turnsText: {
        color: Constants.colorWhite,
        fontFamily: Constants.fontPrimary,
        fontSize: Constants.fontMd,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    turnsButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: 380,
        minWidth: 320,
    },
    cardsWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    cardsContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1
    },
    /* for dark mode off */
    backgroundWhite: {
        backgroundColor: Constants.colorWhite
    },
    colorDark: {
        color: Constants.colorDark
    },
    /* for alt color theme */
    altNewGame: {
        borderColor: Constants.colorSecondaryDark,
        backgroundColor: Constants.colorSecondary,
    },
    altBestScoreNumber: {
        color: Constants.colorSecondary,
    },
    altWinner: {
        borderColor: Constants.colorSecondaryDark,
        backgroundColor: Constants.colorSecondary,
        shadowColor: Constants.colorSecondary,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },
    altWinnerButtonsText: {
        borderColor: Constants.colorSecondaryDark,
        backgroundColor: Constants.colorSecondary,
    },
    altTurns: {
        borderColor: Constants.colorSecondaryDark,
        backgroundColor: Constants.colorSecondary,
    },
})