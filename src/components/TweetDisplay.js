import React from 'react';
import {TwitterTweetEmbed} from "react-twitter-embed";

function TweetDisplay(tweet) {

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
                {tweet.positive.map((positive,id)=>(
                    <span className={`positive`} key={id}>{positive} </span>
                ))}
            </td>
            <td className={`${tweet.sentimentColor}`}>
                {tweet.negative.map((negative,id)=>(
                    <span className={`negative`}key={id}>{negative} </span>
                ))}
            </td>
            <td className={`${tweet.sentimentColor}`}>
                <h1>{tweet.sentimentPhrase}</h1>
                <h3>Sentiment Score: {tweet.score}</h3>
                <h3>Comparative Score: {tweet.comparative.toFixed(2)}</h3>
            </td>
        </>
    )
}

export default TweetDisplay;
