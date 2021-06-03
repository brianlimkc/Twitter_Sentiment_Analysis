const express = require("express");
const bodyParser = require("body-parser");
const util = require("util");
const request = require("request");
const path = require("path");
const socketIo = require("socket.io");
const http = require("http");
require('dotenv').config()

const app = express();
let port = process.env.PORT || 3000;
const post = util.promisify(request.post);
const get = util.promisify(request.get);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'build'))); //building in this folder

const server = http.createServer(app);
const io = socketIo(server);

server.on('error', function(err) {
  console.log("server error")
  console.log(err)
});

const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

let timeout = 1;

const streamURL = new URL(
  "https://api.twitter.com/2/tweets/search/stream"
);

const rulesURL = new URL(
  "https://api.twitter.com/2/tweets/search/stream/rules"
);

const errorMessage = {
  title: "Please Wait",
  detail: "Waiting for new Tweets to be posted...",
};

const authMessage = {
  title: "Could not authenticate",
  details: [
    `Please make sure your bearer token is correct. 
      If using Glitch, remix this app and add it to the .env file`,
  ],
  type: "https://developer.twitter.com/en/docs/authentication",
};

const sleep = async (delay) => {
  return new Promise((resolve) => setTimeout(() => resolve(true), delay));
};

app.get("/api/recent/:searchTerm", async (req, res, next) => {

  console.log("inside app.get/recent")

  if (!BEARER_TOKEN) {
    res.status(400).send(authMessage);
  }

  let convertedSearchTerm = encodeURIComponent(`${req.params.searchTerm}`)

  const endpointUrl = `https://api.twitter.com/2/tweets/search/recent?max_results=20&query=(${convertedSearchTerm}) lang:en -is:retweet`;

  console.log(endpointUrl)

  const requestConfig = {
    url: endpointUrl,
    auth: {
      bearer: BEARER_TOKEN,
    },
    rule: "-is:retweet lang:en",
    json: true,
  };


  try {
    const response = await get(requestConfig,function(err,data){
      if (err) {
        next(err) // Pass errors to Express.
      } else {
        res.send(data)
      }
    });

    if (response.statusCode !== 200) {
      if (response.statusCode === 403) {
        res.status(403).send(response.body);
      } else {
        throw new Error(response.body.error.message);
      }
    }
    res.send(response);
  } catch (e) {
    res.send(e);
  }
})

app.get("/api/rules", async (req, res) => {

  console.log("inside app.get/rules")

  if (!BEARER_TOKEN) {
    res.status(400).send(authMessage);
  }

  const requestConfig = {
    url: rulesURL,
    auth: {
      bearer: BEARER_TOKEN,
    },
    json: true,
  };

  console.log(`api.get requestConfig ${requestConfig}`)

  try {
    const response = await get(requestConfig);
    if (response.statusCode !== 200) {
      if (response.statusCode === 403) {
        res.status(403).send(response.body);
      } else {
        throw new Error(response.body.error.message);
      }
    }
    res.send(response);
  } catch (e) {
    res.send(e);
  }
})

app.post("/api/rules", async (req, res) => {
  if (!BEARER_TOKEN) {
    res.status(400).send(authMessage);
  }

  const token = BEARER_TOKEN;
  const requestConfig = {
    url: rulesURL,
    auth: {
      bearer: token,
    },
    json: req.body,
  };

  console.log(`api.post requestConfig ${requestConfig}`)

  try {
    const response = await post(requestConfig);

    if (response.statusCode === 200 || response.statusCode === 201) {
      res.send(response);
    } else {
      throw new Error(response);
    }
  } catch (e) {
    res.send(e);
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
}); // catch any other routes not caught by above

const streamTweets = (socket, token) => {
  let stream;

  const config = {
    url: streamURL,
    auth: {
      bearer: token,
    },
    timeout: 31000,
  };

  console.log(`streaming tweets`)

  try {
    const stream = request.get(config);

    stream
      .on("data", (data) => {
        try {
          const json = JSON.parse(data);
          if (json.connection_issue) {
            socket.emit("error", json);
            reconnect(stream, socket, token);
          } else {
            if (json.data) {
              socket.emit("tweet", json);
              console.log(`receiving new tweet`)
            } else {
              socket.emit("authError", json);
            }
          }
        } catch (e) {
          socket.emit("heartbeat");
        }
      })
      .on("error", (error) => {
        // Connection timed out
        socket.emit("error", errorMessage);
        reconnect(stream, socket, token);
      });
  } catch (e) {
    socket.emit("authError", authMessage);
  }
};

const reconnect = async (stream, socket, token) => {
  timeout++;
  stream.abort();
  await sleep(2 ** timeout * 1000);
  streamTweets(socket, token);
};

io.on("connection", async (socket) => {
  try {
    const token = BEARER_TOKEN;
    io.emit("connect", "Client connected");
    const stream = streamTweets(io, token);
  } catch (e) {
    io.emit("authError", authMessage);
  }
});

console.log("NODE_ENV is", process.env.NODE_ENV);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (request, res) => {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 3001;
}

server.listen(port, () => console.log(`Listening on port ${port}`));
