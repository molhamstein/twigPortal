angular.module('app.core')
        .factory('permissions', function ($rootScope, $q, $state, $timeout) {
            var userRole = "";
            return {
                setPermissions: function (roles, businesses) {
                    //console.log("setPermissions");
                    var role = "";
//                    var roles = [
//                        {
//                            "id": 1,
//                            "name": "admin",
//                            "description": "User is allowed to manage and edit other users"
//                        },
//                        {
//                            "id": 2,
//                            "name": "business",
//                            "description": "Business"
//                        },
//                        {
//                            "id": 3,
//                            "name": "user",
//                            "description": "user who can tiwg"
//                        }
                    //                   ];
                    loop1: for (var i = 0; i < roles.length; i++) {
                        if (roles[i].id === 1) {
                            //console.log("ADMIN ");
                            role = "ADMIN";
                            $rootScope.globals.currentUser.loggedUser.role = "ADMIN";
                            break;
                            loop2:  for (var j = i + 1; j < roles.length; j++) {
                                if (roles[j].id === 2) {
                                    console.log("ADMIN BUSINESS");
                                    role = "ADMIN_BUSINESS";
                                    $rootScope.globals.currentUser.loggedUser.role = "ADMIN_BUSINESS";
                                    break loop1;
                                    break loop2;
                                }
                            }
                        }
                        if (roles[j].id === 2) {
                            //console.log(" BUSINESS");
                            $rootScope.globals.currentUser.loggedUser.role = "BUSINESS";
                            role = "BUSINESS";
                        }
                        if (roles[i].id === 3) {
                            //console.log("USER");
                            role = "USER";
                            break;
                            $rootScope.globals.currentUser.loggedUser.role = "USER";
                        }
                    }

                    userRole = role;
                    //console.log("$rootScope.globals.currentUser.loggedUser.id === 92 ", $rootScope.globals.currentUser.loggedUser.id === 92);
                    if ($rootScope.globals.currentUser.loggedUser.id === 92) {
                        userRole = "BUSINESS";
                        //console.log(" BUSINESS");
                    }
                    $rootScope.userRole = userRole;

                    //userRolesList = roles;
                    $rootScope.$broadcast('permissionsChanged', userRole);

                },
                getPermissions: function (state) {
                    //console.log("getPermissions ", userRole, "state ", state, $rootScope.globals.currentUser);
                    if ($rootScope.globals.currentUser) {
                        switch (userRole) {
                            case "ADMIN":
                            {
                                return $q.when();
                                break;
                            }
                            case "ADMIN_BUSINESS":
                            {
                                return $q.when();
                                break;
                            }
                            case "BUSINESS":
                            {
                                //var states = ["TWIGS", "BUSINESSES"];
                                if (state === "TWIGS" || state === "BUSINESSES" || state === "DASHBOARDS"  
                                        || state === "LOGS" ) {
                                    //  console.log("YES")
                                    //console.log("state in states ", state in states);
                                    return $q.when();
                                }
                                //  console.log("NO")
                                $timeout(function () {
                                    // This code runs after the authentication promise has been rejected.
                                    // Go to the log-in page
                                    $state.go("app.pages_errors_error-404");
                                });
                                return $q.reject();
                                break;
                            }
                            case "USER":
                            {
                               // console.log("USER2");
                                $timeout(function () {
                                    // This code runs after the authentication promise has been rejected.
                                    // Go to the log-in page
                                    $state.go("app.pages_errors_error-404");
                                });

                                // Reject the authentication promise to prevent the state from loading
                                return $q.reject();
                                break;
                            }
                        }

                    }
                    else {
                        $timeout(function () {
                            // This code runs after the authentication promise has been rejected.
                            // Go to the log-in page
                            $state.go("app.pages_auth_login");
                        });

                        // Reject the authentication promise to prevent the state from loading
                        return $q.reject()
                    }
                    //return deferred.promise;
                },
                hasPermission: function (node) {
                    var permission = false;
                    //console.log("hasPermission ", node);
                    //console.log("hasPermission ", userRole);
                    switch (userRole) {
                        case "ADMIN":
                        {
                            permission = true;
                            break;
                        }
                        case "ADMIN_BUSINESS":
                        {
                            permission = true;
                            break;
                        }
                        case "BUSINESS":
                        {
                            // var nodes = ["app.twigs", "app.businesses"];
                            if (node === "app.twigs" || node === "app.businesses" || node === "app.dashboards"
                                    || node === "app.logs" )
                                permission = true;
                            break;
                        }
                        case "USER":
                        {
                            //console.log("USER2");
                            break;
                        }
                    }
                    if (permission)
                        return true;
                }
//                hasPermission: function (name, value) {
//                    name = name.trim();
//                    var permission = false;
//                    console.log("permission ", name, value);
//                    userRolesList.roles.forEach(function (role) {
//                        if (role.id === 1) {
//                            permission = true;
//                        }
//                        if (role.id === 3) {
//                            permission = false;
//                        }
//                        if (role.id === 2) { // BUSINESS
//                            userRolesList.businesses.forEach(function (business) {
//                                if (business.id === value) {
//                                    console.log("return true ");
//                                    permission = true;
//                                }
//                            });
//                        }
//                    });
//                    if (permission)
//                        return true;
//                }
            };
        })
        .directive('hasPermission', function (permissions) {
            return {
                link: function (scope, element, attrs) {
                    //console.log("element ", element, "scope ", scope);
                    //console.log("attrs.hasPermission ", scope.vm.node.state);


                    function toggleVisibilityBasedOnPermission() {
                        var hasPermission = permissions.hasPermission(scope.vm.node.state);
                        //console.log("hasPermission ", hasPermission);
                        if (hasPermission) {
                            element[0].style.display = 'block';
                        }
                        else {
                            element[0].style.display = 'none';
                        }
                    }

                    toggleVisibilityBasedOnPermission();
                   
                    scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
                }
            };
        });
//        .directive('hasPermission', function (permissions) {
//            return {
//                link: function (scope, element, attrs) {
//                    if (!_.isString(attrs.hasPermission)) {
//                        throw 'hasPermission name must be a string';
//                    }
//                    var name = attrs.hasPermission.trim();
//                    var value = scope.$eval(attrs.hasPermissionValue);
//                    console.log("name ", name, "value ", value);
//                    var notPermissionFlag = name[0] === '!';
//                    if (notPermissionFlag) {
//                        name = name.slice(1).trim();
//                    }
//
//                    function toggleVisibilityBasedOnPermission() {
//                        var hasPermission = permissions.hasPermission(name, value);
//                        console.log("hasPermission ", hasPermission);
//                        if (hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag) {
//                            element[0].style.display = 'block';
//                        }
//                        else {
//                            element[0].style.display = 'none';
//                        }
//                    }
//
//                    toggleVisibilityBasedOnPermission();
//                    scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
//                }
//            };
//        });