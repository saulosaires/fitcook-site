'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');
   
        // Application routes
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
				controller:'LoginController as LoginController'
            })		
            .state('saveRecipe', {
                url: '/saveRecipe',
                templateUrl: 'templates/detailRecipe.html',
				controller:'SaveRecipe as SaveRecipe',
				data: {requireLogin: true}
            })
			.state('updateRecipe', {
                url: '/detailRecipe/:id',
                templateUrl: 'templates/detailRecipe.html',
				controller:'UpdateRecipe as UpdateRecipe',
				data: {requireLogin: true}
            })
            .state('listRecipe', {
                url: '/listRecipe',
                templateUrl: 'templates/listRecipe.html',
				controller:'ConsultRecipe as ConsultRecipe',
				data: {requireLogin: true}
            });
    }
]).factory('TitleService', function(){

	var title='Home';

	return{
	
		setTitle : function(mTitle){
			title = mTitle;
		},
		getTitle : function(){
			return title;
		}
		
	  }
	  
})
.factory('LayoutService', function(){

	var showView='true';
	var showViewLogin='true';
	
	return{
	
		setShowView : function(value){
			showView = value;
		},
		isShowView : function(){
			return showView;
		},
		setShowViewLogin : function(value){
			showViewLogin=value;
		},
		isShowViewLogin : function(){
			return showViewLogin;
		}
		
	  }
	  
}).factory("Auth", function() {

	var user;
	var lastURL;
	var token;
		
	return{

		getLastURL : function(){
		
			if(typeof lastURL == 'undefined')
			return '#/';
			else
				return lastURL;
		},
		setLastURL : function(url){
			lastURL = url;
		},		
		setUser : function(aUser){
			user = aUser;
		},
		isLoggedIn : function($cookies){
 
			console.log($cookies);
			

			if(!token){
					
				var token    = $cookies['token'];	
				var email    = $cookies['user_email'];
				var password = $cookies['user_password'];

				if(email && password && token){
					user={'email':email,'password':password}
				}
			
			}
 
			return(user)? user : false;
		}
		
	  }

})