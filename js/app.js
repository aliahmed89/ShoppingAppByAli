/**
 * Created by ali.ahmed on 6/29/2017.
 */
// app.js
var app = angular.module('shoppingApp', ['ui.router','shoppingApp.controllers','shoppingApp.services','treeControl']);

app.run(function($rootScope,$state) {
   var cart=JSON.parse(localStorage.getItem('products'));
    if(cart==undefined || cart==null){
        $rootScope.cartCount=0;
    }
    else{
        $rootScope.cartCount=cart.length;
    }

});


app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('home', {
            url: '/home',
            templateUrl: 'templates/home.html',
            controller:'HomeCtrl'
        })
        .state('products', {
            url: '/products',
            templateUrl: 'templates/products.html',
            controller:'ProductsCtrl'
        })
        .state('cart', {
            url: '/cart',
            templateUrl: 'templates/cart.html',
            controller:'CartCtrl'
        })

    $urlRouterProvider.otherwise('/home');

});
