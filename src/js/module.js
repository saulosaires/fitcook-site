var app = angular.module('RDash', ['ui.bootstrap', 'ui.router', 'ngCookies','ngFileUpload','xeditable']);


app.constant('config', {
    appVersion: 1.0,
    apiUrl: 'http://mean-pingy.rhcloud.com/api/',
	 
	category :[
				  {text:'Bebidas',              check:false, bit_position:0, bit_value:1,recipes:[]},
				  {text:'Bolos e Tortas',       check:false, bit_position:1, bit_value:2,recipes:[]},
				  {text:'Carnes e Aves',        check:false, bit_position:2, bit_value:4,recipes:[]},
				  {text:'Doces e Sobremesas',   check:false, bit_position:3, bit_value:8,recipes:[]},
				  {text:'Lanches',              check:false, bit_position:4, bit_value:16,recipes:[]},
				  {text:'Massa',                check:false, bit_position:5, bit_value:32,recipes:[]},
				  {text:'Pães',                 check:false, bit_position:6, bit_value:64,recipes:[]},
				  {text:'Peixe o frutos do Mar',check:false, bit_position:7, bit_value:128,recipes:[]},
				  {text:'Saladas e Molhos',     check:false, bit_position:8, bit_value:256,recipes:[]},
				  {text:'Sopa',                 check:false, bit_position:9, bit_value:512,recipes:[]},
				  {text:'Sucos',                check:false, bit_position:10,bit_value:1024,recipes:[]}
				]
});
