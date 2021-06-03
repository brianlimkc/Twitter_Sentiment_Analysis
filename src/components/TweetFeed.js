import React, {useEffect, useReducer} from "react";
import socketIOClient from "socket.io-client";
import ErrorMessage from "./ErrorMessage";
import Spinner from "./Spinner";
import ShowTweets from "./ShowTweets";
import axios from "axios";

let Sentiment = require('sentiment');
let sentiment = new Sentiment();

const reducer = (state, action) => {
  switch (action.type) {
    case "add_tweet":
      let tempTweetJSON = action.payload.data
      let result = sentiment.analyze(tempTweetJSON.text)
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

      let tempTweet = {
        id: tempTweetJSON.id,
        text: tempTweetJSON.text,
        score: result.score,
        comparative: result.comparative,
        calculation: result.calculation,
        negative: result.negative,
        positive: result.positive,
        sentimentColor: sentimentColor,
        sentimentPhrase: sentimentPhrase
        }

      let tempCuScore = state.cuScore + result.score
      let tempCuComScore = state.cuComScore + result.comparative
      let tempTweetArray = [...state.tweets]
      tempTweetArray.unshift(tempTweet)

      let tempPosArray = [...new Set([...state.positiveArray, ...result.positive])]
      let tempNegArray = [...new Set([...state.negativeArray, ...result.negative])]

      return {
        ...state,
        tweets: tempTweetArray,
        cuScore: tempCuScore,
        cuComScore: tempCuComScore,
        error: null,
        isWaiting: false,
        errors: [],
        positiveArray: tempPosArray,
        negativeArray: tempNegArray,
      }

    case "show_error":
      return { ...state, error: action.payload, isWaiting: false };
    case "add_errors":
      return { ...state, errors: action.payload, isWaiting: false };
    case "update_waiting":
      return { ...state, error: null, isWaiting: true };
    case "update_searchTerm":
      return { ...state, searchTerm: action.payload };
    default:
      return state;
  }
};

const TweetFeed = () => {
  const initialState = {
    tweets: [],
    error: {},
    isWaiting: true,
    cuScore: 0,
    cuComScore: 0,
    searchTerm: [],
    positiveArray: [],
    negativeArray: []
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { error, isWaiting } = state;
  const rulesURL = "/api/rules";

  const streamTweets = () => {
    let socket;

    if (process.env.NODE_ENV === "development") {
      socket = socketIOClient("http://localhost:3001/");
    } else {
      socket = socketIOClient("/");
    }

    socket.on("connect", () => {});
    socket.on("tweet", (json) => {
      if (json.data) {
        dispatch({ type: "add_tweet", payload: json });
      }
    });
    socket.on("heartbeat", (data) => {
      dispatch({ type: "update_waiting" });
    });
    socket.on("error", (data) => {
      dispatch({ type: "show_error", payload: data });
    });
    socket.on("authError", (data) => {
      dispatch({ type: "add_errors", payload: [data] });
    });
  };

  const reconnectMessage = () => {
    const message = {
      title: "Reconnecting",
      detail: "Please wait while we reconnect to the stream.",
    };

    if (error && error.detail) {
      return (
          <div>
            <ErrorMessage key={error.title} error={error} styleType="warning" />
            <ErrorMessage
                key={message.title}
                error={message}
                styleType="success"
            />
            <Spinner />
          </div>
      );
    }
  };

  const errorMessage = () => {
    const { errors } = state;

    if (errors && errors.length > 0) {
      return errors.map((error) => (
          <ErrorMessage key={error.title} error={error} styleType="negative" />
      ));
    }
  };

  const waitingMessage = () => {
    const message = {
      title: "Still working",
      detail: "Waiting for new Tweets to be posted",
    };

    if (isWaiting) {
      return (
          <React.Fragment>
            <div>
              <ErrorMessage
                  key={message.title}
                  error={message}
                  styleType="success"
              />
            </div>
            <Spinner />
          </React.Fragment>
      );
    }
  };

  useEffect(() => {
    streamTweets();
    axios.get(rulesURL)
        .then(function(response) {
          if (response.data.body.data) {
            let tempSentimentArray = response.data.body.data.map(el=>el.value)
            dispatch({ type: "update_searchTerm", payload: [...tempSentimentArray]});
          }
        })



  }, []);

  return (
      <div>
        {reconnectMessage()}
        {errorMessage()}
        {waitingMessage()}
        {ShowTweets(state)}
      </div>
  );
};

export default TweetFeed;
