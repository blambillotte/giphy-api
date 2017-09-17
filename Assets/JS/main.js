
var url = 'https://api.giphy.com/v1/gifs/search';
var noConnectWarn = $('#no-connection');

function callAPI(searchString) {
  url += '?' + $.param({
    'api_key': API_KEY,
    'q': searchString,
  });
  $.ajax({
    url: url,
    method: 'GET',
  }).done(function(response) {

    handleResults(response.data);

  }).fail(function(err) {
    noConnectWarn.removeClass('invisible');
    throw err;
  });
};

function handleResults(responseData) {
  // console.log(responseData);
  var results = responseData;

  //Clear DOM for new results
  clearResults();
  removeNullState();

  //Loop through image results
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
    writeDom(p, gifImg, gifDiv)

  }
  clickListen();

};

function clearResults() {
  $("#gifs-appear-here").empty();
};

function writeDom(p, gifImg, gifDiv) {
  gifDiv.prepend(p);
  gifDiv.prepend(gifImg);
  $("#gifs-appear-here").prepend(gifDiv);
};

/*
************ Create Buttons *******************
*/


var buttons = ['Dog', 'Cat', 'Frog', 'Tiger', 'Fish', 'Cow'];
var btnInput = $('#btn-input');
var btnDiv = $('#buttons');
// Function for displaying movie data
function renderButtons() {
  //Clear existing values
  btnDiv.empty();

  for (var i = 0; i < buttons.length; i++) {
    var btn = $('<input>');
    btn.attr({
      type: 'button',
      value: buttons[i],
      title: buttons[i],
      class: 'btn btn-success'
    })
    btnDiv.append(btn);
    btn.on('click', function(event) {
      callAPI(this.value);
    });
  }
  //Clear Input each time
  btnInput.val('');

}

// This function adds new buttons
$('#add-btn').on('click', function(event) {

  event.preventDefault();

  //Check if input is null
  if (btnInput[0].value != '') {
    buttons.push(btnInput[0].value);
    //Rerender buttons
    renderButtons();
  }

});

renderButtons();

/*
************ Handle Animate/Sill Swap on Click *******************
*/

function clickListen() {

  $('.gif').on('click', function() {

    var state = this.dataset.state;
    console.log(state);
    console.log(this);

    var animateGif = this.dataset.animate;
    if (state === 'still') {
      $(this).attr({
        src: animateGif,
        'data-state': 'animate'
      });
      $(this).removeClass('inactive');
    }

    var stillGif = this.dataset.still;
    if (state === 'animate') {
      $(this).attr({
        src: stillGif,
        'data-state': 'still'
      });
      $(this).addClass('inactive');
    }
  });
}


/************ Dismiss Connection Error *******************
*     This could be reused for more types dismissable
*     items since code looks to parent's div
*/

var removeWarningBtn = $('#close-error');

removeWarningBtn.on('click', function() {
  $(this).parent().addClass('invisible');
});


/************ Remove Null State ******************
*     This gets called by the sucesful loading
      of the API response.
*/

var nullStateDiv = $('#null-state');

function removeNullState() {
  nullStateDiv.addClass('invisible');
}
