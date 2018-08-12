
angular
        .module('app.locations')
        .controller('EditLocationController', function ($state, $q, $timeout, $scope, msApi, uiGmapGoogleMapApi, Location, $element, Upload, $rootScope)
        {
            var vm = this;
            $scope.translate = 'LOCATIONS.';
            vm.submit = submit;
            $scope.item = Location.data;
            $scope.original_google_place_id = angular.copy($scope.item.google_place_id);
            vm.originalItem = angular.copy(Location.data);
            if ($scope.item.business_id && $scope.item.business_id !== "") {
                msApi.register('business.view', ['businesses/' + $scope.item.business_id, {}, 'get']);
                msApi.request('business.view@get', {}, function (response)
                {
                    console.log(response);
                    $scope.searchBusiness = response.data.name;
                    $scope.selectedBusiness = response.data;
                },
                        function (response)
                        {
                            console.log(response);
                            $scope.searchBusiness = null;
                            $scope.selectedBusiness = null;
                        });
            }
            console.log(" $scope.item ", $scope.item);
            $scope.file1 = $scope.item.photo;
//            if ($scope.item.photo === "")
//                $scope.item.photo = $rootScope.defaultBackground;
            $scope.latitude = parseFloat($scope.item.latitude);
            $scope.longitude = parseFloat($scope.item.longitude);
            $scope.google_place_id = $scope.item.google_place_id;
            // console.log("vm.item ", $scope.item);

            uiGmapGoogleMapApi.then(function (maps)
            {
                $scope.map = {center: {latitude: $scope.latitude, longitude: $scope.longitude}, zoom: 15};
                $scope.options = {};
                $scope.marker = {
                    id: 1,
                    options: {draggable: true},
                    coords: {latitude: $scope.latitude, longitude: $scope.longitude},
                    markerClick: function () {
                        //console.log("markerClick");
                    },
                    events: {
                        dragend: function (marker, eventName, args) {
                            //  console.log('marker dragend', marker);
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

            });
            $scope.selectedItem = $scope.item.name;
            // $scope.searchItem = null;
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

            $scope.selectedItemChanged = false;
            $scope.selectedItemChange = function (item) {
                console.log("item", item);
                if (item) {
                    item.longitude = parseFloat(item.longitude);
                    item.latitude = parseFloat(item.latitude);

                    // console.log("selectedItem", $scope.selectedItem);
                    $scope.item = item;
                    $scope.file = item.photo;
                    if ($scope.selectedItem.photo === "")
                        $scope.file = $rootScope.defaultBackground;
                    $scope.selectedItemChanged = true;
                    $scope.marker.coords.longitude = item.longitude;
                    $scope.marker.coords.latitude = item.latitude;
                    $scope.updateMarkerPos();
                } else {
                    $scope.item.name = $scope.searchText;
                }
            };
            $scope.updateMarkerPos = function () {
                // console.log("$scope.marker.coords ", $scope.marker.coords);
                $scope.map.center.longitude = $scope.marker.coords.longitude;
                $scope.map.center.latitude = $scope.marker.coords.latitude;
                //  console.log("$scope.map.center ", $scope.map.center);
            };


            $scope.selectedBusinessChange = function (item) {
                if (item)
                    $scope.item.business_id = item.id;
            };
            $scope.onChangeBusiness = function (keyword) {
                if (keyword && keyword !== null && keyword !== '') {
                    var deferred = $q.defer();
                    msApi.request('businesses.businesses@get', {
                        keyword: keyword
                    },
                    function (response) {
                        console.log("response businesses", response);
                        deferred.resolve(response.data);
                    }, function (response) {
                        deferred.reject();
                        return [];
                    });
                    return deferred.promise;
                }
            };

            function submit() {
                // console.log("save", $scope.item);
//
//                if ($scope.item.photo === $rootScope.defaultBackground)
//                    $scope.item.photo = "";
//                if ($scope.file1)
//                    $scope.item.photo = $scope.file1;


                //  console.log("$scope.selectedItem ", $scope.selectedItem);
                if ($scope.selectedItem === null || $scope.selectedItem === '' || $scope.selectedItemChanged === false) {
                    $scope.item.name = $scope.searchText;
                    // uiGmapGoogleMapApi.then(function(maps)        {
                    $scope.item.latitude = $scope.latitude;
                    $scope.item.longitude = $scope.longitude;
                    var geocoder = new google.maps.Geocoder;
                    var latlng = {lat: parseFloat($scope.latitude), lng: parseFloat($scope.longitude)};
                    geocoder.geocode({'location': latlng}, function (results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
                            if (results[1]) {
                                $scope.item.google_place_id = results[1].place_id;
                                // console.log(results[1].place_id);
                            } else {
                                $scope.item.google_place_id = "";
                            }
                        } else {

                        }
                        // console.log("$scope.item ", $scope.item);

                        var obj = {
                            name: $scope.item.name,
                            google_place_id: $scope.item.google_place_id,
                            address: $scope.item.address,
                            longitude: $scope.marker.coords.longitude,
                            latitude: $scope.marker.coords.latitude,
                            photo: $scope.file1,
                            business_id: $scope.item.business_id,
                            _method: 'PUT'
                        };

                        if ($scope.original_google_place_id === $scope.item.google_place_id)
                            delete obj.google_place_id;
                        if ($scope.file1 === $scope.item.photo || $scope.file1 === null)
                            delete obj.photo;
                        vm.upload(obj);
                    });
                    // });
                } else {
                    if ($scope.original_google_place_id === $scope.item.google_place_id)
                        delete $scope.item.google_place_id;
                    $scope.item = $scope.selectedItem;
                    $scope.item.photo = $scope.file1;
                    if ($scope.file1 === $scope.item.photo || $scope.file1 === null)
                        delete $scope.item.photo;
                    //  console.log("$scope.item ", $scope.item);
//                    var obj = {
//                            name: $scope.item.name,
//                            google_place_id: $scope.item.google_place_id,
//                            address: $scope.item.address,
//                            longitude: $scope.marker.coords.longitude,
//                            latitude: $scope.marker.coords.latitude,
//                            photo: $scope.file1,
//                            _method: 'PUT'
//                        };
//                        if ($scope.file1 === $scope.item.photo)
//                            delete obj.photo;
                    $scope.item._method = "PUT";
                    vm.upload($scope.item);
                }



                // vm.upload($scope.file);
            }
            ;
            vm.upload = function (obj) {
                console.log("item ", $scope.item);
                console.log("obj ", obj);
                //if(file === $scope.item.photo) file = "";
                // console.log("upload ", file);
                // $scope.marker.coords.longitude = "'" + $scope.marker.coords.longitude + "'";
                // $scope.marker.coords.latitude = "'" + $scope.marker.coords.latitude + "'";
                Upload.upload({
                    url: $rootScope.twigBigRoot + "locations/" + vm.originalItem.id,
                    method: 'POST',
                    data: obj
                }).then(function (resp) {
                    // console.log(resp);
                    console.log('Success ' + resp);
                    $scope.errorMessageToast(resp.data.message);
                    $state.go('app.locations');
                }, function (resp) {
                    // console.log(resp);
                    console.log('Error status: ', resp);
                    var msg = resp.data.error.message;
                    if (resp.data.error.message.details.google_place_id)
                        msg += resp.data.error.message.details.google_place_id;
                    $scope.errorMessageToast(msg);
                }, function (evt) {
                    //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.photo.name);
                    // $scope.errorMessageToast('progress: ' + progressPercentage + '% ' + evt.config.data.icon.name);
                });
            };
        });


