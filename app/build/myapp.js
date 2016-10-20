angular.module('myApp', ['ui.router', 'ngGeolocation', 'ngProgress', 'ui.router.title', 'jtt_openweathermap', 'ngMap'])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider) {

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'home/home.html',
        controller: 'HomeController',
        meta: {
          title: 'Homepage',
          description: 'Your Favorite Programming Languages, Side By Side'
        },
      })

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
  }
])

.run(['$rootScope', '$state', '$location', 'ngProgressFactory',
  function($rootScope, $state, $location, ngProgressFactory) {
    // ngMeta.init();
    var progress = ngProgressFactory.createInstance();
    var afterLogin;


    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      progress.start();
    });

    $rootScope.$on('$stateChangeSuccess', function() {
      $rootScope.title = $state.current.meta.title;
      $rootScope.description = $state.current.meta.description;
      progress.complete();
    });
  }
])

angular.module('myApp')

.controller('HomeController', ['$scope', '$geolocation', 'openweathermapFactory', '$http',
  function($scope, $geolocation, openweathermapFactory, $http) {
    $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE";
    $scope.userDenied = false;
    $scope.loading = false;
    $scope.location = {};
    
    // get the specified location by lat,long from user
    $scope.requestCity = function() {
      $scope.loading = true;
      console.log($scope.location);
      openweathermapFactory.getWeatherFromCitySearchByName({
        q: $scope.location.name,
        appid: "95fce1ea5c2190183b85f3e518de44cd"
      }).then(function(data) {
        $scope.loading = false;
        $scope.position = data;
        console.log(data);
      }).catch(function(error) {
        console.log(error);
      })
    };

    $scope.requestCoord = function() {
      $scope.loading = true;
      console.log($scope.location);
      doWeather($scope.location);
    }

    doWeather = function(position) {
      $scope.loading = true;
      // get the weather report
      openweathermapFactory.getWeatherFromLocationByCoordinates({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        appid: "95fce1ea5c2190183b85f3e518de44cd"
      }).then(function(data) {
        $scope.loading = false;
        $scope.position = data;
        console.log(data);
      }).catch(function(error) {
        console.log(error);
      })
    };

    $geolocation.getCurrentPosition({
        timeout: 6000
      }).then(function(position) {
        $scope.position = position;
        console.log(position);

        // start rendering <ng-map></ng-map> 
        // only after position above are available
        $scope.positionReady = true;
        // get the location with coordinates
        doWeather(position);

      })
      .catch(function(error) {
        console.log(error);
        $scope.userDenied = true;
        // only of 2,000 in number to speed up things.
        $http.get('./assets/city.list.json')
          .then(function(data) {
            // console.log(data.data);
            $scope.cities = data.data
          })
          .catch(function(error) {
            console.log(error);
          })
      })
  }
])


$(document).foundation();

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}
