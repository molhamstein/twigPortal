(function()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    
    angular
            .module('fuse', [           
                'ngFileUpload',
                'smart-table',
                'ngCsv',
                
                'uiGmapgoogle-maps',
                'mdColorPicker',
                'ngMaterial',
                
                'app.language',
                //  'textAngular',
                // 'xeditable',

                // Core
                'app.core',
                // Navigation
                'app.navigation',
                // Toolbar
                'app.toolbar',
                // Quick Panel
                //'app.quick-panel',




                //Modules
               

               
               
               
               
                // Apps
                'app.dashboards',
                // 'app.calendar',
                // 'app.e-commerce',
                // 'app.mail',
                // 'app.chat',
                // 'app.file-manager',
                // 'app.gantt-chart',
                // 'app.scrumboard',
                //'app.todo',
                // 'app.contacts',
                //'app.notes',

                // Pages
                'app.pages',
                 
                 
                'app.users',
                'app.categories',
                'app.feelings',
                'app.locations',
                'app.spotlights',
                'app.tags',
                'app.twigs',
                'app.delivery',
                'app.businesses',
                'app.orders',
                'app.logs',
                'app.clicks'
//                
                        //'app.pages.auth.login'

                        // User Interface
                        //'app.ui',

                        // Components
                        //'app.components',                    
            ]);
})();
