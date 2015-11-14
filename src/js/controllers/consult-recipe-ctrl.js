//inject angular file upload directives and services.
var app = angular.module('RDash');
 

 
 
app.controller('ConsultRecipe', ['$scope', '$rootScope', '$location', '$http' ,'Auth','TitleService','$cookies',
                        function ($scope,   $rootScope,   $location,   $http,Auth,TitleService,$cookies) {

						
						
 
   TitleService.setTitle('Consultar Receita');
   
   if (!Auth.isLoggedIn($cookies)) {
       console.log('DENY');
        Auth.setLastURL('#/listRecipe');     
		 window.location='#/login';
       
	   
    }
  
  
  
   $scope.loading='none';
   
   $scope.alerts = [];
   $scope.recipes = [];
 	var token    = $cookies['token'];
 
    $scope.consult=function(){
	
        $scope.alerts = [];
		$scope.recipes = [];
	    $scope.loading='true';

		$http({
		  method: 'GET',
		  url: 'http://mean-pingy.rhcloud.com/api/recipeRetrieve?token='+token
		  
		}).then(function successCallback(response) {
		
		console.log(response);
		
			angular.forEach(response.data, function(r) {
		     
			 
		 
			var recipe=  r.recipe;
			    recipe.id=r._id;
				

			$scope.recipes.push({'name':recipe.name,'id':r._id});
		
			});
		

			$scope.loading='none';
			
			
		  }, function errorCallback(response) {
		  
			console.log(response);
			$scope.loading='none';
			 
			
		  });
	  
    }
    
 
	var changeLocation = function(url, forceReload) {
  $scope = $scope || angular.element(document).scope();
  if(forceReload || $scope.$$phase) {
    window.location = url;
  }
  else {
    //only use this if you want to replace the history stack
    //$location.path(url).replace();

    //this this if you want to change the URL and add it to the history stack
    $location.path(url);
    $scope.$apply();
  }
}
  
	 
	
}]);