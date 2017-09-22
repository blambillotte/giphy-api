
$(document).ready(function() {

  var url = 'https://api.giphy.com/v1/gifs/search';
  var API_KEY;

  // Cache DOM
  var $gifDivTarget = $("#gifs-appear-here");
  var $btnInput = $('#btn-input');
  var $btnDiv = $('#buttons');
  var $noConnectWarn = $('#no-connection');
  var $addNewBtn = $('#add-btn');
  var $removeWarningBtn = $('#close-error');
  var $nullStateDiv = $('#null-state');
  var $APIKeyInput = $('#API_KEY');
  var $APIKeySaveBtn = $('#API_Add_Btn');
  var $actionBarDiv = $('#action-bar');
  var $apiKeyInputDiv = $('#API-Key-Input');

  /*
  ************ Main App Functions *******************
  */

  function callAPI(searchString) {
    var searchUrl = url + '?' + $.param({
      'api_key': API_KEY,
      'q': searchString,
      'limit': 10
    });
    console.log(searchUrl);
    $.ajax({
      url: searchUrl,
      method: 'GET',
    }).done(function(response) {

      handleResults(response.data);

    }).fail(function(err) {
      $noConnectWarn.removeClass('invisible');
      throw err;
    });
  }

  function handleResults(responseData) {
    // console.log(responseData);
    var results = responseData;

    //Clear DOM for new results
    clearResults();
    removeNullState();

    //Loop through image results then write to DOM
    for (var i = 0; i < results.length; i++) {
      var gifDiv = $("<div class='gif-div'>");
      var rating = results[i].rating;
      var p = $("<p>").text("Rating: " + rating);
      var gifImg = $("<img>");

      gifImg.attr({
        src: results[i].images.fixed_height_still.url,
        'data-animate': results[i].images.fixed_height.url,
        'data-still': results[i].images.fixed_height_still.url,
        'data-state': 'still',
        class: 'gif inactive fade-in'
      });

      //Call Write Dom Function
      writeDom(p, gifImg, gifDiv);

    }

    clickListen();

  }

  function clearResults() {
    $gifDivTarget.empty();
  }

  function writeDom(p, gifImg, gifDiv) {
    gifDiv.prepend(p);
    gifDiv.prepend(gifImg);
    $gifDivTarget.prepend(gifDiv);
  }

  /*
  ************ Create Buttons *******************
  */


  var BUTTONS = ['Dog', 'Cat', 'Frog', 'Tiger', 'Fish', 'Cow'];
  // Function for displaying movie data
  function renderButtons() {
    //Clear existing values
    $btnDiv.empty();

    for (var i = 0; i < BUTTONS.length; i++) {
      var btn = $('<input>');
      btn.attr({
        type: 'button',
        value: BUTTONS[i],
        title: BUTTONS[i],
        class: 'btn btn-success'
      });
      $btnDiv.append(btn);
      btn.on('click', function(event) {
        callAPI(this.value);
      });
    }
    //Clear Input each time
    $btnInput.val('');
  }

  renderButtons();

  // This function adds new button based on user input.
  $addNewBtn.on('click', function(event) {

    event.preventDefault();

    //Check if input is null
    if ($btnInput[0].value != '') {
      BUTTONS.push($btnInput[0].value);
      //Rerender BUTTONS
      renderButtons();
    }

  });

  /*
  ************ Handle Animate/Sill Swap on Click *******************
  *     Since gifs are not present in DOM on page load
        I added a function to listen after the gifs are loaded.
  */

  function clickListen() {

    $('.gif').on('click', function() {

      var state = this.dataset.state;
      console.log(state);
      console.log(this);

      var animateGif = this.dataset.animate;
      var stillGif = this.dataset.still;

      if (state === 'still') {
        $(this).attr({
          src: animateGif,
          'data-state': 'animate'
        });
        $(this).removeClass('inactive');

      } else if (state === 'animate') {
        $(this).attr({
          src: stillGif,
          'data-state': 'still'
        });
        $(this).addClass('inactive');
      }
    });
  }


  /************ Dismiss Connection Error *******************
  *     This could be reused for more dismissable
  *     items since code looks to parent's div.
  */


  $removeWarningBtn.on('click', removeWarning);

  function removeWarning() {
    $(this).parent().addClass('invisible');
  }


  /************ Remove Null State ******************
  *     This gets called by the sucesful loading
        of the API response.
  */

  function removeNullState() {
    $nullStateDiv.addClass('invisible');
  }


  // $APIKeyInput
  // $APIKeySaveBtn

  //Calling the API with empty params to check validity of API Key
  // TODO: figure out how to not duplicate the key
  function testAPIKey(testKey) {
    testURL = 'https://api.giphy.com/v1/gifs/search?api_key=' + testKey;
    // console.log(url);
    $.ajax({
      url: testURL,
      method: 'GET',
    }).done(function(response) {
      console.log('Key is Valid');
      //Set global API Key Variable
      API_KEY = testKey;
      $apiKeyInputDiv.addClass('fade');
      $apiKeyInputDiv.addClass('invisible');
      $actionBarDiv.removeClass('invisible');
    }).fail(function(err) {
      $noConnectWarn.removeClass('invisible');
      throw err;
    });
  }

  function setAPIKey() {
    console.log($APIKeyInput.val());
    testAPIKey($APIKeyInput.val().trim());
  }

  $APIKeySaveBtn.on('click', function(){
    event.preventDefault();
    setAPIKey();
  });


});
