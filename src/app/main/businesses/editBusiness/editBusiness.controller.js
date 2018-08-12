var businessess = angular.module("app.businesses");

(function (app)
{
    'use strict';
    app.controller('EditBusinessController',
            function ($state, $scope, msApi, Products, Industries, Cities, Categories, Business, $timeout, Upload, $q, $rootScope)
            {
                var vm = this;
                $scope.translate = 'BUSINESSES.';
                console.log("Business ", Business);
                vm.item = Business.data;
                vm.originalData = angular.copy(Business.data);
                vm.item.score = parseFloat(vm.item.score);
                vm.originalLicenseImage = angular.copy(vm.item.license_image);
                vm.originalLogo = angular.copy(vm.item.logo);
                vm.submit = submit;
                vm.products = Products.data;
                vm.cities = Cities.data;
                vm.industries = Industries.data;
                vm.categories = Categories.data;
                vm.selectedProducts = vm.item.products;
                vm.selectedCategories = vm.item.categories;
                vm.querySearch = querySearch;
                vm.transformChip = transformChip;
                $scope.searchUser = vm.item.user.name;
                $scope.selectedUser = vm.item.user;
                $scope.onChangeUser = function (keyword) {
                    if (keyword && keyword !== null && keyword !== '') {
                        var deferred = $q.defer();
                        msApi.request('users.users@get', {
                            keyword: keyword
                        },
                        function (response) {
                            console.log("response", response);
                            deferred.resolve(response.data);
                        }, function (response) {
                            return [];
                        });
                        return deferred.promise;
                    }
                };

                $scope.selectedUserChange = function (item) {
                    console.log("item", item);
                    if (item) {
                        vm.item.user_id = item.id;
                        $scope.selectedUser = item;
                    }
                };

                $scope.onChangeAddress = function (keyword) {
                    if (keyword && keyword !== null && keyword !== '') {
                        var deferred = $q.defer();
                        msApi.request('locations.locations@get', {
                            keyword: keyword
                        },
                        function (response) {
                            console.log("response", response);
                            deferred.resolve(response.data);
                        }, function (response) {
                            deferred.reject();
                            return [];
                        });
                        return deferred.promise;
                    }
                };
                $scope.selectedCountryChange = function (country) {
                    if (country)
                        vm.item.country_id = country.id;
                };
                if(vm.item.country_obj){
                $scope.searchCountry = vm.item.country_obj.short_name;
                $scope.selectedCountry = vm.item.country_obj;
            }
                $scope.onChangeCountry = function (keyword) {
                    if (keyword && keyword !== null && keyword !== '') {
                        var deferred = $q.defer();
                        msApi.request('countries.countries@get', {
                            keyword: keyword
                        }, function (response) {
                            console.log(response);
                            deferred.resolve(response.data);
                        }, function (response) {
                            console.log(response);
                            deferred.reject(response);
                            return [];
                        });
                        return deferred.promise;
                    }
                };

//                $scope.onChangeAddress = function (keyword) {
//                    if (keyword && keyword !== null && keyword !== '') {
//                        var deferred = $q.defer();
//                        $timeout(function () {
//                            var results = getAddresses(keyword);
//                            console.log("results ", results);
//                            deferred.resolve(results);
//
//                        }, 10000);
//                        //console.log("deferred.promise  ", deferred.promise);
//                        return deferred.promise;
//                    } else {
//                        // console.log("results not found");
//                        return [];
//                    }
//                };
//                function getAddresses(keyword) {
//                    $scope.addresses = [];
//                    msApi.request('locations.locations@get', {
//                        keyword: keyword
//                    },
//                    function (response) {
//                        console.log("response", response);
//                        //$scope.addresses = [];
//                        //console.log("befor pushed", $scope.addresses);
//                        if (response.data.length !== 0) {
//                            for (var i = 0; i < response.data.length; i++)
//                                $scope.addresses.push(response.data[i]);
//                        }
//                        console.log("$scope.addresses ", $scope.addresses);
//                        return $scope.addresses;
//                    }, function (response) {
//                        //  console.error("response", response);
//                        //return [];
//                    }
//                    );
//                    return $scope.addresses;
//                }
                $scope.selectedLocationChange = function (item) {
                    console.log("item", item);
                    if (item) {
                        vm.item.location_id = item.id;
                        $scope.locationsChanged = true;
                    }
                };
                if (vm.item.industry) {
                    $scope.searchIndustry = vm.item.industry.name;
                    $scope.selectedIndustry = vm.item.industry;
                }
                $scope.onChangeIndustry = function (keyword) {
                    if (keyword && keyword !== null && keyword !== '') {
                        var deferred = $q.defer();
                        msApi.request('industries.industries@get', {
                            keyword: keyword
                        },
                        function (response) {
                            console.log("response", response);
                            deferred.resolve(response.data);
                        }, function (response) {
                            return [];
                        });
                        return deferred.promise;
                    }
                };

                $scope.selectedIndustryChange = function (item) {
                    console.log("item", item);
                    if (item) {
                        vm.item.industry_id = item.id;
                    }
                };
                function submit() {
                    if (vm.item.is_licensed === 'no')
                        delete vm.item.license_image;
                   // if ($scope.locationsChanged === true) {
                        var locations = vm.item.locations.map(function (l) {
                            console.log("locations ", l);
                            return l.id;
                        });
                        console.log("locations ", locations);
                        vm.item.locations = locations;
                    //}
                    if (vm.originalLicenseImage === vm.item.license_image || vm.item.license_image === null)
                        delete vm.item.license_image;
                    console.log("vm.item.logo ", vm.item.logo);
                    if (vm.originalLogo === vm.item.logo || vm.item.logo === null){
                        console.log("delete logo ",vm.originalLogo)
                        delete vm.item.logo;
                    }
                    if (vm.selectedProducts.length !== 0)
                        for (var i = 0; i < vm.selectedProducts.length; i++) {
                            vm.item.products[i] = vm.selectedProducts[i].id;
                        }
                    if (vm.selectedCategories.length !== 0)
                        for (var i = 0; i < vm.selectedCategories.length; i++) {
                            vm.item.categories[i] = vm.selectedCategories[i].id;
                        }
                    vm.item._method = "PUT";
                    vm.item.user_id = $scope.selectedUser.id;
                    vm.item.industry_id = vm.item.industry.id;
                    if(vm.item.city){
                      vm.item.city_id = vm.item.city.id;
                      delete vm.item.city
                    }
                    delete vm.item.country_obj;
                    delete vm.item.cover;
                    delete vm.item.industry
                    delete vm.item.is_followed
                    delete vm.item.user;
                    delete vm.item.username;
                    //delete vm.item.logo;
                    console.log("item ", vm.item);
                    Upload.upload({
                        url: $rootScope.twigBigRoot + "businesses/" + vm.item.id,
                        method: 'POST',
                        data: vm.item
                    }).then(function (resp) {
                        console.log(resp);
                        // $scope.errorMessageToast(resp.data.message);
                        $state.go('app.businesses');
                    }, function (resp) {
                        // $scope.errorMessageToast(resp.error.code + " " + resp.error.message);
                        console.log(resp);
                    }, function (evt) {

                    });
                }



                function querySearch(query, group) {
                    var results = query ? group.filter(createFilterFor(query)) : [];
                    return results;
                }

                function createFilterFor(query) {
                    var lowercaseQuery = angular.lowercase(query);
                    return function filterFn(g) {
                        return (g.name.toLowerCase().indexOf(lowercaseQuery) === 0);
                    };
                }
                function transformChip(chip) {
                    if (angular.isObject(chip)) {
                        return chip;
                    }
                    return {name: chip, type: 'new'};
                }
            });
})(businessess);
