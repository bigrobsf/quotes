$(function() {
  const numQuotes = 20;

  var $ulQuotes = $('#quotes');
  var $getQuotesBtn = $('.get-quotes');

  // ==========================================================================
  // If present, get quotes out of local storage and append to list
  var storedQuotes = localStorage.getItem('quotes');
  var currentQuotes = [];

  if (storedQuotes) {
    currentQuotes = JSON.parse(storedQuotes);

    for (var i = 0; i < currentQuotes.length; i++) {
      var $quoteLi = createQuoteLi(currentQuotes[i]);
      $ulQuotes.append($quoteLi);
    }
  }

  // ===========================================================================
  // Event listeners for incrementing, decrementing, and fetching new quotes
  $ulQuotes.on('click', 'span.glyphicon-chevron-up', function(event) {
    incrementScore(event);
  });

  $ulQuotes.on('click', 'span.glyphicon-chevron-down', function(event) {
    decrementScore(event);
  });

  $getQuotesBtn.on('click', function() {
    $ulQuotes.empty();
    var keys = generateKeys(numQuotes);
    createPromises(keys);
  });

  // ===========================================================================
  // GET request to forismatic.com API
  function getQuote(key) {
    return $.ajax({
      url: `https://api.forismatic.com/api/1.0/?method=getQuote&key=${key}&format=jsonp&lang=en`,
      dataType: 'jsonp',
      jsonp: 'jsonp'
    });
  }

  // ===========================================================================
  // Generate random, unique keys - assumes that it will result in unique quotes
  function generateKeys(numQuotes) {
    var quoteKeys = [];
    var count = 0;

    while (count < numQuotes) {
      var key = Math.floor(Math.random() * 1000000);

      if (!quoteKeys.includes(key)) {
        quoteKeys.push(key);
        count++;
      }
    }

    return quoteKeys;
  }

  // ===========================================================================
  // Creates array of promises for Promise.all, updates quote objects returned,
  // appends to list and stores in local storage
  function createPromises(quoteKeys) {
    var promises = [];

    for (var i = 0; i < quoteKeys.length; i++) {
      promises.push(getQuote(quoteKeys[i]));
    }

    Promise.all(promises)
      .then(function(quotes) {
        console.log(quotes);
        var quotesToStore = [];

        for (var i = 0; i < quotes.length; i++) {
          var link = quotes[i].quoteLink;

          quotes[i].id = link.split('/')[4];
          quotes[i].score = 0;
          delete quotes[i].senderName;
          delete quotes[i].senderLink;

          if (!quotes[i].quoteAuthor) {
            quotes[i].quoteAuthor = 'Unknown';
          }

          var $quoteLi = createQuoteLi(quotes[i]);

          $ulQuotes.append($quoteLi);
          quotesToStore.push(quotes[i]);
        }

        localStorage.setItem('quotes', JSON.stringify(quotesToStore));
      })
      .catch(function(err) {
        console.log(err);
      });
  }
});

// ===========================================================================
// increments score for clicked quote and updates local storage - a database
// or Redux would be way more efficient
function incrementScore(event) {
  var target = event.target;
  var $parent = $(target).parent();
  var clickedId = $parent
    .children()
    .eq(5)
    .text();

  var score = $parent
    .children()
    .eq(4)
    .text();

  score = Number(score) + 1;

  var $scoreSpan = $parent.children().eq(4);

  $parent
    .children()
    .eq(4)
    .text(score);

  if (Number(score) > 0) {
    $scoreSpan.addClass('text-success');
    $scoreSpan.removeClass('text-danger');
  } else if (Number(score) < 0) {
    $scoreSpan.addClass('text-danger');
    $scoreSpan.removeClass('text-success');
  } else {
    $scoreSpan.removeClass('text-success');
    $scoreSpan.removeClass('text-danger');
  }

  var quotes = JSON.parse(localStorage.getItem('quotes'));

  for (var i = 0; i < quotes.length; i++) {
    if (clickedId === quotes[i].id) {
      quotes[i].score++;
    }
  }

  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ===========================================================================
// decrements score for clicked quote and updates local storage - a database
// or Redux would be way more efficient
function decrementScore(event) {
  var target = event.target;
  var $parent = $(target).parent();
  var clickedId = $parent
    .children()
    .eq(5)
    .text();

  var score = $parent
    .children()
    .eq(4)
    .text();

  score = Number(score) - 1;

  var $scoreSpan = $parent.children().eq(4);

  $parent
    .children()
    .eq(4)
    .text(score);

  if (Number(score) > 0) {
    $scoreSpan.addClass('text-success');
    $scoreSpan.removeClass('text-danger');
  } else if (Number(score) < 0) {
    $scoreSpan.addClass('text-danger');
    $scoreSpan.removeClass('text-success');
  } else {
    $scoreSpan.removeClass('text-success');
    $scoreSpan.removeClass('text-danger');
  }

  var quotes = JSON.parse(localStorage.getItem('quotes'));

  for (var i = 0; i < quotes.length; i++) {
    if (clickedId === quotes[i].id) {
      quotes[i].score--;
    }
  }

  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ===========================================================================
// creates list item for quotes
function createQuoteLi(quote) {
  var { id, quoteText, quoteAuthor, quoteLink, score } = quote;
  var $li = $('<li>');

  var $upSpan = $('<span>');
  $upSpan.addClass('glyphicon glyphicon-chevron-up');

  var $downSpan = $('<span>');
  $downSpan.addClass('glyphicon glyphicon-chevron-down');

  var $quote = $('<a>');
  $quote
    .attr('href', quoteLink)
    .attr('target', '_blank')
    .text(quoteText);

  var $authorSpan = $('<span>');
  $authorSpan.addClass('author').text(quoteAuthor);

  var $scoreSpan = $('<span>');
  $scoreSpan.addClass('score').text(score);

  if (Number(score) > 0) {
    $scoreSpan.addClass('text-success');
    $scoreSpan.removeClass('text-danger');
  } else if (Number(score) < 0) {
    $scoreSpan.addClass('text-danger');
    $scoreSpan.removeClass('text-success');
  } else {
    $scoreSpan.removeClass('text-success');
    $scoreSpan.removeClass('text-danger');
  }

  var $hiddenId = $('<p>');
  $hiddenId.text(id).addClass('hidden');

  $li.append($upSpan);
  $li.append($downSpan);
  $li.append($quote);
  $li.append($authorSpan);
  $li.append($scoreSpan);
  $li.append($hiddenId);

  return $li;
}
