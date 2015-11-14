//inject angular file upload directives and services.
var app = angular.module('RDash');
 
 
   
app.controller('SaveRecipe', ['$scope', '$rootScope', '$location', 'Upload', '$http','Auth','TitleService','$cookies', 
                     function ($scope, $rootScope, $location, $upload, $http,Auth,TitleService,$cookies) {
   
	TitleService.setTitle('Cadastrar Receita');
   
    if (!Auth.isLoggedIn($cookies)) {
        console.log('DENY');
        Auth.setLastURL('#/saveRecipe');     
		window.location='#/login';      
		 
       
	   
    }

   var token = $cookies['token'];
   $scope.loading='none';
   $scope.displayDelete='none';
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
 
	  if(!$scope.validade()){
		return;
	  }
	  
		$scope.loading='true';
	  
      if (file && !file.$error) {
	  
          file.upload = $upload.upload({
            url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
            fields: {
              upload_preset: $.cloudinary.config().upload_preset
            },
            file: file
          }).success(function (data, status, headers, config) {
		   
		     var url= data['url'];
			 var id = data['public_id']
		   
            $scope.recipe.file = {'url':url,'public_id':id};
			$scope.prepare();
	  
			var json=JSON.stringify($scope.recipe);
	  
	        console.log(json);
			
			$http({
			  method: 'GET',
			  url: 'http://mean-pingy.rhcloud.com/api/recipeCreate?recipe='+json+'&token='+token
			  
			}).then(function successCallback(response) {
			
				console.log(response);
				$scope.loading='none';
				$scope.addAlert( 'success', 'Receita salva com sucesso');
				
			  }, function errorCallback(response) {
			  
			    console.log(response);
				$scope.loading='none';
				$scope.addAlert( 'danger', 'Alguma coisa errada aconteceu');
				
			  });
			
			 
          }).error(function (data, status, headers, config) {
		  
			console.log(data);
			$scope.loading='none';
			$scope.addAlert( 'danger', 'Erro ao fazer upload da imagem');
			
			
          });
		  
        }else{
		
		$scope.addAlert( 'danger', 'Imagem nao foi encontrada');
 
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
	
	$scope.prepare = function() {
	
	  $scope.recipe.category    = $scope.bategoriesToBit();
	  
	  $scope.recipe.ingredient=[];
	  $scope.recipe.instruction=[];
	  
	  angular.forEach($scope.ingredientList, function(i) {
		$scope.recipe.ingredient.push(i.description);
      });
	  
	  angular.forEach($scope.instructionList, function(i) {
		$scope.recipe.instruction.push(i.description);
      });
	
	}
	
	$scope.bategoriesToBit = function() {
	
	    var bitCat=0;
		angular.forEach($scope.category, function(cat) {
        
		if(cat.check){
		    bitCat |= (1<<cat.bit_position);
		}
		
      });
	  
	  return bitCat;
	
	}
	
    $scope.validade = function() {
      
	  
	  var valid= true;
	   
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