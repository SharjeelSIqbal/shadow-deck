var $searchBar = document.querySelector('.search-bar');
var $cardRow = document.querySelector('#card-row');
var currentPage = 0;
var currentData = [];
var currentImage;

if (data.numberOfDecks !== 0) {
  appendDeck(data.deck[0]);
  document.querySelector('#no-decks-available').remove();
  document.querySelector('nav').className = '';
  if (data.deck[0].cards) {
    strongestMonsterPlaceHolder(0);
  }
}

function strongestMonsterPlaceHolder(deckNumber) {
  var cardPlaceHolder = document.querySelector('#no-deck');
  var strongestMonsterAtk = 0;
  var strongestMonster;
  for (var i = 0; i < data.deck[deckNumber].cards.length; i++) {
    var card = data.deck[deckNumber].cards[i];
    if (card.atk && card.atk > strongestMonsterAtk) {
      strongestMonsterAtk = card.atk;
      strongestMonster = card;
      cardPlaceHolder.setAttribute('src', strongestMonster.card_images[0].image_url);
      cardPlaceHolder.className = 'card-deck view-swap card-placeholder';
    } else if (strongestMonsterAtk === 0) {
      cardPlaceHolder.src = 'images/yugioh-card-deck.png';
      cardPlaceHolder.className = 'card-deck view-swap';
    }
  }

  return cardPlaceHolder;
}

function appendDeck(deck) {
  var deckView = document.querySelector('#deck-row');
  var deckViewDiv = document.createElement('div');
  var cardCount = document.querySelector('#card-count');
  cardCount.textContent = deck.cards.length + '/50';
  deckViewDiv.className = 'row justify-center align-center wrap';
  deckViewDiv.setAttribute('id', 'deck-card-collector');
  deckViewDiv.setAttribute('data-deck', deck.deckView);
  deckView.append(deckViewDiv);
  for (var i = 0; i < deck.cards.length; i++) {
    var imager = document.createElement('img');
    imager.className = 'small-card card';
    imager.setAttribute('src', deck.cards[i].card_images[0].image_url);
    deckViewDiv.append(imager);
  }
  return deckView;
}

function switchView(dataView) {
  var $tabView = document.querySelectorAll('.tab-view');
  for (var i = 0; i < $tabView.length; i++) {
    if ($tabView[i].getAttribute('data-view') === dataView) {
      $tabView[i].className = 'tab-view';
      data.view = $tabView[i].getAttribute('data-view');
    } else {
      $tabView[i].className = 'tab-view hidden';
    }
  }
}
function switchViewing(event) {
  event.preventDefault();
  if (!event.target.matches('.view-swap')) {
    return;
  }
  switchView(event.target.getAttribute('data-view'));
}
document.addEventListener('click', switchViewing);

function search(inputValue) {
  resetSearch();
  current20();
  var yugiohIndex = new XMLHttpRequest();
  yugiohIndex.open('GET', 'https://db.ygoprodeck.com/api/v7/cardinfo.php?&fname=' + inputValue);
  yugiohIndex.responseType = 'json';
  yugiohIndex.addEventListener('load', function () {
    if (inputValue !== '') {
      pages(yugiohIndex.response.data, currentPage);
    }
  });
  yugiohIndex.send();
}

function nextPrevPage(event) {
  event.preventDefault();
  if (!event.target.matches('.next-page') && !event.target.matches('.prev-page')) {
    return;
  }
  if (event.target.matches('.next-page')) {
    currentPage++;
  } if (event.target.matches('.prev-page')) {
    currentPage--;
  }
  search($searchBar.value);
}

function pages(data, pageNumber) {
  var listDataNumber = (pageNumber + 1) * 20;
  var capped20Array = [];
  var endPage = Math.ceil(data.length / 20);
  createNextPage(pageNumber, endPage);
  pageIndexCount(listDataNumber, data.length);
  for (var i = pageNumber * 20; i < listDataNumber; i++) {
    if (data[i]) {
      capped20Array.push(data[i]);
    }
  }
  for (i = 0; i < capped20Array.length; i++) {
    uploadCard(capped20Array[i].card_images[0].image_url);
  }
}

function uploadCard(srcValue) {
  var $newCard = document.createElement('img');

  $newCard.setAttribute('src', srcValue);
  $newCard.className = 'card small-card';

  $cardRow.append($newCard);
  return $cardRow;
}

function searchInput(event) {
  search($searchBar.value);
  currentPage = 0;
}

function createNextPage(pageNumber, endPage) {
  var pageDivHolder = document.createElement('div');
  pageDivHolder.className = 'column-full row space-evenly align-center';
  if (pageNumber > 0) {
    var prevPage = document.createElement('a');
    prevPage.className = 'prev-page nav-links';
    prevPage.textContent = 'Prev';
    pageDivHolder.append(prevPage);
  }
  if (pageNumber < endPage - 1) {
    var nextPage = document.createElement('a');
    nextPage.className = 'next-page nav-links';
    nextPage.textContent = 'Next';
    pageDivHolder.append(nextPage);
  }
  $cardRow.append(pageDivHolder);
  return $cardRow;
}

function pageIndexCount(count, total) {
  var $currentCardsRow = document.createElement('div');
  var $currentCards = document.createElement('h2');
  $currentCards.className = 'nav-links';
  $currentCards.textContent = count - 19 + '-' + count + ' of ' + total;
  $currentCardsRow.className = 'row justify-center align-center column-full';

  $currentCardsRow.append($currentCards);
  $cardRow.append($currentCardsRow);
  return $cardRow;
}

