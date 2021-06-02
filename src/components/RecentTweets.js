import React, {useState} from 'react';
import axios from "axios";
import { TwitterTweetEmbed } from "react-twitter-embed";
import {Table} from "react-bootstrap"

let Sentiment = require('sentiment');
let sentiment = new Sentiment();
const searchURL = "/api/recent/"



function RecentTweets() {

    const [searchTerm, setSearchTerm] = useState("")
    const [tweets, setTweets] = useState([])
    const [aveScore, setAveScore] = useState(0)
    const [aveCuScore, setAveCuScore] = useState(0)


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
                let tempArray = response.data.body.data
                let tempTweetArray = tempArray.map(tweet=>{
                    let result = sentiment.analyze(tweet.text)
                    console.log(result)

                    let sentimentColor = "zero"
                    let score = result.score

                    if (score<=-6){sentimentColor="neg5"
                    } else if (score<=-4 && score>-6) {sentimentColor="neg4"
                    } else if (score<=-2 && score>-4) {sentimentColor="neg3"
                    } else if (score<=-1 && score>-2) {sentimentColor="neg2"
                    } else if (score>-1 && score<0) {sentimentColor="neg1"
                    } else if (score===0) {sentimentColor="zero"
                    } else if (score>0 && score<1) {sentimentColor="pos1"
                    } else if (score>=1 && score<2) {sentimentColor="pos2"
                    } else if (score>=2 && score<4) {sentimentColor="pos3"
                    } else if (score>=4 && score<6) {sentimentColor="pos4"
                    } else if (score>=6) {sentimentColor="pos5"
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

                setAveScore(tempTweetArray.reduce((t,c)=>(c.score+t),0)/20)
                setAveCuScore(tempTweetArray.reduce((t,c)=>(c.comparative+t),0)/20)

                setTweets(tempTweetArray.sort((a,b)=>b.score-a.score))


                // console.log(tempTweetArray)
                // setTweets(tempTweetArray)
            }

        } catch (e) {
            console.log("Unable to fetch tweets")
        }
    }

    const showTweets = () => {
        if (tweets.length > 0) {

            return (
                <>
                <Table>
                    <thead>
                        <th><h1>Search Term</h1></th>
                        <th><h1>Average Score</h1></th>
                        <th><h1>Average Comparative</h1></th>
                    </thead>
                    <tbody>
                        <td><h1>{searchTerm}</h1></td>
                        <td><h1>{aveScore}</h1></td>
                        <td><h1>{aveCuScore.toFixed(2)}</h1></td>
                    </tbody>
                </Table>

                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th className={"tableCol"}><h1>Tweet</h1></th>
                        <th className={"tableCol"}><h1>Positive</h1></th>
                        <th className={"tableCol"}><h1>Negative</h1></th>
                        <th className={"tableCol"}><h1>Score</h1></th>
                    </tr>
                    </thead>
                    <tbody>
                        {tweets.map((tweet) => (
                            <tr key={tweet.id}>
                                <TweetDisplay tweet={tweet}/>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                </>
            );
        }
    };

    function TweetDisplay({tweet}){
        const id = tweet.id;

        const options = {
            cards: "hidden",
            align: "center",
            width: "450",
            conversation: "none",
        };

        return (
            <>
                <td className={`${tweet.sentimentColor}`}>
                    <TwitterTweetEmbed options={options} tweetId={id} placeholder={"Loading..."}/>
                </td>
                <td className={`${tweet.sentimentColor}`}>
                    <h3>Positive</h3>
                    {tweet.positive.map((positive,id)=>(
                        <li key={id}>{positive}</li>
                    ))}
                </td>
                <td className={`${tweet.sentimentColor}`}>
                    <h3>Negative</h3>
                    {tweet.negative.map((negative,id)=>(
                        <li key={id}>{negative}</li>
                    ))}
                </td>
                <td className={`${tweet.sentimentColor}`}>
                    <h3>Overall Score: {tweet.score}</h3>
                    <h3>Comparative Score: {tweet.comparative.toFixed(2)}</h3>





                </td>

            </>
        )
    };

    return (
        <div>
            <h1>Recent Tweets Search Component</h1>
            <form onSubmit={(e) => searchTweet(e)}>
                <div className="ui fluid action input">
                    <input
                        type="text"
                        autoFocus={true}
                        value={searchTerm}
                        onChange={(e) =>
                            (setSearchTerm(e.target.value))
                        }
                    />
                    <button type="submit" className="ui primary button">
                        Search Recent Tweets
                    </button>
                </div>
            </form>
            {showTweets()}
        </div>
    );
}

export default RecentTweets;
