# Twitter Sentiment Analysis App

## Description

This app allows you to conduct simple sentiment analysis on recent tweets by search terms. You can either search for the most recent 20 tweets with the search term, or run a real time feed of tweets containing the search term.

### Technical Used
- React
- Bootstrap with react
- Ajax (axios) for API
- Node.js
- Express.js
- Sentiment (for sentiment analysis)

### Wireframes

<img src="https://i.imgur.com/G7cxLlw.png">

### User Stories

A user will be able to:
- Search for the 20 most recent according to a specified search term
- View the aggregated sentiment analysis results for the 20 tweets, which includes overall sentiment score, overall comparative sentiment score, list of positive and negative words detected. 
- View the individual tweets along with the individual sentiment score, comparative sentiment score, and list of positive and negative words detected in each tweet
- Set up a real time stream of latest tweets according to specified search term
- View the real time stream of latest tweets along with aggregated sentiment results and results for individual tweets

## Planning and Development Process

- The project was chosen as I was interested in how one can try to derive value from the huge amount of information available from social media
- I chose to use Twitter API due to the large number of global users as well as a very comprehensive API
- Main issue with Twitter API was that was not meant to be called from frontend, and hence I had to learn how to build the backend to execute the API calls
- Two main methods to search tweets were chosen (by 20 most recent tweets and by filtered live feed), as they provided sufficient functionality to user and also relatively straightforward to implement
- Sentiment analysis method was chosen as it was straightforward to implement, very lightweight and fast to run, and provided sufficient functionality to user
- Output results were chosen (sentiment score, comparative sentiment score, positive words, negative words) was chosen as they were easy for user to understand
- Format to display output was chosen in order to present information to user in a clear manner, with aggregated results on top and a table containing individual breakdown for each tweet below

### Problem-Solving Strategy

- The main issue I had was that I had no experience then in building or modifying a backend to make the required calls, which I overcame by building upon an existing demo app by Twitter. 
- I broke the main functions of the app into more manageable portions and tackled them individually

### Unsolved problems

- To provide more options for users to refine their serch, e.g. by time period, by geographic location, by user
- To allow the user to save searches and to compare the results of different search terms
- To improve on the sentiment analysis. Current sentiment analysis is very simple, it only recognises keywords and does not recognise the overall context of the sentence e.g. the statement may be ironic or sarcastic and hence the sentiment will not be analysed correctly. 
- To improve on presentation of information, especially on mobile devices
- To provide limiting of the number of tweets fetched by live streams, in order to prevent the api limits from being exhausted too quickly. 

## APIs Used

Twitter API was chosen as it is a very popular social media platform with a huge global userbase. Leveraging on this API enables the user to tap on the huge number of live conversations about almost every topic possible in order to do sentiment analysis. 

---

## Acknowledgments

I would like to thank Ebere and Isaac for their support and encouragement for this project!

---

 ## References


