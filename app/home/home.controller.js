angular.module('myApp')

.controller('HomeController', ['$scope', '$geolocation', 'openweathermapFactory', '$http',
  function($scope, $geolocation, openweathermapFactory, $http) {
    $scope.userDenied = false;
    $scope.loading = false;
    $scope.location = {};

    // get the specified location by City Name
    // List of 2,000 cities are provided.
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
        $scope.positionReady = true;

      }).catch(function(error) {
        console.log(error);
        toastr.error('Could not complete task', 'Some error happened. See console for details');
      })
    };

    $scope.requestCoord = function() {
      $scope.loading = true;
      console.log($scope.location);
      doWeather($scope.location);
      $scope.positionReady = true;
    }

    doWeather = function(position) {
      $scope.loading = true;
      toastr.info('Going to fetch report', 'Hold on tight!');

      // get the weather report
      openweathermapFactory.getWeatherFromLocationByCoordinates({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        appid: "95fce1ea5c2190183b85f3e518de44cd"
      }).then(function(data) {
        $scope.loading = false;
        $scope.position = data;
        console.log(data);
        toastr.info('Weather report is ready');
      }).catch(function(error) {
        console.log(error);
        toastr.error('Could not complete task', 'Some error happened. See console for details');
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
        toastr.error('You denied access to Geolocation. Switching to manual mode.', 'No location available')
          // only of 2,000 in number to speed up things.
        $http.get('./assets/city.list.json')
          .then(function(data) {
            // console.log(data.data);
            $scope.cities = data.data
            toastr.info('List of cities finished loading', 'Cities are loaded.')
          })
          .catch(function(error) {
            toastr.error('Could not complete task', 'Some error happened. See console for details');
            console.log(error);
          })
      })
  }
])
