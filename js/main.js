
var $addCard = document.querySelector('#add-card');
var $searchBarDiv = document.querySelector('#search-bar');
var $cardCount = document.querySelector('#card-deck-count');
var $infoText = document.querySelector('#click-to-add');
var $noDeck = document.querySelector('#no-deck');
var $newDeck = document.querySelector('.new-deck');
var $search = document.querySelector('#search');
var $myDeck = document.querySelector('#my-deck');
var $myDeckView = document.querySelector('#my-deck-view');
var $logo = document.querySelector('.logo');
var $searchBar = document.querySelector('.search-bar');

function searchBarAppears(event) {
  event.preventDefault();
  $newDeck.className = 'new-deck hidden';
  $cardCount.className = 'minor-padding column-full row space-between hidden';
  $searchBarDiv.className = 'colun-full row justify-center search-bar-padding';
  $infoText.className = 'row justify-center align-center hidden';
  $myDeckView.className = 'row justify-center align-center';
}

function myDeckAppears(event) {
  event.preventDefault();
  $newDeck.className = 'new-deck';
  $cardCount.className = 'minor-padding column-full row space-between hidden';
  $searchBarDiv.className = 'colun-full row justify-center hidden';
  $infoText.className = 'row justify-center align-center hidden';
  $myDeckView.className = 'row justify-center align-center';
}

function newDeck(event) {
  event.preventDefault();
  $newDeck.className = 'new-deck hidden';
  $cardCount.className = 'minor-padding column-full row space-between';
  $searchBarDiv.className = 'colun-full row justify-center hidden';
  $infoText.className = 'row justify-center align-center';
  $myDeckView.className = 'row justify-center align-center';
}

$myDeck.addEventListener('click', myDeckAppears);
$search.addEventListener('click', searchBarAppears);
$noDeck.addEventListener('click', newDeck);
$addCard.addEventListener('click', searchBarAppears);
$logo.addEventListener('click', myDeckAppears);

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
