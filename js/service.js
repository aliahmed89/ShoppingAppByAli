/**
 * Created by ali.ahmed on 6/29/2017.
 */

angular.module('shoppingApp.services',[])

    .service('ApplicationService', function($q,$http,$rootScope) {
        var cartCount=0;
        return {
        getCategories:function () {
            var deferred = $q.defer();
            $http.get('/ShoppingCartApp/categories.json').then(function(response) {
                if (response.data.length > 0) {
                    var categories = response.data;
                    deferred.resolve(categories);
                }
            }, function(err) {
                console.log(err);
                deferred.reject(err);
            });
            return deferred.promise;
        },

            getRelevantProducts:function (cId) {
                var deferred = $q.defer();
                var relevantpds=[];
                var count=0;
                var cart=JSON.parse(localStorage.getItem('products'));
                $http.get('/ShoppingCartApp/products.json').then(function(response) {
                    if (response.data.length > 0) {
                        var products = response.data;
                        for(var pd=0;pd<products.length;pd++){
                            if(products[pd].categoryId==cId){
                                relevantpds.push(products[pd])
                            }
                           count++;
                        }
                        if(count==products.length){
                            if(cart!=undefined || cart!=null) {
                                for (var pd1 = 0; pd1 < relevantpds.length; pd1++) {
                                    for (var pd2 = 0; pd2 < cart.length; pd2++) {
                                        if (relevantpds[pd1].id == cart[pd2].id) {
                                            relevantpds[pd1].quantity=relevantpds[pd1].quantity-cart[pd2].cartQuantity;
                                        }
                                    }
                                }
                            }
                            deferred.resolve(relevantpds);
                        }
                        
                    }
                }, function(err) {
                    console.log(err);
                    deferred.reject(err);
                });
                return deferred.promise;
            },

           addItemToCart:function (product) {
               var cart=[];
               var isAlreadyAdded=false;
               product.quantity--;
               $rootScope.cartCount++;
               product.cartQuantity++;
               cart=JSON.parse(localStorage.getItem('products'));
               if(cart!=undefined || cart!=null){
                   for(var pd=0;pd<cart.length;pd++){
                       if(product.id==cart[pd].id){
                           cart[pd].cartQuantity++;
                           isAlreadyAdded=true;
                           break;
                       }
                   }
                   if(isAlreadyAdded==false){
                       cart.push(product);
                   }

                   localStorage.setItem('products',JSON.stringify(cart));
               }
               else{
                   cart=[];
                   cart.push(product);
                   localStorage.setItem('products',JSON.stringify(cart));
               }
            },

            getItemsFromCart:function () {
                var deferred = $q.defer();
                var cart=[];
                cart=JSON.parse(localStorage.getItem('products'));
                deferred.resolve(cart);
                return deferred.promise;
            },

            getTotalAmount:function () {
                var deferred = $q.defer();
                var cart=[];
                var subTotalAmount=0;
                cart=JSON.parse(localStorage.getItem('products'));
                for(var pd=0;pd<cart.length;pd++){
                    subTotalAmount+=Number(cart[pd].price*cart[pd].cartQuantity);
                }
                deferred.resolve(subTotalAmount);
                return deferred.promise;
            },

            removeItemFromCart:function (product) {
                var cart=[];
                var remainingProducts=[];
                var productId=product.id;
                if($rootScope.cartCount>0)
                {
                    for(var pd=0;pd<product.cartQuantity;pd++){
                        $rootScope.cartCount--;
                    }
                }
                cart=JSON.parse(localStorage.getItem('products'));
                for(var pd=0;pd<cart.length;pd++){
                    if(cart[pd].id!=productId){
                        remainingProducts.push(cart[pd])
                    }
                }
                localStorage.setItem('products',JSON.stringify(remainingProducts));
            },

            removeAllItemsFromCart:function () {
                localStorage.setItem('products',JSON.stringify([]));
                $rootScope.cartCount=0;
            },
        }

    });