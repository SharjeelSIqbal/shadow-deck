const $searchBar = document.querySelector('.search-bar');
const $cardRow = document.querySelector('#card-row');
let currentPage = 0;
let currentData = [];
let currentImage;
let searchedResult;

if (data.numberOfDecks > 0) {
  appendDeck(data.deck[0]);
  document.querySelector('#no-decks-available').className = 'hidden';
  document.querySelector('nav').className = '';
  if (data.deck[0].cards.length !== 0) {
    setStrongestMonsterPlaceHolder();
  }
}

function setStrongestMonsterPlaceHolder() {
  const cardPlaceHolder = document.querySelector('.no-deck');
  let strongestMonsterAtk = 0;
  let strongestMonster;
  if (data.deck[0].cards.length === 0) {
    cardPlaceHolder.src = 'images/yugioh-card-deck.png';
    cardPlaceHolder.className = 'card-deck view-swap no-deck';
  } else {
    for (let i = 0; i < data.deck[0].cards.length; i++) {
      const card = data.deck[0].cards[i];
      if (card.type !== 'Spell Card' && card.type !== 'Trap Card') {
        strongestMonsterAtk = card.atk;
        strongestMonster = card;
        cardPlaceHolder.setAttribute('src', strongestMonster.card_images[0].image_url);
        cardPlaceHolder.className = 'card-deck view-swap card-placeholder no-deck';
      } else if (strongestMonsterAtk === 0) {
        cardPlaceHolder.src = 'images/yugioh-card-deck.png';
        cardPlaceHolder.className = 'card-deck view-swap no-deck';
      }
    }
  }
  return cardPlaceHolder[0];
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
  if (!document.querySelector('#deck-card-collector')) {
    deckView.append(deckViewDiv);
  }
  for (let i = 0; i < deck.cards.length; i++) {
    const imager = document.createElement('img');
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
  event.preventDefault();
  if (event.target.matches('.submit')) {
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
  if (inputValue !== '') {
    resetSearch();
    current20();
    const $error = document.querySelector('#error');
    const $loading = document.querySelector('#loading');
    const $network = document.querySelector('#network');
    const yugiohIndex = new XMLHttpRequest();
    yugiohIndex.onloadstart = function () {
      $loading.className = 'row justify-center align-center';
      $error.className = 'hidden';
      $network.className = 'hidden';
    };
    yugiohIndex.onloadend = function () {

      $loading.className = 'hidden';
      if (yugiohIndex.status >= 400) {
        $error.className = 'row justify-center align-center';
      } else if (yugiohIndex.status === 0) {
        $network.className = 'row justify-center align-center';
      }
    };
    yugiohIndex.open('GET', 'https://db.ygoprodeck.com/api/v7/cardinfo.php?&fname=' + inputValue);
    yugiohIndex.responseType = 'json';
    yugiohIndex.addEventListener('load', function () {
      pages(yugiohIndex.response.data, currentPage);
    });
    yugiohIndex.send();
  }
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
  if (data) {
    const listDataNumber = (pageNumber + 1) * 20;
    const capped20Array = [];
    const endPage = Math.ceil(data.length / 20);
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
  if (count > total) {
    $currentCards.textContent = `${count - 19}-${total} of ${total}`;
  } else {
    $currentCards.textContent = `${count - 19}-${count} of ${total}`;
  }
  $currentCardsRow.className = 'row justify-center align-center column-full';

  $currentCardsRow.append($currentCards);
  $cardRow.append($currentCardsRow);
  return $cardRow;
}

function resetSearch() {
  const resetSearch = $cardRow.children;
  for (let i = resetSearch.length - 1; resetSearch.length !== 0; i--) {
    resetSearch[i].remove();
  }
  currentData = [];

}

document.addEventListener('click', nextPrevPage);

function newDeck(event) {

  if (event.target.getAttribute('id') !== 'no-deck') {
    return;
  }
  document.querySelector('nav').className = '';
  document.querySelector('#no-decks-available').className = 'hidden';
  if (data.numberOfDecks === 0) {
    data.numberOfDecks++;
    data.deck.push({
      deck: data.numberOfDecks,
      cards: [],
      deckView: 'deck-' + data.numberOfDecks
    });
  }
  if (data.numberOfDecks === 1) {
    appendDeck(data.deck[0]);
  }
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
        imager.src = currentData[currentImage].card_images[0].image_url;
        deckRow.append(imager);
        updateCounter();
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

    for (let i = 0; i < deckCards.length; i++) {
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
      updateCounter();
      setStrongestMonsterPlaceHolder();

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
  $modal.className = 'modal row justify-center align-center';
  $modalBack.className = 'modal-appear';
}

function current20() {
  const yugiohIndex = new XMLHttpRequest();
  yugiohIndex.open('GET', 'https://db.ygoprodeck.com/api/v7/cardinfo.php?&fname=' + searchedResult);
  yugiohIndex.responseType = 'json';
  yugiohIndex.addEventListener('load', function () {
    if (yugiohIndex.status !== 400) {
      const listDataNumber = (currentPage + 1) * 20;
      for (let i = currentPage * 20; i < listDataNumber; i++) {
        if (yugiohIndex.response.data[i]) {
          currentData.push(yugiohIndex.response.data[i]);
        }
      }
    }
  });
  yugiohIndex.send();
}

function addCardToDeck(card) {
  if (data.deck[0].cards.length >= 50) {
    return;
  }
  data.deck[0].cards.push(card);
  if (card.type !== 'Spell Card' && card.type !== 'Trap Card') {
    setStrongestMonsterPlaceHolder();
  }
  updateCounter();
}

document.addEventListener('click', addDeleteCard);

function updateCounter() {
  const cardCounter = document.querySelector('#card-count');
  cardCounter.textContent = data.deck[0].cards.length + '/50';
}
