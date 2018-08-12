var delivery = angular.module("app.delivery");
(function (app) {
    app.controller('AddDeliveryController',
            function ($state, $scope, msApi, $timeout, Upload, $q, $rootScope)
            {
                var vm = this;
                $scope.translate = 'DELIVERY.';
                vm.item = {
                    name: "",
                    cost: "",
                    // location_id: "",
                    // business_id: "",
                    currency_id: 1,
//                    delivery_time: 5
                };
                $scope.dTime = 5;
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
                $scope.dTimeObj = $scope.dTimes[0];
                $scope.onChangeDTime = function (reset) {

                    switch ($scope.dTimeObj.name) {
                        case "Days":
                        {
                            $scope.dTimeSeconds = $scope.dTime * 24 * 60 * 60 * 1000;
                            if(reset) $scope.dTime = 1;
                            break;
                        }
                        case "Hours":
                        {
                            $scope.dTimeSeconds = $scope.dTime * 60 * 60 * 1000;
                            if(reset) $scope.dTime = 1;
                            break;
                        }
                        case "Minutes":
                        {
                            $scope.dTimeSeconds = $scope.dTime * 60 * 1000;
                            if(reset) $scope.dTime = 5;
                            break;
                        }
                    }
                    vm.item.delivery_time = $scope.dTimeSeconds;
                    //console.log(" $scope.dTimeSeconds",  $scope.dTimeSeconds);
                };


                $scope.time = {
                    'days': 0,
                    'hours': 0,
                    'minutes': 5
                };
                $scope.onChangeTime = function () {
                    if ($scope.time.days === 0 && $scope.time.hours)
                        $scope.time.minutes = 5;
                }
                vm.submit = submit;
                $scope.searchBusiness = null;
                $scope.selectedBusiness = null;
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
                    if (item) {
                        vm.item.business_id = item.id;
                        delete vm.item.location_id;
                    }
                };


                $scope.searchLocation = null;
                $scope.selectedLocation = null;

                $scope.locationBusinessChange = function () {
                    $scope.searchBusiness = null;
                    $scope.searchText3 = null;

                    $scope.selectedLocation = null;
                    $scope.selectedBusiness = null;
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
                    if (item) {
                        vm.item.location_id = item.id;
                        delete vm.item.business_id;
                    }
                };

                function submit() {
                    console.log("item ", vm.item);
                    Upload.upload({
                        url: $rootScope.twigBigRoot + "delivery_zones",
                        method: 'POST',
                        data: vm.item
                    }).then(function (resp) {
                        console.log(resp);
                        $scope.errorMessageToast("Delivery zone has been added successfully");
                        $state.go('app.delivery');
                    }, function (resp) {
                        console.error(resp.data);
                        if (resp.data !== null)
                            $scope.errorMessageToast(resp.data.message);
                    }, function (evt) {

                    });

                }

            });
})(delivery);
