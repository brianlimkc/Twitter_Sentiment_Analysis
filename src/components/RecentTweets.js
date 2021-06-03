import React, {useReducer} from 'react';
import axios from "axios";
import ShowTweets from "./ShowTweets";

require('dotenv').config()


let Sentiment = require('sentiment');
let sentiment = new Sentiment();
const searchURL = "/api/recent/"

const reducer = (state, action) => {
    switch (action.type) {
        case "add_tweet":
            let tempArray = action.payload
            let tempPosArray = []
            let tempNegArray = []

            let tempTweetArray = tempArray.map(tweet=> {
                let result = sentiment.analyze(tweet.text)
                let sentimentColor = "zero"
                let sentimentPhrase = "Neutral"
                let score = result.score

                if (score <= -6) {
                    sentimentColor = "neg5"
                    sentimentPhrase = "Extremely Negative"
                } else if (score <= -4 && score > -6) {
                    sentimentColor = "neg4"
                    sentimentPhrase = "Very Negative"
                } else if (score <= -2 && score > -4) {
                    sentimentColor = "neg3"
                    sentimentPhrase = "Moderately Negative"
                } else if (score <= -1 && score > -2) {
                    sentimentColor = "neg2"
                    sentimentPhrase = "Mildly Negative"
                } else if (score > -1 && score < 0) {
                    sentimentColor = "neg1"
                    sentimentPhrase = "Slightly Negative"
                } else if (score === 0) {
                    sentimentColor = "zero"
                    sentimentPhrase = "Neutral"
                } else if (score > 0 && score < 1) {
                    sentimentColor = "pos1"
                    sentimentPhrase = "Slightly Positive"
                } else if (score >= 1 && score < 2) {
                    sentimentColor = "pos2"
                    sentimentPhrase = "Mildly Positive"
                } else if (score >= 2 && score < 4) {
                    sentimentColor = "pos3"
                    sentimentPhrase = "Moderately Positive"
                } else if (score >= 4 && score < 6) {
                    sentimentColor = "pos4"
                    sentimentPhrase = "Very Positive"
                } else if (score >= 6) {
                    sentimentColor = "pos5"
                    sentimentPhrase = "Extremely Positive"
                }


                tempPosArray = [...new Set([...tempPosArray, ...result.positive])]
                tempNegArray = [...new Set([...tempNegArray, ...result.negative])]

                let tempTweet = {
                    id: tweet.id,
                    text: tweet.text,
                    score: result.score,
                    comparative: result.comparative,
                    calculation: result.calculation,
                    negative: result.negative,
                    positive: result.positive,
                    sentimentColor: sentimentColor,
                    sentimentPhrase: sentimentPhrase
                }

                return tempTweet
            })

            tempTweetArray.sort((a,b)=>b.score-a.score)
            let tempCuScore = tempTweetArray.reduce((t,c)=>(c.score+t),0)
            let tempCuComScore = tempTweetArray.reduce((t,c)=>(c.comparative+t),0)

            return {
                ...state,
                tweets: tempTweetArray,
                cuScore: tempCuScore,
                cuComScore: tempCuComScore,
                positiveArray: tempPosArray,
                negativeArray: tempNegArray
            }
        case "add_searchTerm":
            return {
                ...state,
                searchTerm: action.payload
            }
        default:
            return state
    }
}

function RecentTweets() {

    const initialState = {
        tweets: [],
        cuScore: 0,
        cuComScore: 0,
        searchTerm: [],
        positiveArray: [],
        negativeArray: []
    }

    const [state, dispatch] = useReducer(reducer, initialState)
    const { searchTerm } = state;

    const searchTweet = async (e) => {
        e.preventDefault();

        let convertedSearchTerm = encodeURIComponent(searchTerm)

        try {
            const response = await axios.get(`${searchURL}${convertedSearchTerm}`);
            if (response.data.body.errors) {
            }
            else {
                dispatch({type: "add_tweet", payload: response.data.body.data})
            }

        } catch (e) {
        }
    }


    return (
        <div>
            <h1>Twitter Sentiment by Search Term</h1>
            <form>
                <div className="ui fluid action input">
                    <input
                        type="text"
                        autoFocus={true}
                        value={searchTerm}
                        onChange={(e) =>
                            dispatch({type:"add_searchTerm", payload:e.target.value})

                        }
                    />
                    <button className="ui primary button" onClick={(e) => searchTweet(e)}>
                        Search Recent Tweets
                    </button>
                </div>
            </form>
            {ShowTweets(state)}
        </div>
    );
}

export default RecentTweets;
