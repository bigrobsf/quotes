$(function() {
  const numQuotes = 20;

  var $ulQuotes = $('#quotes');
  var $ulTop5 = $('#top-quotes');
  var $ulBottom5 = $('#bottom-quotes');
  var $getQuotesBtn = $('.get-quotes');

  var storedQuotes = localStorage.getItem('quotes');
  var currentQuotes = [];

  if (storedQuotes) {
    currentQuotes = JSON.parse(storedQuotes);

    for (var i = 0; i < currentQuotes.length; i++) {
      addQuote(currentQuotes[i]);
    }
  }

  // ===========================================================================
  //
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
  // Function to get quotes from forismatic.com API
  function getQuote(key) {
    return $.ajax({
      url: `https://api.forismatic.com/api/1.0/?method=getQuote&key=${key}&format=jsonp&lang=en`,
      dataType: 'jsonp',
      jsonp: 'jsonp'
    });
  }

  // ===========================================================================
  //
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
  //
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
          addQuote(quotes[i]);
          quotesToStore.push(quotes[i]);
        }

        localStorage.setItem('quotes', JSON.stringify(quotesToStore));
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  // ===========================================================================
  //
  function addQuote(quote) {
    var { id, quoteText, quoteAuthor, quoteLink } = quote;
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

    var $hiddenId = $('<p>');
    $hiddenId.text(id).addClass('hidden');

    $li.append($upSpan);
    $li.append($downSpan);
    $li.append($quote);
    $li.append($authorSpan);
    $li.append($hiddenId);
    $ulQuotes.append($li);
  }

  // ===========================================================================
  //
  function incrementScore(event) {
    var target = event.target;
    var $parent = $(target).parent();
    var clickedId = $parent
      .children()
      .eq(4)
      .text();

    var quotes = JSON.parse(localStorage.getItem('quotes'));

    for (var i = 0; i < quotes.length; i++) {
      if (clickedId === quotes[i].id) {
        quotes[i].score++;
      }
    }

    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  // ===========================================================================
  //
  function decrementScore(event) {
    var target = event.target;
    var $parent = $(target).parent();
    var clickedId = $parent
      .children()
      .eq(4)
      .text();

    var quotes = JSON.parse(localStorage.getItem('quotes'));

    for (var i = 0; i < quotes.length; i++) {
      if (clickedId === quotes[i].id) {
        quotes[i].score--;
      }
    }

    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
});
