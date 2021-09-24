const $searchBar = document.querySelector('.search-bar');
const $cardRow = document.querySelector('#card-row');
let currentPage = 0;
let currentData = [];
let currentDeck = 0;
let currentImage;
let searchedResult;

if (data.numberOfDecks > 0) {
  appendDeck(data.deck[0]);
  document.querySelector('#no-decks-available').className = 'hidden';
  document.querySelector('nav').className = '';
  for(let i = 0; i < data.numberOfDecks; i++){
    if(data.deck[i].cards.length !== 0){
      strongestMonsterPlaceHolder(i)
    }
  }
}

function strongestMonsterPlaceHolder(deckNumber) {
  const cardPlaceHolderAll = document.querySelectorAll('.no-deck');
    let cardPlaceHolder = cardPlaceHolderAll[deckNumber];
    let strongestMonsterAtk = 0;
    let strongestMonster;
    for (let i = 0; i < data.deck[deckNumber].cards.length; i++) {
      let card = data.deck[deckNumber].cards[i];
      if (card.atk && card.atk > strongestMonsterAtk) {
        strongestMonsterAtk = card.atk;
        strongestMonster = card;

        cardPlaceHolder.setAttribute('src', strongestMonster.card_images[0].image_url);
        cardPlaceHolder.className = 'card-deck view-swap card-placeholder no-deck';
      } else if (strongestMonsterAtk === 0) {
        cardPlaceHolder.src = 'images/yugioh-card-deck.png';
        cardPlaceHolder.className = 'card-deck view-swap';
      }
    }
    return cardPlaceHolder[deckNumber];
}

function appendDeck(deck) {
  const deckView = document.querySelector('#deck-row');
  const deckViewDiv = document.createElement('div');
  const cardCount = document.querySelector('#card-count');
  cardCount.textContent = deck.cards.length + '/50';
  deckViewDiv.className = 'row justify-center align-center wrap';
  deckViewDiv.setAttribute('id', 'deck-card-collector');
  deckViewDiv.setAttribute('data-deck', deck.deckView);
  deckViewDiv.setAttribute('deck-view', 'tab-deck');
  deckView.append(deckViewDiv);
  for (let i = 0; i < deck.cards.length; i++) {
    let imager = document.createElement('img');
    imager.className = 'small-card card';
    imager.setAttribute('src', deck.cards[i].card_images[0].image_url);
    deckViewDiv.append(imager);
  }
  return deckView;
}

function switchView(dataView) {
  const $tabView = document.querySelectorAll('.tab-view');
  for (let i = 0; i < $tabView.length; i++) {
    if ($tabView[i].getAttribute('data-view') === dataView) {
      $tabView[i].className = 'tab-view';
      data.view = $tabView[i].getAttribute('data-view');
    } else {
      $tabView[i].className = 'tab-view hidden';
    }
  }
}

function handleSubmit(event) {
  if (event.target.className === 'submit search-icon') {
    currentPage = 0;
    searchedResult = $searchBar.value;
    search(searchedResult);
    document.querySelector('form').reset();
  }
}
document.addEventListener('click', handleSubmit);

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
  const $error = document.querySelector('#error')
  const $loading = document.querySelector('#loading');
  const yugiohIndex = new XMLHttpRequest();
  yugiohIndex.onloadstart = function () {
    $loading.className = 'row justify-center align-center';
    $error.className = 'hidden';
  };
  yugiohIndex.onloadend = function () {
    $loading.className = 'hidden';
  };
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
  search(searchedResult);
}

function pages(data, pageNumber) {
  let listDataNumber = (pageNumber + 1) * 20;
  let capped20Array = [];
  let endPage = Math.ceil(data.length / 20);
  createNextPage(pageNumber, endPage);
  pageIndexCount(listDataNumber, data.length);
  for (let i = pageNumber * 20; i < listDataNumber; i++) {
    if (data[i]) {
      capped20Array.push(data[i]);
    }
  }
  for (let i = 0; i < capped20Array.length; i++) {
    uploadCard(capped20Array[i].card_images[0].image_url);
  }
}

function uploadCard(srcValue) {
  const $newCard = document.createElement('img');

  $newCard.setAttribute('src', srcValue);
  $newCard.className = 'card small-card';

  $cardRow.append($newCard);
  return $cardRow;
}


function createNextPage(pageNumber, endPage) {
  const pageDivHolder = document.createElement('div');
  pageDivHolder.className = 'column-full row space-evenly align-center';
  if (pageNumber > 0) {
    const prevPage = document.createElement('a');
    prevPage.className = 'prev-page nav-links';
    prevPage.textContent = 'Prev';
    pageDivHolder.append(prevPage);
  }
  if (pageNumber < endPage - 1) {
    const nextPage = document.createElement('a');
    nextPage.className = 'next-page nav-links';
    nextPage.textContent = 'Next';
    pageDivHolder.append(nextPage);
  }
  $cardRow.append(pageDivHolder);
  return $cardRow;
}

