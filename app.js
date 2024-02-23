angular.module('PokedexApp', [])

    .controller('MainController', function ($scope, $filter, $window, ApiService) {
        
        $scope.nextPageUrl = null;
        $scope.prevPageUrl = null;

        $scope.loadingList = false;
        $scope.loadingDetails = false;


        // Función para buscar el listado de pokemones
        $scope.getData = function (url) {
            $scope.loadingList = true;
            ApiService.getPokemons(url).then(function (response) {
                $scope.data = $filter('orderBy')(response.data.results, 'name');
                $scope.loadingList = false;
                $scope.nextPageUrl = response.data.next;
                $scope.prevPageUrl = response.data.previous;
            }).catch(function (error) {
                $scope.loadingList = false;
                console.error('Error obteniendo datos de la API:', error);
            });
        };

        // Función para obtener el detalle un pokemon
        $scope.getDetails = function(name){
            $scope.loadingDetails = true;
            ApiService.getPokemonDetails(name).then(function (response) {
                $scope.loadingDetails = false;
                $scope.pokemonSelected = response.data;
                $scope.scrollToDetails();
            }).catch(function (error) {
                $scope.loadingDetails = false;
                console.error('Error obteniendo datos de la API:', error);
            });
        }

        // Función para ir a la página anterior
        $scope.prevPage = function () {
           $scope.getData($scope.prevPageUrl);
        };

        // Función para ir a la página siguiente
        $scope.nextPage = function () {
           $scope.getData($scope.nextPageUrl);
        };

        //Hacer scroll hasta el contenedor de detalles del pokemon
        $scope.scrollToDetails = function() {
            var targetElement = document.getElementById('cont-details');
            if (targetElement) {
                var offsetTop = targetElement.offsetTop;
                $window.scrollTo(0, offsetTop);
            }
        };

        //Iniciar la aplicacion con los primeros pokemones
        $scope.getData();
    })


    .factory('ApiService', function ($http) {
        return {
            getPokemons: function (url) {
                var urlApi = url != undefined ? url : 'https://pokeapi.co/api/v2/pokemon' 
                return $http.get(urlApi);
            },
            getPokemonDetails: function (namePokemon) {
                var urlApi = 'https://pokeapi.co/api/v2/pokemon';
                return $http.get(urlApi + "/" + namePokemon);
            }
        };
    });
