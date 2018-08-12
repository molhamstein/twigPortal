angular.module('app.locations')
        .controller('ViewLocationController',
                function(Location, $state, $scope, $rootScope, uiGmapGoogleMapApi, msApi, $mdDialog) {
                    var vm = this;
                    //console.log("feeling ", Location.data);
                    $scope.translate = 'LOCATIONS.';
                    vm.item = Location.data;
                    $scope.item = vm.item;
                    vm.editItem = editItem;
                    vm.deleteItemConfirm = deleteItemConfirm;
                    msApi.register('business.view', ['businesses/' + vm.item.business_id, {}, 'get']);
                    msApi.request('business.view@get', {}, function(response)
                                        {                                          
                                            console.log(response);
                                             vm.item.business = response.data.name;
                                        },
                                        function(response)
                                        {
                                            console.log(response);
                                        });
                           
                    if (vm.item.photo === "")
                        vm.item.photo = $rootScope.defaultBackground;
                    $scope.latitude = parseFloat($scope.item.latitude);
                    $scope.longitude = parseFloat($scope.item.longitude);
                    $scope.google_place_id = $scope.item.google_place_id;
                    console.log("vm.item ", $scope.item);

                    uiGmapGoogleMapApi.then(function(maps)
                    {
                        $scope.map = {center: {latitude: $scope.latitude, longitude: $scope.longitude}, zoom: 15};
                        $scope.options = {};
                        $scope.marker = {
                            id: 2,
                            options: {draggable: true},
                            coords: {latitude: $scope.latitude, longitude: $scope.longitude},
                            markerClick: function() {
                              //  console.log("markerClick");
                            },
                            events: {
                                dragend: function(marker, eventName, args) {
                                   // console.log('marker dragend', marker);
                                    $scope.selectedItem = null;
                                    var lat = marker.getPosition().lat();
                                    var lon = marker.getPosition().lng();
                                  //  console.log(lat);
                                  //  console.log(lon);
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
                    function deleteItemConfirm(item, ev)
                    {
                        var confirm = $mdDialog.confirm()
                                .title('Are you sure want to delete the Location?')
                                .htmlContent('Location <b>' + item.name + '</b>' + ' will be deleted.')
                                .ariaLabel('delete location')
                                .targetEvent(ev)
                                .ok('OK')
                                .cancel('CANCEL');

                        $mdDialog.show(confirm).then(function()
                        {
                            deleteItem(item);
                            vm.selectedItems = [];

                        }, function()
                        {

                        });
                    }
                    function deleteItem(item)
                    {
                       // console.log("item ", item)
                        msApi.register('locations.deleteLocation', ['locations/' + item.id]);
                        msApi.request('locations.deleteLocation@delete',
                                // SUCCESS
                                        function(response)
                                        {                                          
                                            console.log(response);
                                            $scope.errorMessageToast(response.message);
                                            $state.go("app.locations");
                                        },
                                        function(response)
                                        {
                                            console.error(response.data);
                                            $scope.errorMessageToast(response.data.error.code + " " + response.data.error.message);
                                        }
                                );
                            }
                    function editItem(item) {
                        $state.go('app.locations.edit-location', {id: item.id});
                    }
                });


