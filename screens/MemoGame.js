import { StyleSheet, Text, View, TouchableOpacity, FlatList, ScrollView, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import 'react-native-get-random-values'; /* for uuid */
import { v4 as uuidv4 } from 'uuid';
import Constants from '../constants/Styles.js';
import Card from '../components/Card';
import emojis from '../constants/Emojis.js';
import { storageGetItem, storageSetItem } from '../components/AsyncStorage.js';


const MemoGame = () => {
    const [cardPics, setCardPics] = useState([])
    const [cards, setCards] = useState([])
    const [turns, setTurns] = useState(0)
    const [choiceOne, setChoiceOne] = useState(null)
    const [choiceTwo, setChoiceTwo] = useState(null)
    const [disabled, setDisabled] = useState(false)
    const [winner, setWinner] = useState(false)
    const [startState, setStartState] = useState(false)
    const [bestScore, setBestScore] = useState("-");
    const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);


    /* storage-max score */
    const storeData = async (score) => {
        try {
            await storageSetItem("pg-mg-score", JSON.stringify(score));
        } catch (error) {
            console.log("error saving data to storage")
        }
    };

    const retrieveData = async () => {
        try {
            const value = await storageGetItem('pg-mg-score');
            if (value !== null) {
                setBestScore(JSON.parse(value))
            }
        } catch (error) {
            console.log("error retrieving data from storage")
        }
    };


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
            newArray.push({ "front": randomElement, "back": "⚛️", "matched": false })
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
            .map(card => ({ ...card, id: uuidv4() }))

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

    const updateWindowWidth = () => {
        setWindowWidth(Dimensions.get('window').width)
    }


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
                bestScore === "-" ? setBestScore(turns) : (turns < bestScore && setBestScore(turns))
                setWinner(true)
            }, 1000)
        }
    }, [cards])

    useEffect(() => {
        retrieveData()
        selectEmojis()
    }, [])

    useEffect(() => {
        storeData(bestScore)
    }, [bestScore])

    useEffect(() => {
        const dimensionsHandler = Dimensions.addEventListener("change", updateWindowWidth)

        return () => {
            dimensionsHandler.remove()
        }
    })

    return (
        <ScrollView contentContainerStyle={styles.memoGameContainer}>
            <View style={styles.gameContainer}>
                {
                    !startState ?
                        <>
                            <TouchableOpacity onPress={shuffleCards}>
                                <Text style={styles.newGame}>Nuevo Juego</Text>
                            </TouchableOpacity>
                            <View style={styles.bestScore}><Text style={styles.bestScoreText}>Mejor Score: </Text><Text style={styles.bestScoreNumber}>{bestScore}</Text></View>
                        </> :
                        <>
                            {winner === true ?
                                <>
                                    <Text style={styles.winner}>
                                        <Text>🔥</Text>
                                        <Text style={styles.winnerText}>COMPLETADO</Text>
                                        <View><Text style={styles.winnerButtonsTurns}>Turnos: {turns}</Text></View>
                                    </Text>
                                    <View style={styles.winnerButtons}>
                                        <TouchableOpacity onPress={shuffleCards} style={styles.winnerButtonsWrapper}>
                                            <Text style={styles.winnerButtonsText}>Nuevo Juego</Text>
                                        </TouchableOpacity>
                                    </View>
                                </> :
                                <>
                                    <View style={styles.bestScore}><Text style={styles.bestScoreText}>Mejor Score: </Text><Text style={styles.bestScoreNumber}>{bestScore}</Text></View>
                                    <View style={styles.turnsButtonsContainer}>
                                        <View style={styles.turns}>
                                            <Text style={styles.turnsText}>Turnos: {turns}</Text>
                                        </View>

                                        <TouchableOpacity onPress={shuffleCards} style={styles.turns}>
                                            <Text style={styles.turnsText}>Reset</Text>
                                        </TouchableOpacity>

                                    </View>
                                    {
                                        windowWidth > 800 ?
                                            <FlatList contentContainerStyle={styles.cardsContainer}
                                                data={cards}
                                                numColumns={4}
                                                renderItem={({ item }) => (
                                                    <Card card={item} handleChoice={handleChoice} choiceOne={choiceOne} choiceTwo={choiceTwo} disabled={disabled} />
                                                )}
                                                key={'-'}
                                                keyExtractor={card => ("-" + card.id)}
                                            />
                                            : <FlatList contentContainerStyle={styles.cardsContainer}
                                                data={cards}
                                                numColumns={2}
                                                renderItem={({ item }) => (
                                                    <Card card={item} handleChoice={handleChoice} choiceOne={choiceOne} choiceTwo={choiceTwo} disabled={disabled} />
                                                )}
                                                key={'#'}
                                                keyExtractor={card => ("#" + card.id)}
                                            />
                                    }
                                </>}
                        </>
                }
            </View>
        </ScrollView>
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
    },
    gameContainer: {
        padding: 10,
        width: '100%',
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
        borderWidth: 4,
        borderColor: Constants.colorPrimaryDark,
        backgroundColor: Constants.colorPrimary,
        color: Constants.colorWhite,
        margin: 20,
        textAlign: 'center'
    },
    bestScore: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    bestScoreText: {
        fontSize: Constants.fontMd,
        color: Constants.colorWhite,
        fontFamily: Constants.fontPrimary,
        alignSelf: 'flex-end',
    },
    bestScoreNumber: {
        fontFamily: Constants.fontPrimaryBold,
        color: Constants.colorPrimary,
        fontSize: Constants.fontXl
    },
    winner: {
        fontSize: Constants.fontLg,
        padding: 10,
        borderRadius: 4,
        borderWidth: 4,
        outlineColor: Constants.colorWhite,
        outlineWidth: 2,
        outlineStyle: "solid",
        borderColor: Constants.colorPrimaryDark,
        backgroundColor: Constants.colorPrimary,
        color: Constants.colorWhite,
        margin: 40,
        fontFamily: Constants.fontPrimaryBold,
        wordBreak: 'break-word',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        shadowColor: Constants.colorPrimary,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },
    winnerText: {
        display: 'flex',
        marginTop: 20,
        marginBottom: 20,
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
        borderWidth: 4,
        borderColor: Constants.colorPrimaryDark,
        backgroundColor: Constants.colorPrimary,
        color: Constants.colorWhite,
        margin: 4,
        fontFamily: Constants.fontPrimaryBold,
        wordBreak: 'break-word',
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
        borderWidth: 4,
        borderColor: Constants.colorPrimaryDark,
        backgroundColor: Constants.colorPrimary,
        margin: 10,
        padding: 10,
        flex: 1
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
        width: '40%',
        maxWidth: 400,
        minWidth: 320,
        marginBottom: 20
    },
    cardsContainer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
})