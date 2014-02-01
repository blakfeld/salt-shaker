angular.module('salt-shaker', ['ui.bootstrap', 'ui-utils']);

function dynamic_alerts($scope) {
    $scope.alerts = [];

    $scope.addAlert = function(alert_type, alert_msg) {
        $scope.alerts.push({type: alert_type, msg: alert_msg});
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

}