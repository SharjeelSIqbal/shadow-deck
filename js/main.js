var $searchBar = document.querySelector('.search-bar');

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
  var $viewSwapper = document.querySelectorAll('.view-swap');
  for (var i = 0; i < $viewSwapper.length; i++) {
    if ($viewSwapper[i] === event.target) {
      var dataView = $viewSwapper[i].getAttribute('data-view');
      switchView(dataView);
    }
  }
}
document.addEventListener('click', switchViewing);

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
