//inject angular file upload directives and services.
var app = angular.module('RDash');
 

 
 
app.controller('LoginController', ['$scope', '$rootScope', '$location', '$http' ,'Auth','LayoutService','$cookies',
                        function ($scope,   $rootScope,   $location,   $http,Auth,LayoutService,$cookies) {

  

   LayoutService.setShowView('none');
   LayoutService.setShowViewLogin('true');
  
  
   $scope.email='liaeverton@gmail.com';
   $scope.password;  
 
 
 
    $scope.login=function(){
	
	
		$http({
		  method: 'GET',
		  url: 'http://mean-pingy.rhcloud.com/api/login?email='+$scope.email+'&password='+$scope.password
		  
		}).then(function successCallback(response) {
		
			console.log(response.data);
			
			if(response.data.status=='success'){
			
				 $cookies['token']        = response.data.token;
				 $cookies['user_email']   = $scope.email;
				 $cookies['user_password']= $scope.password;
				
				 LayoutService.setShowView('true');
				 LayoutService.setShowViewLogin('none');
				
				 window.location= Auth.getLastURL();	
			}
			
		  }, function errorCallback(response) {
		  
			console.log(response);
			
			
		  });		
		
	  
    }
    
 
 
  
	 
	
}]);