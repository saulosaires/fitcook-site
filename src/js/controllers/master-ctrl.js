/**
 * Master Controller
 */

angular.module('RDash')
    .controller('MasterCtrl', ['$scope', '$cookieStore','TitleService','LayoutService', MasterCtrl]);

function MasterCtrl($scope, $cookieStore,TitleService,LayoutService) {
    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;
	$scope.path='Home';
	$scope.showView='true';
	$scope.showViewLogin='false';
	
	$scope.$watch(
		function () { return LayoutService.isShowView(); },
		function (newValue, oldValue) {
		   $scope.showView=LayoutService.isShowView();
		}
	);
	
	$scope.$watch(
		function () { return LayoutService.isShowViewLogin(); },
		function (newValue, oldValue) {
		   $scope.showViewLogin=LayoutService.isShowViewLogin();
		}
	);		
	
	$scope.$watch(
		function () { return TitleService.getTitle(); },
		function (newValue, oldValue) {
		   $scope.path=TitleService.getTitle();
		}
	);	

	

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };
}