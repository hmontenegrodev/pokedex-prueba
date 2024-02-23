angular.module('myApp', [])
.controller('MainController', function($scope, ApiService) {
    $scope.searchTerm = '';
    $scope.currentPage = 1;
    $scope.pageSize = 10; // Cantidad de elementos por página
    $scope.totalPages = 0;
    $scope.pages = [];
    $scope.filteredData = [];

    // Función para buscar y paginar
    $scope.search = function() {
        ApiService.getData($scope.searchTerm).then(function(response) {
            $scope.data = response.data;
            $scope.totalPages = Math.ceil($scope.data.length / $scope.pageSize);
            $scope.pages = Array.from({ length: $scope.totalPages }, (_, i) => i + 1);
            $scope.setPage(1);
        }).catch(function(error) {
            console.error('Error obteniendo datos de la API:', error);
        });
    };

    // Función para establecer la página actual
    $scope.setPage = function(page) {
        $scope.currentPage = page;
        var startIndex = (page - 1) * $scope.pageSize;
        var endIndex = startIndex + $scope.pageSize;
        $scope.filteredData = $scope.data.slice(startIndex, endIndex);
    };

    // Función para ir a la página anterior
    $scope.prevPage = function() {
        if ($scope.currentPage > 1) {
            $scope.setPage($scope.currentPage - 1);
        }
    };

    // Función para ir a la página siguiente
    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.totalPages) {
            $scope.setPage($scope.currentPage + 1);
        }
    };
})
.factory('ApiService', function($http) {
    return {
        getData: function(searchTerm) {
            // Reemplaza 'URL_DE_TU_API' con la URL de tu API
            return $http.get('URL_DE_TU_API', { params: { q: searchTerm } });
        }
    };
});