(function restCallCScope(angular){
    'use strict';

    var app = angular.module('con-rest');

    app.controller('restCallC', function restCallC($scope, requestDAO, events){
        // Request can be passed a long or it could be empty.
        $scope.request = $scope.request || {
            _id: $scope.id || null,
            name: null,
            url: null,
            method: null,
            data: null,
            headers: null
        };

        // UI related settings.
        $scope.openMethods = false;
        $scope.availableMethods = ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS', 'PATCH'];
        $scope.openTypes = false;
        $scope.availableTypes = ['formData', 'payload'];

        // Notify the parent the registration of the call has been successful.
        $scope.emitRegistrationSuccessfull = function emitRegistrationSuccessfull(id) {
            $scope.request._id = id;
            $scope.$emit(events.REGISTRATION_SUCCESSFUL, id);
        };

        // Register a new call to be executed.
        $scope.registerCall = function registerCall() {
            requestDAO.registerCall({
                name: $scope.request.name,
                url: $scope.request.url,
                method: $scope.request.method,
                type: $scope.request.type,
                data: $scope.request.data,
                headers: $scope.request.headers
            }).then($scope.emitRegistrationSuccessfull, $scope.emitRegistrationFailed);
        };

        // Notify the parent the request couldn't be saved successfully.
        $scope.emitRegistrationFailed = function emitRegistrationFailed(response) {
            $scope.$emit(events.REGISTRATION_FAILED, response);
        };

        $scope.requestCancelEditing = function requestCancelEditing() {
            $scope.$emit(events.CANCEL_EDITING);
        };

        // Leave the logic whether the call exists or not out of the view.
        $scope.save = function save() {
            if (!$scope.request._id) {
                $scope.registerCall();
            } else {
                $scope.updateRestCall();
            }
        };

        // Select method
        $scope.selectMethod = function selectMethod(selectedMethod) {
            $scope.request.method = selectedMethod;
            $scope.openMethods = false;
        };

        // Select type
        $scope.selectType = function selectType(type) {
            $scope.request.type = type;
            $scope.openTypes = false;
        };

        // Open the dropdown for methods.
        $scope.toggleMethodsDropdown = function toggleMethodsDropdown() {
            $scope.openMethods = !$scope.openMethods;
        };

        // Open the dropdown for types.
        $scope.toggleTypesDropdown = function toggleTypesDropdown() {
            $scope.openTypes = !$scope.openTypes;
        };

        $scope.updateRestCall = function updateRestCall() {
            requestDAO.updateRestCall($scope.request)
            .then($scope.restCallUpdated);
        };

        $scope.restCallUpdated = function restCallUpdated(response) {
            $scope.$emit(events.REQUEST_UPDATED, response);
        };
    });
}(window.angular));
