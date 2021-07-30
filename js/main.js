var $searchBar = document.querySelector('.search-bar');
var $cardRow = document.querySelector('#card-row');
var currentPage = 0;
var currentData = [];
var currentImage;
function switchView(dataView) {
  var $tabView = document.querySelectorAll('.tab-view');
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
  document.querySelector('#no-decks-available').remove();
}
document.addEventListener('click', newDeck);

function addCard(event) {
  if ($cardRow.children) {
    var srcImage;
    var $modalImage = document.querySelector('#add-image>img');
    var cards = $cardRow.getElementsByTagName('img');
    var $add = document.querySelector('#add-image');
    for (var i = 0; i < cards.length; i++) {
      if (event.target === cards[i]) {
        currentImage = i;
        srcImage = cards[i].getAttribute('src');
        document.querySelector('.question').textContent = 'Add ' + currentData[i].name + ' to your deck?';
        var newModal = document.createElement('img');
        newModal.setAttribute('src', srcImage);
        newModal.className = 'column-full mobile-friendly';
        $add.prepend(newModal);
        modalAppears();
      }
    }
    if (event.target === document.querySelector('.confirm')) {

      addCardToDeck(currentData[currentImage], 0);
      // pushCard(src);
      modalHide();
      $modalImage.remove();
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
  yugiohIndex.open('GET', 'https://db.ygoprodeck.com/api/v7/cardinfo.php?&fname=' + $searchBar.value);
  yugiohIndex.responseType = 'json';
  yugiohIndex.addEventListener('load', function () {
    var listDataNumber = (currentPage + 1) * 20;
    for (var i = currentPage * 20; i < listDataNumber; i++) {
      if (yugiohIndex.response.data[i]) {
        currentData.push(yugiohIndex.response.data[i]);
      }
    }
  });
  yugiohIndex.send();
}

function addCardToDeck(dataGiven, deckNumber) {
  data.deck[deckNumber].cards.push(dataGiven);
}

document.addEventListener('click', addCard);
