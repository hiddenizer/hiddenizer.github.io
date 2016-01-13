angular
.module('hiddenizerApp', ['xeditable', 'ui.bootstrap', 'cfp.loadingBar'])
.controller('hiddenizer', ['$scope', 'gdrive', 'scrypto', '$uibModal', 'cfpLoadingBar', function($scope, gdrive, scrypto, $uibModal, cfpLoadingBar) {

    $scope.records = [];
    $scope.alerts = [];

    $scope.load = function() {
        $uibModal.open({
            templateUrl: 'passwordModal.html',
            controller: 'passwordModal'
        }).result
        .then(function(password) {
            $scope.password = password;

            cfpLoadingBar.start();

            return gdrive.load();
        })
        .then(function(cipheredText) {
            if (!cipheredText || cipheredText.length == 0)
                return;

            try {
                $scope.records = JSON.parse(scrypto.decrypt(cipheredText, $scope.password));
            } catch (e) {
                $scope.addAlert({type: 'danger', msg: 'Password is wrong!'});
            }
        }).catch(function(e) {
            console.log(e);
            $scope.addAlert({type: 'danger', msg: 'Error on loading...'});
        }).finally(function() {
            cfpLoadingBar.complete();
        });
    }

    $scope.save = function() {
        cfpLoadingBar.start();
        cipheredText = scrypto.encrypt(JSON.stringify($scope.records), $scope.password);
        gdrive.save(cipheredText)
        .then(function() {
            $scope.addAlert({type: 'success', msg: 'Saved!'});
            $scope.records = [];
        }).catch(function(e) {
            console.log(e);
            $scope.addAlert({type: 'danger', msg: 'Error on saving...'});
        }).finally(function() {
            cfpLoadingBar.complete();
        });
    }

    $scope.newSite = function() {
        $scope.records.push({
            name: ''
        });
    }

    $scope.working = function() {
        return cfpLoadingBar.status() > 0 && cfpLoadingBar.status() < 1;
    }

    $scope.status = function() {
        return cfpLoadingBar.status();
    }

    $scope.saveEntry = function(entry, index) {
        $scope.records[index][entry.key] = entry.value;
        delete $scope.$$childTail.entry;
        delete $scope.$$childHead.entry;
	}

    $scope.remove = function(record, key) {
        delete record[key];
    }

    $scope.addAlert = function(alert) {
      $scope.alerts.push(alert);
    };

    $scope.removeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.load();
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
})
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.includeBar  = true;
    //cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-bar"><div class="bar"><div class="peg"></div></div></div><div><span class="fa">Loading...</div>';
}]);
