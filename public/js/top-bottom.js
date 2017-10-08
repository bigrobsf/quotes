$(function() {
  var $ulTop5 = $('#top-quotes');
  var $ulBottom5 = $('#bottom-quotes');

  // ==========================================================================
  // Get quotes out of local storage for sorting and appending to lists
  var storedQuotes = localStorage.getItem('quotes');
  var currentQuotes = [];

  if (storedQuotes) {
    currentQuotes = JSON.parse(storedQuotes);

    currentQuotes.sort(function(a, b) {
      return b.score - a.score;
    });

    for (var i = 0; i < 5; i++) {
      var $quoteLi = createQuoteLi(currentQuotes[i]);
      $ulTop5.append($quoteLi);
    }

    currentQuotes.sort(function(a, b) {
      return a.score - b.score;
    });

    for (var i = 0; i < 5; i++) {
      var $quoteLi = createQuoteLi(currentQuotes[i]);
      $ulBottom5.append($quoteLi);
    }
  }

  // ==========================================================================
  // Event listeners to increment and decrement scores
  $ulTop5.on('click', 'span.glyphicon-chevron-up', function(event) {
    incrementScore(event);
  });

  $ulTop5.on('click', 'span.glyphicon-chevron-down', function(event) {
    decrementScore(event);
  });

  $ulBottom5.on('click', 'span.glyphicon-chevron-up', function(event) {
    incrementScore(event);
  });

  $ulBottom5.on('click', 'span.glyphicon-chevron-down', function(event) {
    decrementScore(event);
  });
});
