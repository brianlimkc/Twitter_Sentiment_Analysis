import React from 'react';
import {Table} from "react-bootstrap";
import TweetDisplay from "./TweetDisplay";

function ShowTweets(state) {

    const { tweets, searchTerm, cuScore, cuComScore, positiveArray, negativeArray } = state;

    if (tweets && tweets.length > 0) {

        let sentimentPhrase = "Neutral"
        let AveCuScore = cuScore/tweets.length
        let AveCuComScore = cuComScore/tweets.length


        if (AveCuScore <= -6) {
            sentimentPhrase = "Extremely Negative"
        } else if (AveCuScore <= -4 && AveCuScore > -6) {
            sentimentPhrase = "Very Negative"
        } else if (AveCuScore <= -2 && AveCuScore > -4) {
            sentimentPhrase = "Moderately Negative"
        } else if (AveCuScore <= -1 && AveCuScore > -2) {
            sentimentPhrase = "Mildly Negative"
        } else if (AveCuScore > -1 && AveCuScore < 0) {
            sentimentPhrase = "Slightly Negative"
        } else if (AveCuScore === 0) {
            sentimentPhrase = "Neutral"
        } else if (AveCuScore > 0 && AveCuScore < 1) {
            sentimentPhrase = "Slightly Positive"
        } else if (AveCuScore >= 1 && AveCuScore < 2) {
            sentimentPhrase = "Mildly Positive"
        } else if (AveCuScore >= 2 && AveCuScore < 4) {
            sentimentPhrase = "Moderately Positive"
        } else if (AveCuScore >= 4 && AveCuScore < 6) {
            sentimentPhrase = "Very Positive"
        } else if (AveCuScore >= 6) {
            sentimentPhrase = "Extremely Positive"
        }

        return (
            <>
                <Table>
                    <thead>
                        <tr>
                            <th className={"tableCol"}><h1>Search Term</h1></th>
                            <th className={"tableCol"}><h1>Aggregate Positive Words</h1></th>
                            <th className={"tableCol"}><h1>Aggregate Negative Words</h1></th>
                            <th className={"tableCol"}><h1>Overall Sentiment</h1></th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><h1>{searchTerm}</h1></td>
                            <td>{positiveArray.map((word,id)=>(
                                <span className={`positive`} key={id}>{word}, </span>
                            ))}</td>
                            <td>{negativeArray.map((word,id)=>(
                                <span className={`negative`}key={id}>{word}, </span>
                            ))}</td>
                            <td>
                                <h1>{sentimentPhrase}</h1>
                                <h3>Sentiment Score: {AveCuScore.toFixed(2)}</h3>
                                <h3>Comparative Score: {AveCuComScore.toFixed(2)}</h3>
                            </td>
                        </tr>
                    </tbody>
                </Table>

                <Table>
                    <thead>
                    <tr>
                        <th className={"tableCol"}><h1>Tweet</h1></th>
                        <th className={"tableCol"}><h1>Positive Words</h1></th>
                        <th className={"tableCol"}><h1>Negative Words</h1></th>
                        <th className={"tableCol"}><h1>Sentiment</h1></th>
                    </tr>
                    </thead>
                    <tbody>
                    {tweets.map((tweet) => (
                        <tr key={tweet.id}>
                            {TweetDisplay(tweet)}
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </>
        );
    }
}

export default ShowTweets;
