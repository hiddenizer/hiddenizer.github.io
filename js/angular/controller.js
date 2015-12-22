angular
.module('shadownizerApp', ['xeditable', 'ui.bootstrap'])
.controller('shadownizer', ['$scope', 'gdrive', 'scrypto', '$uibModal', function($scope, gdrive, scrypto, $uibModal) {
    /*$scope.records = [
        {name: 'Facebook', user: 'talesap@gmail.com', pass: 'test'},
        {name: 'Google', user: 'talesap@gmail.com', pass: 'test'}
    ];*/

    $scope.records = [];
    $scope.alerts = [];

    $uibModal.open({
        templateUrl: 'passwordModal.html',
        controller: 'passwordModal'
    }).result
    .then(function(password) {
        $scope.password = password
        return gdrive.load();
    })
    .then(function(cipheredText) {
        if (!cipheredText || cipheredText.length == 0)
            return;

        try {
            console.log(scrypto.decrypt(cipheredText, $scope.password));
        } catch (e) {
            $scope.alerts.push({type: 'danger', msg: 'Password is wrong!'});
        }
    });

    $scope.newAttibute = function(record) {
        record[''] = '';
    }

    $scope.newSite = function() {
        $scope.records.push({
            name: ''
        });
    }

    $scope.cleanKey = function() {
        console.log($scope.records);
        console.log($scope.key);
        delete $scope.key;
        console.log($scope.key);
    }
}])
.controller('passwordModal', ['$scope', '$uibModalInstance', function($scope,  $uibModalInstance) {
    $scope.ok = function () {
        $uibModalInstance.close($scope.password);
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
}])
.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});
