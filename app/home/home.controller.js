angular.module('myApp')

.controller('HomeController', ['$scope', '$geolocation', 'openweathermapFactory', '$http',
  function($scope, $geolocation, openweathermapFactory, $http) {
    $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=YOUR_KEY_HERE";
    $scope.userDenied = false;
    $scope.location = {};
    // get the location from User
    manualRequest = function() {
      console.log($scope.location);
      // openweathermapFactory.getWeatherFromCitySearchByName({
      //   q: location.name,
      //   appid: "95fce1ea5c2190183b85f3e518de44cd"
      // }).then(function(data) {
      //   $scope.weather = data;
      //   console.log(data);
      // }).catch(function(error) {
      //   console.log(error);
      // })
    };

    $geolocation.getCurrentPosition({
        timeout: 6000
      }).then(function(position) {
        $scope.position = position;
        console.log(position);

        // start rendering <ng-map></ng-map> 
        // only after position above are available
        $scope.positionReady = true;

        // get the weather report
        openweathermapFactory.getWeatherFromLocationByCoordinates({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          appid: "95fce1ea5c2190183b85f3e518de44cd"
        }).then(function(data) {
          $scope.weather = data;
          console.log(data);
        }).catch(function(error) {
          console.log(error);
        })
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
