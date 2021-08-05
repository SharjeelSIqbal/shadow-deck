/* exported data */
var data = {
  numberOfDecks: 0,
  view: 'new',
  deck: []
};

function localStorageJSON(event) {
  return localStorage.setItem('deck-data', JSON.stringify(data));
}

window.addEventListener('beforeunload', localStorageJSON);

var previousDeckData = localStorage.getItem('deck-data');
if (previousDeckData !== null) {
  data = JSON.parse(previousDeckData);
}
