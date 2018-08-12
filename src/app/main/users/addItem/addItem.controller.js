
angular
        .module('app.users')
        .controller('AddUserController', function($scope, $rootScope, $state, msApi, Upload, $http)
        {
            var vm = this;
            vm.item = {};
            $scope.translate = 'USERS.';
            vm.submit = submit;
            function submit() {
                if ($scope.file1 === $rootScope.defaultAvatar) {
                    $scope.file1 = "";
                }
                 if ($scope.file2 === $rootScope.defaultBackground) {
                    $scope.file2 = "";
                }
                console.log("file1", $scope.file1);
                $scope.upload();
//                msApi.request('register@save', {
//                    name: vm.item.name,
//                    email: vm.item.email,
//                    password: vm.item.password,
//                    mobile_number: "",
//                    photo: $scope.pho,
//                    cover: ""},
//                // SUCCESS
//                function(response)
//                {
//                    console.log(response.data);
//                    $scope.errorMessageToast("User has been added succesfully");
//                    $state.go('app.users');
//                },
//                        // ERROR
//                                function(response)
//                                {
//                                    var msg = "";
//                                    if (response.data.error.details.email)
//                                        msg += response.data.error.details.email[0] + " ";
//                                    if (response.data.error.details.name)
//                                        msg += response.data.error.details.name[0] + " ";
//                                    if (response.data.error.details.password)
//                                        msg += response.data.error.details.password[0] + " ";
//                                    $scope.errorMessageToast(msg);
//                                    console.error(response.data);
//
//                                }
//                        );
            }            
            $scope.upload = function() {
                Upload.upload({
                    url: $rootScope.twigBigRoot+"users",
                    method: 'POST',
                    data: {
                        name: vm.item.name,
                        email: vm.item.email,
                        password: vm.item.password,
                        mobile_number: "",
                        photo: $scope.file1,
                        cover: $scope.file2}
                }).then(function(resp) {
                    console.log(resp);
                    $scope.errorMessageToast("User has been added succesfully");
                    
                    $state.go('app.users');                  
                }, function(response) {
                    console.log(response);
                    //console.log('Error status: ' + response);
                    var msg = "";
                    
                    $scope.errorMessageToast(msg);
                    console.error(response.data);
                }, function(evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.photo.name);
                });
            };           
        });
