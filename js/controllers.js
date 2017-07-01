/**
 * Created by ali.ahmed on 6/29/2017.
 */
angular.module('shoppingApp.controllers',[])

    .controller('HomeCtrl', function($scope,ApplicationService) {
        // Landing page controller
    })

    .controller('ProductsCtrl', function($scope,ApplicationService) {

        $scope.categories=[];
        $scope.products=[];
        $scope.categoryName='';
        $scope.searchText='';
        $scope.showItem=false;

        // Initializing tree for categories view
        $scope.treeOptions = {
            nodeChildren: "children",
            dirSelectable: false,
            injectClasses: {
                ul: "a1",
                li: "a2",
                liSelected: "a7",
                iExpanded: "a3",
                iCollapsed: "a4",
                iLeaf: "a5",
                label: "a6",
                labelSelected: "a8"
            }
        };

        // Fetching categories through API
        ApplicationService.getCategories().then(function (data) {
            if(data!=null){
                $scope.categories=data;
            }  
        }, function (err) {
            console.log(err);
        });

        // Execute when any specific category is clicked
        $scope.showSelected=function(node){
            $scope.categoryName='';
            $scope.products=[];
            $scope.showItem=false;
            // Only execute when main Category have sub categories and products
            if(node.children==undefined){
                $scope.showItem=true;
                $scope.categoryName=node.name;
                //Getting relevant products of clicked category in the side menu
                ApplicationService.getRelevantProducts(node.id).then(function (data) {
                    if(data!=null){
                        $scope.products=data;
                    }
                }, function (err) {
                    console.log(err);
                });
            }

        };

        //Add item to cart
        $scope.AddProductToCart= function (item) {
            ApplicationService.addItemToCart(item);
        }

    })

    .controller('CartCtrl', function($scope,ApplicationService,$state) {

        $scope.cart=[];
        $scope.subTotal=0;
        $scope.taxAmount=0;
        $scope.total=0;

        // Fetching products for cart view that has been saved in localStorage with quantity
        $scope.getItems=function(){
            ApplicationService.getItemsFromCart().then(function (data) {
                if(data!=null){
                    $scope.cart=data;
                }
            });

            // Getting Total amount for items
            ApplicationService.getTotalAmount().then(function (data) {
                if(data!=null){
                    $scope.subTotal=data;
                    $scope.taxAmount=$scope.subTotal*15/100;
                    $scope.total=$scope.subTotal+$scope.taxAmount;
                }
            });
        };
        $scope.getItems();

        //Remove product from cart
        $scope.RemoveProductFromCart=function(item){
            ApplicationService.removeItemFromCart(item);
            $scope.getItems();
        };


        $scope.CheckOut=function(){
            ApplicationService.removeAllItemsFromCart();
            $scope.cart=[];
            $scope.subTotal=0;
            $scope.taxAmount=0;
            $scope.total=0;
            swal({
                title: "Thanks!",
                text: "Your order has been ready for dispatch from our store.",
                type: "success",
                showCancelButton: false,
                confirmButtonColor: "#5bc0de",
                confirmButtonText: "OK",
                closeOnConfirm: true,
                html: false
            }, function(){
                $state.go('home');
            });
        };

        $scope.ClearCart=function(){
            swal({
                title: "Are you sure?",
                text: "All items in cart will be removed!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false,
                html: false
            }, function(){
                ApplicationService.removeAllItemsFromCart();
                $scope.cart=[];
                $scope.subTotal=0;
                $scope.taxAmount=0;
                $scope.total=0;
                swal("Deleted!","Cart has been cleared successfully");
                $scope.$apply()
            });

        }

    });