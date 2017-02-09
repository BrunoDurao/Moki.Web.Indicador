MokiIndicadoresApp.controller('CategoriaController', function CategoriaController($scope, $http) {

    var obterDadosIniciais = function () {
        var request = {};
        request.verbetes = ObterListaVerbetes();
        $http.post($scope.apiHost + "indicador/obterlistacategoria", request)
        .then(
           function (response) {
               
               $scope.ListaCategoria = response.data.ListaCategoria;
               $scope.Dicionario = getDicionario(response.data.Dicionario);
                    
               buildDataGrid();
           },
           function (response) {
               DevExpress.ui.notify("Sistema com erro favor contactar suporte", "error", 200);
           }
        );
    }

    var atualizarcategoria = function (data) {
        var request = {};
        request.Categoria = data;
        $http.put($scope.apiHost + "/indicador/alterarcategoria", request)
         .then(
             function (response) {
                 if (response.data.Valido) {
                     DevExpress.ui.notify(response.data.Mensagens[0], "success", $scope.messageDelay);
                 } else {
                     DevExpress.ui.notify(response.data.Mensagens[0], "error", $scope.messageDelay);
                 }
             },
             function (response) {
                 DevExpress.ui.notify(response.data.Mensagens[0], "error", $scope.messageDelay);
             }
          );
    }

    var incluirCategoria = function (data) {
        var request = {};
        request.Categoria = data;
        $http.post($scope.apiHost + "/indicador/incluircategoria", request)
         .then(
             function (response) {
                 DevExpress.ui.notify(response.data.Mensagens[0], "success", $scope.messageDelay);
             },
             function (response) {
                 DevExpress.ui.notify(response.data.Mensagens[0], "error", $scope.messageDelay);
             }
          );
    }

    var excluirCategoria = function (data) {    
        request = {};
        request.idCategoria = data.idCategoria;
        $http.post($scope.apiHost + "/indicador/excluircategoria", request)
         .then(
             function (response) {
                 DevExpress.ui.notify(response.data.Mensagens[0], "success", $scope.messageDelay);
             },
             function (response) {
                 DevExpress.ui.notify(response.data.Mensagens[0], "error", $scope.messageDelay);
             }
          );
    }

    var init = function () {
        obterDadosIniciais();
    };
        
    var ObterListaVerbetes = function () {

        var listaVerbetes = [];

        listaVerbetes.push("idCategoria");
        listaVerbetes.push("Nome");
        listaVerbetes.push("Descricao");
        listaVerbetes.push("Ativo");
   

        return listaVerbetes;
    }

    function buildDataGrid() {

        $scope.dataGridOptions = {
            dataSource: $scope.ListaCategoria,
            paging: {
                enabled: false
            },
            editing: {
                mode: "row",
                allowUpdating: true,
                allowDeleting: true,
                allowAdding: true,
                AllowColumnReordering: true,
            },
            columns: [{ dataField: "Nome", caption: $scope.Dicionario["Nome"], width:"12%" }],
                        //{ dataField: "Descricao", caption: $scope.Dicionario["Descricao"], width: "20%" },
                        //{ dataField: "Ativo", caption: $scope.Dicionario["Ativo"] },
            onEditingStart: function (e) {
            },
            onInitNewRow: function (e) {
            },
            onRowInserting: function (e) {
                incluirCategoria(e.data);
            },
            onRowInserted: function (e) {
            },
            onRowUpdating: function (e) {

                var data = {};
                $.extend(data, e.oldData, e.newData);
                atualizarcategoria(data);
            },
            onRowUpdated: function (e) {
            },
            onRowRemoving: function (e) {
                excluirCategoria(e.data);
            },
            onRowRemoved: function (e) {
            }
        };
    }

    function getDicionario(dicionario) {
        hashDicionario = {};

        for (var i = 0; i < dicionario.length; i++) {
            hashDicionario[dicionario[i].Mensagem] = dicionario[i].Traduzido;
        }

        return hashDicionario;
    }

    init();
});