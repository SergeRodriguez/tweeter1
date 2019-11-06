
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
// Test / driver code (temporary). Eventually will get this from the server.
// Fake data taken from initial-tweets.json
/* const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png"
      ,
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd"
    },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  }
] */


const createTweetElement = function (tweet) {
  const markup = `
  <article class="tweet">
    <header class="container-tweet">
      <div class="container-tweet">
       <img class="tweetImage" src=${tweet.user.avatars}/>
       <span class="name">${tweet.user.name}</span>
      </div>
      <span class="handle">${tweet.user.handle}</span>
    </header>
  <main>${tweet.content.text}</main>
  <footer>
    <div class="container">
      ${moment(tweet.created_at).fromNow()}
      <span>
      <i class="fas fa-flag"></i>
      <i class="fas fa-retweet"></i>
      <i class="fas fa-heart"></i>
      </span>
    </div>
  </footer>
</article>
`;

  return markup
}

const renderTweets = function (tweets) {
  tweets.reverse();
  $('#tweets-container').empty()
  for (let tweet of tweets) {
    $('#tweets-container').append(createTweetElement(tweet))
  }
}

const serverURL = "http://localhost:8080"

const loadTweets = function () {
  $.ajax({
    url: `${serverURL}/tweets/`,
    method: "GET"
  })
    .then(function (database) {
      renderTweets(database)
    })
}

$(document).ready(function () {

  const $newTweetSubmit = $('form');

  $newTweetSubmit.submit(function (event) {
    event.preventDefault();
    if ($("textarea").val() === "") {
      alert("Tweet box is empty!")
      return;
    } else if ($("textarea").val().length > 140) {
      alert("Your Tweet is over 140 characters!")
      return;
    }
    else {
      $.ajax({
        url: `${serverURL}/tweets/`,
        data: $newTweetSubmit.serialize(),
        method: "POST"
      })
        .done(function () {
          $('textarea').val("")
          $(".counter").text(140)
          loadTweets()
        });
    }
  });
})
