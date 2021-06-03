import React from 'react';
import {Table} from "react-bootstrap";
import TweetDisplay from "./TweetDisplay";

function ShowTweets(state) {

    const { tweets, searchTerm, cuScore, cuComScore } = state;

    if (tweets && tweets.length > 0) {

        return (
            <>
                <Table>
                    <thead>
                        <tr>
                            <th><h1>Search Term</h1></th>
                            <th><h1>Average Score</h1></th>
                            <th><h1>Average Comparative</h1></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><h1>{searchTerm}</h1></td>
                            <td><h1>{(cuScore/tweets.length).toFixed(2)}</h1></td>
                            <td><h1>{(cuComScore/tweets.length).toFixed(2)}</h1></td>
                        </tr>
                    </tbody>
                </Table>

                <Table>
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
