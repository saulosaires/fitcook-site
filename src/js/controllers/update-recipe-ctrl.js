//inject angular file upload directives and services.
var app = angular.module('RDash');
 
 
   
app.controller('UpdateRecipe', ['$scope', '$rootScope', '$location', 'Upload', '$http','Auth','TitleService','$cookies', 
                     function ($scope, $rootScope, $location, $upload, $http,Auth,TitleService,$cookies ) {

		
	TitleService.setTitle('Atualizar Receita');

    if (!Auth.isLoggedIn($cookies)) {
       console.log('DENY');
       Auth.setLastURL('#//detailRecipe/'+$location.url().replace('/detailRecipe/',''));     
	   window.location='#/login';   
       
	   
    }
		
    var token = $cookies['token'];	
   // in controller
	$scope.init = function () {
	
	    $scope.loading='true';
	    var id =$location.url().replace('/detailRecipe/','');

			$http({
			  method: 'GET',
			  url: 'http://mean-pingy.rhcloud.com/api/retrieveById?id='+id+'&token='+token
			  
			}).then(function successCallback(response) {
			
				var objRecipe= response.data[0];
				console.log(objRecipe);
				var recipe= objRecipe.recipe;
					recipe.id=objRecipe._id;
			
				    $scope.file.path=recipe.file.url;
					$scope.file.id=recipe.file.public_id;
					
					$scope.recipe=recipe;
					 
			        console.log($scope.recipe);
				
				
				angular.forEach($scope.recipe.ingredient, function(i) {
					$scope.ingredientList.push({'description':i});
				});
		
				angular.forEach($scope.recipe.instruction, function(i) {
					$scope.instructionList.push({'description':i});
				});
		
				var category = $scope.recipe.category;
			 
			    //init category
				for (i = 0; i <= 10; i++) { 
    
					var mask =  1 << i;
					var masked_n = category & mask;
					var thebit = masked_n >> i;
						
					if(thebit==1)
						$scope.category[i].check=true;
	
				}

				$scope.loading='none';

			  }, function errorCallback(response) {
			  
			    console.log(response);
				$scope.loading='none';
				$scope.addAlert( 'danger', 'Alguma coisa errada aconteceu');
				
			  });	 

	};


   	
   $scope.loading='none';
   $scope.displayDelete='true';
   $scope.alerts = [];
   $scope.recipe = {};
   $scope.file = {};
   $scope.ingredientList = [];
   $scope.instructionList = [];
   
   $scope.category = [
					  {text:'Bebidas',              check:false, bit_position:0},
					  {text:'Bolos e Tortas',       check:false, bit_position:1},
					  {text:'Carnes e Aves',        check:false, bit_position:2},
					  {text:'Doces e Sobremesas',   check:false, bit_position:3},
					  {text:'Lanches',              check:false, bit_position:4},
					  {text:'Massa',                check:false, bit_position:5},
					  {text:'Pães',                 check:false, bit_position:6},
					  {text:'Peixe o frutos do Mar',check:false, bit_position:7},
					  {text:'Saladas e Molhos',     check:false, bit_position:8},
					  {text:'Sopa',                 check:false, bit_position:9},
					  {text:'Sucos',                check:false, bit_position:10}
					 ];
 
 
    $scope.save=function(file){
	
        $scope.alerts = [];
 
	    if(!validade(file)){
			return;
	    }
 
		if (file && !file.$error) {
		  saveRecipeNewImg(file);
		} else{		
		  saveRecipe($scope.file.id, $scope.file.path);	
		} 

    }
    
	function saveRecipeNewImg(file){
	
      $scope.loading='true';
	  
	  file.upload = $upload.upload({
		url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
		fields: {
		  upload_preset: $.cloudinary.config().upload_preset
		},
		file: file
	  }).success(function (data, status, headers, config) {
	   
		 var url= data['url'];
		 var id = data['public_id']
		 console.log(url);
	     console.log(id);
		 saveRecipe(id, url);
	
		 
	  }).error(function (data, status, headers, config) {
	  
		console.log(data);
		$scope.loading='none';
		$scope.addAlert( 'danger', 'Erro ao fazer upload da imagem');
		
		
	  });	
	
	}
	
	function saveRecipe(idFile, pathFile){
 	
	    $scope.loading='true';
	
		$scope.recipe.file = {'url':pathFile,'public_id':idFile};
		prepare();
  
		var json=JSON.stringify($scope.recipe);
  
		var mUrl='http://mean-pingy.rhcloud.com/api/recipeUpdate?recipe='+json+'&id='+$scope.recipe.id+'&token='+token;	
  
		console.log(mUrl);
		
		$http({
		  method: 'GET',
		  url: mUrl
		  
		}).then(function successCallback(response) {
			console.log('successCallback');
			console.log(response);
			$scope.loading='none';
			$scope.addAlert( 'success', 'Receita salva com sucesso');
			
		}, function errorCallback(response) {
			console.log('errorCallback');
			console.log(response);
			$scope.loading='none';
			$scope.addAlert( 'danger', 'Alguma coisa errada aconteceu');
		
		});	
	
	
	}
	
	$scope.delete = function(index) {
		if (confirm("Quer mesmo deletar? ")) {

			var mUrl='http://mean-pingy.rhcloud.com/api/deleteRecipe?id='+$scope.recipe.id+'&token='+token;	
	  
			console.log(mUrl);
			
			$http({
			  method: 'GET',
			  url: mUrl
			  
			}).then(function successCallback(response) {
				console.log('successCallback');
				console.log(response);
				$scope.loading='none';
				window.location='#/listRecipe';   
				$scope.addAlert( 'success', 'Receita salva com sucesso');
				
			}, function errorCallback(response) {
				console.log('errorCallback');
				console.log(response);
				$scope.loading='none';
				$scope.addAlert( 'danger', 'Alguma coisa errada aconteceu');
			
			});	
				
		
		
		}
	}
	
	$scope.addIngredient=function(){
	
	 if(this.ingredientDescription)
		$scope.ingredientList.push({'description':this.ingredientDescription});
		this.ingredientDescription='';
		 
	}
	 
  
	$scope.removeIngredient = function(index) {
		$scope.ingredientList.splice(index, 1);	
	};	 
	 
	$scope.addInstruction=function(){
	
	  if(this.instructionDescription)
		$scope.instructionList.push({'description':this.instructionDescription});
		this.instructionDescription='';
	}
	 
	$scope.removeInstruction = function(index) {
		$scope.instructionList.splice(index, 1);	
	};	 
 
	$scope.addAlert = function(type, msg) {
        $scope.alerts.push({'type':type,'msg': msg});	
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
	
	function prepare() {
	
	  $scope.recipe.category    = categoriesToBit();
	  
	  $scope.recipe.ingredient=[];
	  $scope.recipe.instruction=[];
	  
	  angular.forEach($scope.ingredientList, function(i) {
		$scope.recipe.ingredient.push(i.description);
      });
	  
	  angular.forEach($scope.instructionList, function(i) {
		$scope.recipe.instruction.push(i.description);
      });
	
	}
	
	function categoriesToBit() {
	
	    var bitCat=0;
		angular.forEach($scope.category, function(cat) {
        
		if(cat.check){
		    bitCat |= (1<<cat.bit_position);
		}
		
      });
	  
	  return bitCat;
	
	}
	
    function validade (file) {
      
	  
	  var valid= true;
	   
	  if (!$scope.file.path || (!file && file.$error)) {
		$scope.addAlert( 'danger', 'Imagem nao foi encontrada');
		valid= false;
		 
	  }
	   
	  if(!$scope.recipe.name){
		  $scope.addAlert( 'danger', 'Nome é obrigatório');valid= false;
	  }
	  if(!$scope.recipe.description){
		  $scope.addAlert( 'danger', 'Descrição é obrigatório');valid= false;
	  }
	  if(!$scope.recipe.timeToPrepare){
		  $scope.addAlert( 'danger', 'Tempo de Preparo é obrigatório');valid= false;
	  }
	  if(!$scope.recipe.servings){
		  $scope.addAlert( 'danger', 'Porções é obrigatório');valid= false;
	  }	  
	 
	  var countCat=false;
	  angular.forEach($scope.category, function(cat) {
        
		if(cat.check){
		  countCat=true;
		}
		
      });
	  if(!countCat){
		  $scope.addAlert( 'danger', 'Escolha pelo menos uma categoria!');
		  valid= false;
	  }	 
	  
	  
	  if($scope.ingredientList.length==0){
		  $scope.addAlert( 'danger', 'Informe pelo menos um ingrediente');valid= false;
	  }	  
	  if($scope.instructionList.length==0){
		  $scope.addAlert( 'danger', 'Informe pelo menos uma instrução');valid= false;
	  }	 	  
	  
	  
	  
	  return valid;
	  
    };	 
	
	
	
}]);