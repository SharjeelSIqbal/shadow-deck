
var $addCard = document.querySelector('#add-card');
var $noDeck = document.querySelector('#no-deck');
var $search = document.querySelector('#search');
var $myDeck = document.querySelector('#my-deck');
var $logo = document.querySelector('.logo');
var $searchBar = document.querySelector('.search-bar');
var $tabView = document.querySelectorAll('.tab-view');

function switchView(dataView) {
  for (var i = 0; i < $tabView.length; i++) {
    if ($tabView[i].getAttribute('data-view') === dataView) {
      $tabView[i].className = 'tab-view';
    } else {
      $tabView[i].className = 'tab-view hidden';
    }
  }
}

function switchViewing(event) {
  event.preventDefault();
  var dataView = event.target.getAttribute('data-view');
  switchView(dataView);
}

$myDeck.addEventListener('click', switchViewing);
$search.addEventListener('click', switchViewing);
$noDeck.addEventListener('click', switchViewing);
$addCard.addEventListener('click', switchViewing);
$logo.addEventListener('click', switchViewing);

function search(inputValue) {
  var yugiohIndex = new XMLHttpRequest();
  yugiohIndex.open('GET', 'https://db.ygoprodeck.com/api/v7/cardinfo.php?&fname=' + inputValue);
  yugiohIndex.responseType = 'json';
  yugiohIndex.addEventListener('load', function () {

  });
  yugiohIndex.send();
}

function searchInput(event) {
  var value = $searchBar.value;
  search(value);
}

$searchBar.addEventListener('blur', searchInput);
