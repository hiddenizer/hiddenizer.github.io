var rhasesQuestionsApp = angular.module('shadonizeApp', []);

rhasesQuestionsApp.controller('ShadonizeController', ['$scope', '$http', '$location', function($scope, $http, $location) {

    $scope.database = [];
    $scope.register = {};
    $scope.show_password_panel = true;
    $scope.new_register_panel = false;
    $scope.list_panel = false;

    $scope.password = '';
    $scope.confirmation = '';

    $scope.savePassword = function() {
        password = $scope.password;
        confirmation = $scope.confirmation;
        if (password === '') {
            alert('Senha não pode ser em branco.');
            throw 'PasswordError';
        }
        if (password !== confirmation) {
            alert('Senha e confimação devem ser iguais.');
            throw 'PasswordError';
        }

        $scope.show_password_panel = false;
        $scope.list_panel = true;

        $scope.loadDatabase();
    }

    $scope.saveDatabase = function() {
        encrypted = encrypt(JSON.stringify($scope.database), $scope.password);
        uploadFile(encrypted);
    }

    $scope.loadDatabase = function() {
        //data = getFile();
        if (!data) {
            $scope.database = [];
            return;
        }
        $scope.database = decrypt(data, $scope.password);
    }

    $scope.addRegister = function() {
        $scope.database.push($scope.register);
        $scope.register = {};
        $scope.new_register_panel = false;
        console.log("Registro salvo com sucesso.");
    }

}]);
