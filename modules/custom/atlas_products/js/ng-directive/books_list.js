myApp.directive('ngBooksList', ['$http', ngBooksList]);

function ngBooksList($http) {

  return {
    restrict: 'EA',
    controller: BooksController,
    link: linkFunc
  };

  function linkFunc(scope, el, attr, ctrl) {
    var config = drupalSettings.booksListBlockConfig[scope.uuid];
    retrieveInformation(scope, config, el);

    scope.apiIsLoading = function() {
      return $http.pendingRequests.length > 0;
    };

    scope.$watch(scope.apiIsLoading, function(v) {
      if (v == false) {
        if(undefined !== scope.books[scope.uuid]){
          if(scope.books[scope.uuid].error != true){
            jQuery(el).parents("section").fadeIn(400);
          }
        }
      }
    });

  }

  function retrieveInformation(scope, config, el) {
    if ( scope.resources.indexOf(config.url) == -1){
      var uuid = scope.uuid;
      $http.get(config.url)
        .then(function (resp) {
          scope.books[uuid] = resp.data;
        }, function (resp){
          console.log(resp);
          drupal_set_message(Drupal.t("En este momento no podemos obtener tus productos, intenta de nuevo mas tarde."),"error", scope.uuid);
          scope.products[uuid].error = true;
        });
    }
  }
}

BooksController.$inject = ['$scope'];

function BooksController($scope) {
  // Init vars
  if(  typeof $scope.books == 'undefined'){
    $scope.books = [];
  }
  if(  typeof $scope.books[$scope.uuid] == 'undefined'){
    $scope.books[$scope.uuid] = [];
  }

  if (typeof $scope.resources == 'undefined') {
    $scope.resources = [];
  }
}