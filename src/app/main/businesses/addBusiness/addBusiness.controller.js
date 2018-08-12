var businessess = angular.module("app.businesses");

(function (app) {

    app.controller('AddBusinessController',
            function ($state, $scope, msApi, Products, Industries, Cities, Categories, $timeout, Upload, $q, $rootScope)
            {
                var vm = this;
                $scope.translate = 'BUSINESSES.';
                //console.log("$rootScope.globals ", $rootScope.globals);
                if ($rootScope.globals.currentUser)
                    $scope.loggedUser = $rootScope.globals.currentUser.loggedUser;
                vm.item = {
                    user_id: $scope.loggedUser.id,
                    name: null,
                    type: null,
                    status: "Pending",
                    locations: [],
                    industry_id: null,
                    //city_id: null,
                    // country_id: "",
                    categories: [],
                    //score: "",
                    // description: "",
                    // type_description: "",
                    // commercial_name: "",
                    // legal_name: "",
                    is_licensed: 'no',
                    license_image: null
                            //  address: "",
                            //  phone: "",
                            //  manager_name: "",
                            //  manager_phone: "",
                            //  website: ""
                };
                vm.submit = submit;
                vm.products = Products.data;
                vm.cities = Cities.data;
                vm.industries = Industries.data;
                vm.categories = Categories.data;
                vm.selectedProducts = [];
                vm.selectedCategories = [];
                vm.querySearch = querySearch;
                vm.transformChip = transformChip;
                $scope.searchUser = null;
                $scope.selectedUser = $scope.loggedUser;
                $scope.onChangeUser = function (keyword) {
                    if (keyword && keyword !== null && keyword !== '') {
                        var deferred = $q.defer();
                        $timeout(function () {
                            var results = getUsers(keyword);
                            console.log("results ", results);
                            deferred.resolve(results);

                        }, 10000);
                        return deferred.promise;
                    } else {
                        return [];
                    }
                };
                function getUsers(keyword) {
                    $scope.users = [];
                    msApi.request('users.users@get', {
                        keyword: keyword
                    },
                    function (response) {
                        console.log("response", response);
                        if (response.data.length !== 0) {
                            for (var i = 0; i < response.data.length; i++)
                                $scope.users.push(response.data[i]);

                        }
                        console.log("$scope.users ", $scope.users);
                        return $scope.users;
                    }, function (response) {

                    }
                    );
                    return $scope.users;
                }
                $scope.selectedUserChange = function (item) {
                    console.log("item", item);
                    if (item) {
                        vm.item.user_id = item.id;
                    }
                };
                $scope.searchLocation = null;
                $scope.selectedLocation = null;
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
                    ;
                };
                $scope.selectedCountryChange = function (country) {
                    if (country)
                        vm.item.country_id = country.id;
                };
                $scope.searchCountry = null;
                $scope.selectedCountry = null;
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
//                $scope.selectedLocationChange = function (item) {
//                    console.log("item", item);
//                    if (item) {
//                        vm.item.locations.push(item.id);
//                    }
//                };

//                $scope.searchIndustry = null;
//                $scope.selectedIndustry = null;
//                $scope.onChangeIndustry = function (keyword) {
//                    if (keyword && keyword !== null && keyword !== '') {
//                        var deferred = $q.defer();
//                        $timeout(function () {
//                            var results = getUsers(keyword);
//                            console.log("results ", results);
//                            deferred.resolve(results);
//
//                        }, 10000);
//                        return deferred.promise;
//                    } else {
//                        return [];
//                    }
//                };
//                function getUsers(keyword) {
//                    $scope.industries = [];
//                    msApi.request('industries.industries@get', {
//                        keyword: keyword
//                    },
//                    function (response) {
//                        console.log("response", response);
//                        if (response.data.length !== 0) {
//                            for (var i = 0; i < response.data.length; i++)
//                                $scope.industries.push(response.data[i]);
//
//                        }
//                        console.log("$scope.industries ", $scope.industries);
//                        return $scope.industries;
//                    }, function (response) {
//
//                    }
//                    );
//                    return $scope.industries;
//                }
//                $scope.selectedIndustryChange = function (item) {
//                    console.log("item", item);
//                    if (item) {
//                        vm.item.industry_id = item.id;
//                    }
//                };

                function submit() {
                    if (vm.item.is_licensed === 'no')
                        delete vm.item.license_image;
                    if (vm.item.locations) {
                        var locations = vm.item.locations.map(function (l) {
                            return l.id;
                        });
                        vm.item.locations = locations;
                    }
                    if (vm.selectedProducts.length !== 0)
                        for (var i = 0; i < vm.selectedProducts.length; i++) {
                            vm.item.products[i] = vm.selectedProducts[i].id;
                        }
                    if (vm.selectedCategories.length !== 0)
                        for (var i = 0; i < vm.selectedCategories.length; i++) {
                            vm.item.categories[i] = vm.selectedCategories[i].id;
                        }
                    //console.log("vm.item.products = products; ", vm.item.products);
                    console.log("item ", vm.item);
                    Upload.upload({
                        url: $rootScope.twigBigRoot + "businesses",
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