function resetSearch() {
  var resetSearch = $cardRow.children;
  for (var i = resetSearch.length - 1; resetSearch.length !== 0; i--) {
    resetSearch[i].remove();
  }
  currentData = [];

}
$searchBar.addEventListener('blur', searchInput);
document.addEventListener('click', nextPrevPage);

function newDeck(event) {
  if (event.target.getAttribute('id') !== 'no-deck') {
    return;
  }
  data.numberOfDecks++;
  data.deck.push({
    deck: data.numberOfDecks,
    cards: [],
    deckView: 'deck-' + data.numberOfDecks
  });
  appendDeck(data.deck[0]);
  if (data.numberOfDecks > 0) {
    document.querySelector('nav').className = '';
    document.querySelector('#no-decks-available').className = 'hidden';
  }
}
document.addEventListener('click', newDeck);

function addDeleteCard(event) {
  var $modalImage = document.querySelector('#add-image>img');
  if (data.view === 'search') {
    if ($cardRow.children) {
      var srcImage;
      var cards = $cardRow.getElementsByTagName('img');
      var $add = document.querySelector('#add-image');
      for (var i = 0; i < cards.length; i++) {
        if (event.target === cards[i]) {
          currentImage = i;
          srcImage = cards[i].getAttribute('src');
          document.querySelector('.question').textContent = 'Add ' + currentData[i].name + ' to your deck?';
          var newModal = document.createElement('img');
          newModal.setAttribute('src', srcImage);
          newModal.className = 'desktop-friendly mobile-friendly';
          $add.prepend(newModal);
          modalAppears();
        }
      }
      if (event.target === document.querySelector('.confirm')) {

        addCardToDeck(currentData[currentImage], 0);

        var deckRow = document.querySelector('#deck-card-collector');
        var imager = document.createElement('img');
        imager.className = 'small-card card';
        imager.setAttribute('src', currentData[currentImage].card_images[0].image_url);
        deckRow.append(imager);
        updateCounter(0);
        modalHide();
        $modalImage.remove();
      }
    }
    if (event.target === document.querySelector('.cancel')) {
      $modalImage.remove();
      modalHide();
    }
  }
  if (data.view === 'deck') {
    var deckCards = document.querySelectorAll('#deck-card-collector>img');
    var chosenCardSRC = '';

    for (i = 0; i < deckCards.length; i++) {
      if (event.target === deckCards[i]) {
        currentImage = i;
        chosenCardSRC = deckCards[i].getAttribute('src');
        document.querySelector('.question').textContent = 'Delete ' + data.deck[0].cards[i].name + ' from your deck?';
        var $deleteCard = document.createElement('img');
        $deleteCard.src = chosenCardSRC;
        $deleteCard.className = 'desktop-friendly mobile-friendly';
        document.querySelector('#add-image').prepend($deleteCard);

        modalAppears();

      }
    }
    if (event.target === document.querySelector('.confirm')) {
      modalHide();
      $modalImage.remove();
      deckCards[currentImage].remove();
      data.deck[0].cards.splice(currentImage, 1);
      strongestMonsterPlaceHolder(0);
      updateCounter(0);

    }
    if (event.target === document.querySelector('.cancel')) {
      $modalImage.remove();
      modalHide();
    }
  }

}

function modalHide() {
  var $modalBack = document.querySelector('#modal-background');
  var $modal = document.querySelector('#modal');
  $modal.className = 'modal hidden';
  $modalBack.className = 'modal-appear hidden';
}

function modalAppears() {
  var $modalBack = document.querySelector('#modal-background');
  var $modal = document.querySelector('#modal');
  $modal.className = 'modal';
  $modalBack.className = 'modal-appear';
}

function current20() {
  var yugiohIndex = new XMLHttpRequest();
  var $error = document.querySelector('#error');
  yugiohIndex.onloadstart = function () {
    document.querySelector('#loading').className = 'row justify-center align-center';
    $error.className = 'hidden';
  };
  yugiohIndex.onloadend = function () {
    document.querySelector('#loading').className = 'hidden';
  };
  yugiohIndex.open('GET', 'https://db.ygoprodeck.com/api/v7/cardinfo.php?&fname=' + $searchBar.value);
  yugiohIndex.responseType = 'json';

  yugiohIndex.addEventListener('load', function () {
    if (yugiohIndex.status === 400) {
      $error.className = 'row justify-center align-center';
    } else {

      var listDataNumber = (currentPage + 1) * 20;
      for (var i = currentPage * 20; i < listDataNumber; i++) {
        if (yugiohIndex.response.data[i]) {
          currentData.push(yugiohIndex.response.data[i]);
        }
      }
    }
  });

  yugiohIndex.send();
}

function addCardToDeck(dataGiven, deckNumber) {

  if (data.deck[deckNumber].cards.length < 50) {
    data.deck[deckNumber].cards.push(dataGiven);
    strongestMonsterPlaceHolder(0);
  }
}

document.addEventListener('click', addDeleteCard);

function updateCounter(deckCounter) {
  var cardCounter = document.querySelector('#card-count');
  cardCounter.textContent = data.deck[deckCounter].cards.length + '/50';
}
