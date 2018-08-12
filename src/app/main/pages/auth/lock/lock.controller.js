(function ()
{
    'use strict';

    angular
        .module('app.lock')
        .controller('LockController', LockController);

    /** @ngInject */
    function LockController()
    {
        var vm = this;

        // Data
        vm.form = {
            username: 'Jane Doe'
        };

        // Methods

        //////////
    }
})();