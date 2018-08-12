angular
        .module('app.tags')
        .controller('TagController',
                function (Tag, $state, $scope)
                {
                    var vm = this;
                    // Data
                    console.log("Tag ", Tag.data);
                    vm.item = Tag.data;
                    $scope.translate = 'TAGS.';                                       
                });



