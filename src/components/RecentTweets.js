import React, {useReducer, useEffect} from 'react';
import axios from "axios";
import ShowTweets from "./ShowTweets";

let Sentiment = require('sentiment');
let sentiment = new Sentiment();
const searchURL = "/api/recent/"

const reducer = (state, action) => {
    switch (action.type) {
        case "add_tweet":
            let tempArray = action.payload
            let tempTweetArray = tempArray.map(tweet=> {
                let result = sentiment.analyze(tweet.text)
                let sentimentColor = "zero"
                let score = result.score

                if (score <= -6) {
                    sentimentColor = "neg5"
                } else if (score <= -4 && score > -6) {
                    sentimentColor = "neg4"
                } else if (score <= -2 && score > -4) {
                    sentimentColor = "neg3"
                } else if (score <= -1 && score > -2) {
                    sentimentColor = "neg2"
                } else if (score > -1 && score < 0) {
                    sentimentColor = "neg1"
                } else if (score === 0) {
                    sentimentColor = "zero"
                } else if (score > 0 && score < 1) {
                    sentimentColor = "pos1"
                } else if (score >= 1 && score < 2) {
                    sentimentColor = "pos2"
                } else if (score >= 2 && score < 4) {
                    sentimentColor = "pos3"
                } else if (score >= 4 && score < 6) {
                    sentimentColor = "pos4"
                } else if (score >= 6) {
                    sentimentColor = "pos5"
                }

                let tempTweet = {
                    id: tweet.id,
                    text: tweet.text,
                    score: result.score,
                    comparative: result.comparative,
                    calculation: result.calculation,
                    negative: result.negative,
                    positive: result.positive,
                    sentimentColor: sentimentColor
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
                cuComScore: tempCuComScore
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
        searchTerm: ""
    }

    const [state, dispatch] = useReducer(reducer, initialState)
    const { searchTerm } = state;

    const searchTweet = async (e) => {
        e.preventDefault();

        let convertedSearchTerm = encodeURIComponent(searchTerm)

        try {
            const response = await axios.get(`${searchURL}${convertedSearchTerm}`);
            if (response.data.body.errors) {
                console.log("Error in fetching tweets")
                console.log(response.data.body.errors)
            }
            else {
                console.log("Success in fetching tweets")
                dispatch({type: "add_tweet", payload: response.data.body.data})
            }

        } catch (e) {
            console.log("Unable to fetch tweets")
        }
    }

    return (
        <div>
            <h1>Recent Tweets Search Component</h1>
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
