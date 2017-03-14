var MokiIndicadoresApp = angular.module('MokiIndicadoresApp', ['dx', 'ngRoute']);

MokiIndicadoresApp.run(function ($rootScope) {
    $rootScope.apiHost = 'http://localhost:1613/api/';
    //$rootScope.apiHost = 'http://webapi.cncorp.com.br/api/';
    $rootScope.messageDelay = 1500;
    $rootScope.httpConfig = { 'Authorization': 'Basic dGVzdDp0ZXN0', 'Content-Type': 'application/x-www-form-urlencoded' };
});

MokiIndicadoresApp.config(function ($routeProvider) {
    $routeProvider
        .when('/categorias', {
            templateUrl: '/views/indicadores/categorias.html',
            controller: 'CategoriaController'
        })
        .when('/indicadores', {
            templateUrl: '/views/indicadores/indicadoresadmin.html',
            controller: 'IndicadorController'
        })
        .when('/valores', {
            templateUrl: '/views/indicadores/LancamentoValores.html',
            controller: 'LancamentoValoresController'
        })
        .when('/metas', {
            templateUrl: '/views/indicadores/LancamentoMetas.html',
            controller: 'LancamentoMetasController'
        })
        .when('/graficos', {
            templateUrl: '/views/indicadores/graficos.html',
            controller: 'GraficosController'
        })
});


MokiIndicadoresApp.controller('mainController', function mainController($scope, $filter, $rootScope) {
    // create a message to display in our view
    $scope.message = 'Minha Home';
    $scope.date = new Date();
    $scope.dateYYYY = $filter('date')(new Date(), 'yyyy');
});