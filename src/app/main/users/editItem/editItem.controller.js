
angular
        .module('app.users')
        .controller('EditUserController',
                function($scope, $state, User, msApi, $http, Upload, $rootScope)
                {
                    var vm = this;
                    console.log('User', User);
                    vm.item = User.data;                     
                    $scope.file2 = vm.item.cover;
                    $scope.file1 = vm.item.photo;
                    $scope.translate = 'USERS.';
//                    vm.currencies = [
//                        "Dollar",
//                        "Euro"
//                    ];
                    vm.countries = [
                        "Syria",
                        "UAE"
                    ];
                    vm.languages = [
                        "English",
                        "Arabic"
                    ];
                    vm.item.password = "";
                    vm.submit = submit;
                    function submit() {
                      var obj = {
                                name: vm.item.name,
                                email: vm.item.email,
                                password: vm.item.password,                                
                                status: vm.item.status,
                                type: vm.item.type,
                                photo: $scope.file1,
                                cover: $scope.file2,
                                score: vm.item.score,
                                _method: 'PUT'};
                      
                        if ($scope.file2 === vm.item.cover || $scope.file2 === null) {
                            delete obj.cover;
                        }                      
                        if ($scope.file1 === vm.item.photo || $scope.file1 === null)
                            delete obj.photo;
                        console.log("obj ", obj);
                        $scope.upload(obj);
                    }
                    $scope.upload = function(obj) {
                        // $scope.errorMessageToast("Sorry .. this process hasn't complete yet");
                        Upload.upload({
                            url: $rootScope.twigBigRoot + 'users/' + vm.item.id,
                            method: 'POST',
                            data: obj
                        }).then(function(resp) {
                            console.log(resp);
                            $scope.errorMessageToast("User has been updated succesfully");
                            $state.go('app.users');
                            //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                        }, function(response) {
                            console.log(response);
                            // $scope.errorMessageToast(msg);
                            // console.error(response.data);
                        }, function(evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.photo.name);
                        });
                    };



                });
