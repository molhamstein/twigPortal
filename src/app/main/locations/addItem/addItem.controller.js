
angular
        .module('app.locations')
        .controller('AddLocationController',
                function($state, $scope, msApi, $element, uiGmapGoogleMapApi, $q, $timeout, Upload, $rootScope)
                {
                    var vm = this;
                    $scope.translate = 'LOCATIONS.';
                    vm.submit = submit;
                    $scope.item = {
                        name: "",
                        google_place_id: "",
                        address: "",
                        longitude: "",
                        latitude: "",
                        photo: ""
                    };
                    //console.log("$rootScope.defaultBackground ", $rootScope.defaultBackground)
                    //$scope.item.photo = $rootScope.defaultBackground;
                    $scope.latitude = 25.276987;
                    $scope.longitude = 55.296249;
                    uiGmapGoogleMapApi.then(function(maps)
                    {
                        $scope.map = {center: {latitude: $scope.latitude, longitude: $scope.longitude}, zoom: 15};
                        // console.log("$scope.map ", $scope.map);
                        $scope.options = {};
                        $scope.marker = {
                            id: 0,
                            options: {draggable: true},
                            coords: {latitude: $scope.latitude, longitude: $scope.longitude},
                            markerClick: function() {
                                // console.log("markerClick");
                            },
                            events: {
                                dragend: function(marker, eventName, args) {
                                    // console.log('marker dragend', marker);
                                    $scope.selectedItem = null;
                                    var lat = marker.getPosition().lat();
                                    var lon = marker.getPosition().lng();
                                    // console.log(lat);
                                    // console.log(lon);
                                    $scope.latitude = lat;
                                    $scope.longitude = lon;

                                    $scope.marker.options = {
                                        draggable: true,
                                        labelContent: "lon: " + $scope.marker.coords.longitude + ' ' + 'lat: ' + $scope.marker.coords.latitude,
                                        labelAnchor: "100 0",
                                        labelClass: "marker-labels"
                                    };
                                }
                            }
                        };
                        // console.log("$scopemarkmap ", $scope.marker)
                    });
                    // $scope.selectedItem = $scope.item.name;
                    $scope.searchItem = null;
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
//                    function getAddresses(keyword) {
//                        $scope.addresses = [];
//                        msApi.request('locations.locations@get', {
//                            keyword: keyword
//                        },
//                        function(response) {
//                            console.log("response", response);
//                            //$scope.addresses = [];
//                            //console.log("befor pushed", $scope.addresses);
//                            if (response.data.length !== 0) {
//                                for (var i = 0; i < response.data.length; i++)
//                                    $scope.addresses.push(response.data[i]);
//
//                            }
//                            console.log("$scope.addresses ", $scope.addresses);
//                            return $scope.addresses;
//                        }, function(response) {
//                            //  console.error("response", response);
//                            //return [];
//                        }
//                        );
//                        return $scope.addresses;
//                    }
//                    function searchTextChange(text) {
//                        // $log.info('Text changed to ' + text);
//                    }
                    $scope.selectedItemChanged = false;
                    $scope.selectedItemChange = function(item) {
                        console.log("item", item);
                        if (item) {
                            item.longitude = parseFloat(item.longitude);
                            item.latitude = parseFloat(item.latitude);

                            // console.log("selectedItem", $scope.selectedItem);
                            $scope.item = item;
                            if ($scope.selectedItem.photo === "")
                                $scope.item.photo = $rootScope.defaultBackground;
                            $scope.selectedItemChanged = true;
                            $scope.marker.coords.longitude = item.longitude;
                            $scope.marker.coords.latitude = item.latitude;
                            $scope.updateMarkerPos();
                        } else {
                            $scope.item.name = $scope.searchText;
                        }
                    };

                    $scope.updateMarkerPos = function() {
                        //  console.log("$scope.marker.coords ", $scope.marker.coords);
                        $scope.map.center.longitude = $scope.marker.coords.longitude;
                        $scope.map.center.latitude = $scope.marker.coords.latitude;
                        // console.log("$scope.map.center ", $scope.map.center);
                    };
                    function submit() {
                        // console.log("save", $scope.item);
//                        if ($scope.file1 === $rootScope.defaultBackground)
//                            $scope.file1 = "";
//                        if ($scope.file1)
//                            $scope.item.photo = $scope.file1;
//                        else
//                            $scope.item.photo = "";


                        // console.log("$scope.selectedItem ", $scope.selectedItem);
                        if ($scope.selectedItem === null || $scope.selectedItem === '' || $scope.selectedItemChanged === false) {
                            $scope.item.name = $scope.searchText;
                            //uiGmapGoogleMapApi.then(function(maps) {
                            $scope.item.latitude = $scope.latitude;
                            $scope.item.longitude = $scope.longitude;
                            var geocoder = new google.maps.Geocoder;
                            var latlng = {lat: parseFloat($scope.latitude), lng: parseFloat($scope.longitude)};
                            geocoder.geocode({'location': latlng}, function(results, status) {
                                // console.log("status ", status, "results ", results);
                                if (status === google.maps.GeocoderStatus.OK) {
                                    if (results[1]) {
                                        $scope.item.google_place_id = results[1].place_id;
                                        // console.log(results[1].place_id);
                                    } else {
                                        $scope.item.google_place_id = "";
                                    }
                                } else {
                                    $scope.item.google_place_id = "";
                                }
                                // console.log("$scope.item ", $scope.item);
                                vm.upload($scope.file1);
                            });

                            //});
                        } else {
                            $scope.item = $scope.selectedItem;
                            //  console.log("$scope.item ", $scope.item);
                            vm.upload($scope.file1);
//                            $scope.item.latitude = $scope.selectedItem.latitude;
//                            $scope.item.longitude = $scope.selectedItem.longitude;
//                            $scope.item.name = $scope.selectedItem.name;                           
                        }


                    }
                    ;
                    vm.upload = function(file) {
                        // console.log("$scope.item ", $scope.item);
                        if (!file)
                            file = "";
                        //$scope.marker.coords.longitude = "'" + $scope.marker.coords.longitude + "'";
                        //$scope.marker.coords.latitude = "'" + $scope.marker.coords.latitude + "'";
                        //  console.log("upload ", file);
                        Upload.upload({
                            url: $rootScope.twigBigRoot + "locations",
                            method: 'POST',
                            data: {
                                name: $scope.item.name,
                                google_place_id: $scope.item.google_place_id,
                                address: $scope.item.address,
                                longitude: $scope.marker.coords.longitude,
                                latitude: $scope.marker.coords.latitude,
                                photo: file
                            }
                        }).then(function(resp) {
                            console.log(resp);

                            $scope.errorMessageToast(resp.data.message);
                            $state.go('app.locations');
                        }, function(resp) {
                            console.log(resp);

                            $scope.errorMessageToast(resp.data.error.message);
                        }, function(evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.photo.name);
                            // $scope.errorMessageToast('progress: ' + progressPercentage + '% ' + evt.config.data.icon.name);
                        });
                    };

                });
