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
}

export default TweetDisplay;
