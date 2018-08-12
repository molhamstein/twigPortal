var delivery = angular.module("app.delivery");
(function (app) {
    app.controller('EditDeliveryController',
            function ($state, $scope, msApi, Delivery, $http, $q, $rootScope)
            {
                var vm = this;
                $scope.translate = 'DELIVERY.';
                vm.item = Delivery.data;
                console.log("vm.item ", vm.item);


                $scope.dTimes = [
                    {
                        name: "Minutes",
                        min: 5,
                        max: 60
                    },
                    {
                        name: "Hours",
                        min: 1,
                        max: 24
                    },
                    {
                        name: "Days",
                        min: 1,
                        max: 30
                    }

                ];
                $scope.dTimeSeconds = 0;
                //$scope.dTimeObj = $scope.dTimes[0];
                $scope.onChangeDTime = function (reset) {
                    $scope.timeChanged = true;
                    switch ($scope.dTimeObj.name) {
                        case "Days":
                        {
                            $scope.dTimeSeconds = $scope.dTime * 24 * 60 * 60 * 1000;
                            if (reset)
                                $scope.dTime = 1;
                            break;
                        }
                        case "Hours":
                        {
                            $scope.dTimeSeconds = $scope.dTime * 60 * 60 * 1000;
                            if (reset)
                                $scope.dTime = 1;
                            break;
                        }
                        case "Minutes":
                        {
                            $scope.dTimeSeconds = $scope.dTime * 60 * 1000;
                            if (reset)
                                $scope.dTime = 5;
                            break;
                        }
                    }
                    vm.item.delivery_time = $scope.dTimeSeconds;
                    console.log(" $scope.dTimeSeconds", $scope.dTimeSeconds);
                };

                function msToHMS(millisec) {
                    // var seconds = parseInt(millisec / 1000);

                    var minutes = parseInt(millisec / (1000 * 60));

                    var hours = parseInt(millisec / (1000 * 60 * 60));

                    var days = parseInt(millisec / (1000 * 60 * 60 * 24));

                    console.log(days + " days " + hours + " hours and " + minutes + " minutes and " );
//                    if (seconds < 60) {
//                        return seconds + " Sec";
//                    } else
                    if (minutes < 60) {
                        //return minutes + " Min";
                         $scope.dTimeObj = $scope.dTimes[0];
                            $scope.dTime = minutes;
                            console.log("$scope.dTime", $scope.dTime);
                    } else if (hours < 24) {
                         $scope.dTimeObj = $scope.dTimes[1];
                            $scope.dTime = hours;
                            console.log("$scope.dTime", $scope.dTime);
                        //return hours + " Hrs";
                    } else {
                        $scope.dTimeObj = $scope.dTimes[2];
                        $scope.dTime = Math.round(hours / 24);
                        console.log("$scope.dTime", $scope.dTime);
                        //return days + " Days"
                    }

//                    if (hours > 24) {
//                        $scope.dTimeObj = $scope.dTimes[2];
//                        $scope.dTime = Math.round(hours / 24);
//                        console.log("$scope.dTime", $scope.dTime);
//                    } else {
//                        if (hours <= 24 && hours > 0) {
//                            $scope.dTimeObj = $scope.dTimes[1];
//                            $scope.dTime = hours;
//                            console.log("$scope.dTime", $scope.dTime);
//                        } else {
//                            $scope.dTimeObj = $scope.dTimes[0];
//                            $scope.dTime = minutes;
//                            console.log("$scope.dTime", $scope.dTime);
//                        }
//                    }

                }
                msToHMS(vm.item.delivery_time);

                vm.submit = submit;
                if (vm.item.location ) {
                    $scope.locationBusiness = 'location';
                    $scope.selectedLocation = vm.item.location;
                    $scope.searchText3 = vm.item.location.name;
                } else if (vm.item.business) {
                    $scope.locationBusiness = 'business';
                    $scope.searchBusiness = vm.item.business.name;
                    $scope.selectedBusiness = vm.item.business;
                }

                $scope.onChangeBusiness = function (keyword) {
                    if (keyword && keyword !== null && keyword !== '') {
                        var deferred = $q.defer();
                        msApi.request('businesses.businesses@get', {
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

                $scope.selectedBusinessChange = function (item) {
                    console.log("item", item);
                    // if (item) {
                    //     vm.item.business_id = item.id;
                    //     vm.item.location_id= "";
                    // }
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
                    ;
                };

                $scope.selectedLocationChange = function (item) {
                    console.log("item", item);
                    // if (item) {
                    //     vm.item.location_id = item.id;
                    //     vm.item.business_id= "";
                    // }
                };
                $scope.locationBusinessChange = function () {
                    $scope.searchBusiness = null;
                    $scope.searchText3 = null;

                    $scope.selectedLocation= null;
                    $scope.selectedBusiness= null;
                };

                function submit() {
                  var obj= {
                    name: vm.item.name,
                    cost: vm.item.cost,
                    currency_id: vm.item.currency.id,
                    location_id: null,
                    business_id: null,
                    _method: "PUT"
                  };
                    if ($scope.timeChanged)
                        obj.delivery_time = $scope.dTimeSeconds;
                    else
                      obj.delivery_time = vm.item.delivery_time;

                        if ($scope.locationBusiness === 'location' && $scope.selectedLocation) {
                            obj.location_id = $scope.selectedLocation.id;
                        } else if ($scope.locationBusiness === 'business' && $scope.selectedBusiness) {
                            obj.business_id = $scope.selectedBusiness.id;
                        }


                    console.log("obj ", obj);
                    $http.post($rootScope.twigBigRoot + "delivery_zones/" + vm.item.id, obj)
                            .success(function (response) {
                                console.log(response);
                                $scope.errorMessageToast(response.message);
                                $state.go("app.delivery");
                            })
                            .error(function (response) {
                                console.error(response);
                                $scope.errorMessageToast(response.error.message);

                            });
                }

            });
})(delivery);
