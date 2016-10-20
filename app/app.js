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
