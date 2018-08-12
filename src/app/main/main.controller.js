(function ()
{
    'use strict';

    angular
            .module('fuse')
            .controller('MainController', MainController)
            .directive('formatPhone', formatPhone);

    function formatPhone() {
          return {
        restrict: 'A',
        require: '?ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue == undefined) return '';
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }
                return transformedInput;
            });
        }
    };
//        return {
//            require: 'ngModel',
//            restrict: 'A',
//            link: function (scope, elem, attrs, ctrl, ngModel) {
//                elem.add(phonenumber).on('keyup', function () {
//                    var origVal = elem.val().replace(/[^\w\s]/gi, '');
//                    if (origVal.length === 10) {
//                        var str = origVal.replace(/(.{3})/g, "$1-");
//                        var phone = str.slice(0, -2) + str.slice(-1);
//                        jQuery("#phonenumber").val(phone);
//                    }
//
//                });
//            }
//        };
    }

    /** @ngInject */
    function MainController($scope, $rootScope, $mdToast, msApi)
    {
        $rootScope.defaultAvatar = "../../../../../assets/images/avatars/profile.jpg";
        $rootScope.defaultBackground = "../../../../../assets/images/patterns/lightgray.jpg";
        $rootScope.twigBigRoot = "https://twigbig.com/api/public/index.php/api/v1/";
        // Data        
        // Remove the splash screen
        $scope.$on('$viewContentAnimationEnded', function (event)
        {
            if (event.targetScope.$id === $scope.$id)
            {
                $rootScope.$broadcast('msSplashScreen::remove');
            }
        });


        $scope.errorMessageToast = function (msg) {
            $mdToast.show(
                    $mdToast.simple()
                    .textContent(msg)
                    .position('bottom right')
                    .hideDelay(4000)
                    );
        }
    }
})();