function pageIndexCount(count, total) {
  const $currentCardsRow = document.createElement('div');
  const $currentCards = document.createElement('h2');
  $currentCards.className = 'nav-links';
  $currentCards.textContent = count - 19 + '-' + count + ' of ' + total;
  $currentCardsRow.className = 'row justify-center align-center column-full';

  $currentCardsRow.append($currentCards);
  $cardRow.append($currentCardsRow);
  return $cardRow;
}

function resetSearch() {
  let resetSearch = $cardRow.children;
  for (let i = resetSearch.length - 1; resetSearch.length !== 0; i--) {
    resetSearch[i].remove();
  }
  currentData = [];

}
;
document.addEventListener('click', nextPrevPage);

function newDeck(event) {
  if (event.target.getAttribute('id') !== 'no-deck') {
    return;
  }
  document.querySelector('nav').className = '';
  document.querySelector('#no-decks-available').className = 'hidden';
  data.numberOfDecks++;
  data.deck.push({
    deck: data.numberOfDecks,
    cards: [],
    deckView: 'deck-' + data.numberOfDecks
  });
  if(data.numberOfDecks === 1){
    appendDeck(data.deck[0]);
  }

  // currentDeck = data.numberOfDecks;
  // if (data.numberOfDecks > 0) {
  //   document.querySelector('nav').className = '';
  //   document.querySelector('#no-decks-available').className = 'hidden';
  // }
}
document.addEventListener('click', newDeck);

function addDeleteCard(event) {
  const $modalImage = document.querySelector('#add-image>img');
  if (data.view === 'search') {
    if ($cardRow.children) {
      let srcImage;
      const cards = $cardRow.getElementsByTagName('img');
      const $add = document.querySelector('#add-image');
      for (let i = 0; i < cards.length; i++) {
        if (event.target === cards[i]) {
          currentImage = i;
          srcImage = cards[i].getAttribute('src');
          document.querySelector('.question').textContent = 'Add ' + currentData[i].name + ' to your deck?';
          const newModal = document.createElement('img');
          newModal.setAttribute('src', srcImage);
          newModal.className = 'desktop-friendly mobile-friendly';
          $add.prepend(newModal);
          modalAppears();
        }
      }
      if (event.target === document.querySelector('.confirm')) {
        addCardToDeck(currentData[currentImage], 0);
        const deckRow = document.querySelector('#deck-card-collector');
        const imager = document.createElement('img');
        imager.className = 'small-card card';
        imager.src =  currentData[currentImage].card_images[0].image_url;
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
    const deckCards = document.querySelectorAll('#deck-card-collector>img');
    let chosenCardSRC = '';

    for (i = 0; i < deckCards.length; i++) {
      if (event.target === deckCards[i]) {
        currentImage = i;
        chosenCardSRC = deckCards[i].getAttribute('src');
        document.querySelector('.question').textContent = 'Delete ' + data.deck[0].cards[i].name + ' from your deck?';
        const $deleteCard = document.createElement('img');
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
  const $modalBack = document.querySelector('#modal-background');
  const $modal = document.querySelector('#modal');
  $modal.className = 'modal hidden';
  $modalBack.className = 'modal-appear hidden';
}

function modalAppears() {
  const $modalBack = document.querySelector('#modal-background');
  const $modal = document.querySelector('#modal');
  $modal.className = 'modal';
  $modalBack.className = 'modal-appear';
}

function current20() {
  const yugiohIndex = new XMLHttpRequest();
  const $error = document.querySelector('#error');
  yugiohIndex.open('GET', 'https://db.ygoprodeck.com/api/v7/cardinfo.php?&fname=' + searchedResult);
  yugiohIndex.responseType = 'json';

  yugiohIndex.addEventListener('load', function () {
    if (yugiohIndex.status === 400) {
      $error.className = 'row justify-center align-center';
    } else {

      let listDataNumber = (currentPage + 1) * 20;
      for (let i = currentPage * 20; i < listDataNumber; i++) {
        if (yugiohIndex.response.data[i]) {
          currentData.push(yugiohIndex.response.data[i]);
        }
      }
    }
  });
  yugiohIndex.send();
}

function addCardToDeck(dataGiven, deckNumber) {
  if (data.deck[deckNumber].cards.length < 51) {
    data.deck[deckNumber].cards.push(dataGiven);
    strongestMonsterPlaceHolder(deckNumber);
  }
}

document.addEventListener('click', addDeleteCard);

function updateCounter(deckCounter) {
  const cardCounter = document.querySelector('#card-count');
  cardCounter.textContent = data.deck[deckCounter].cards.length + '/50';
}

function multipleDecks(){
  return;
}
