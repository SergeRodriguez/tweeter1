//This function escapes XSS(cross-site scripting)
const escape = function (str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// This function takes in an object as an argument, and transforms it into html
// it also uses moment.js in order to parse the number of miliseconds into a more readable format
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
  <main>${escape(tweet.content.text)}</main>
  <footer>
    <div class="container">
      ${moment(tweet.created_at).fromNow()}
      <span class="icon-span">
      <i class="fas fa-flag"></i>
      <i class="fas fa-retweet"></i>
      <i class="fas fa-heart"></i>
      </span>
    </div>
  </footer>
</article>
`;
  return markup;
};

//This function takes in an array of objects, reverses its order and then transform each element 
// in the array (which should be objects) into html text;
const renderTweets = function (tweets) {
  tweets.reverse();
  $('#tweets-container').empty();
  for (let tweet of tweets) {
    $('#tweets-container').append(createTweetElement(tweet));
  }
};

//this variable is a placeholder for the beginning of the URL path
const serverURL = "http://localhost:8080";
// This function performs a GET request to the tweets database and then passes the array to the 
// renderTweets function
const loadTweets = function () {
  $.ajax({
    url: `${serverURL}/tweets/`,
    method: "GET"
  })
    .then(function (database) {
      renderTweets(database);
    });
};


//Waits for html to be loaded 
$(document).ready(function () {

  //Toggles the display of the new tweet box
  const $newTweetButton = $(".new-tweet-button");
  $newTweetButton.on("click", function () {
    $("#tweet-box").slideToggle(700, function () {
      $("textarea").focus();
    });

  });

  //Handler for the sumbit button of the new tweet
  // If the textarea of the new tweet box is empty or over 140 characters, it will notify the user
  // otherwise it will add the tweet to the tweets database and make it appear in the body
  const $newTweetSubmit = $('form');
  $newTweetSubmit.submit(function (event) {
    event.preventDefault();
    if ($("textarea").val() === "") {
      $(".over140").slideUp(0);
      $(".empty-tweet").slideDown();
      return;
    } else if ($("textarea").val().length > 140) {
      $(".empty-tweet").slideUp(0);
      $(".over140").slideDown();
      return;
    } else {
      $.ajax({
        url: `${serverURL}/tweets/`,
        data: $newTweetSubmit.serialize(),
        method: "POST"
      })
        .done(function () {
          $('textarea').val("");
          $(".counter").text(140);
          loadTweets();
          $(".over140").slideUp();
          $(".empty-tweet").slideUp();
        });
    }
  });
});

// Handler for the return to top button which appears once the height of the  window is more than
// 570 px
$(document).ready(function () {
  $(window).scroll(function () {
    if ($(this).scrollTop() >= 570) {
      // If page is scrolled more than 570px
      $('.return-to-top').fadeIn(200);    // Fade in the arrow
    } else {
      $('.return-to-top').fadeOut(200);   // Else fade out the arrow
    }
  });
  $('.return-to-top').click(function () {      // When arrow is clicked
    $('body,html').animate({
      scrollTop: 0                       // Scroll to top of body
    }, 500);
    $("textarea").focus();
  });
});