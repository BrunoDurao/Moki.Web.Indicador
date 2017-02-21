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

    var atualizarcategoria = function (evento) {

        var pendencia = $.Deferred();

        var data = {};
        $.extend(data, evento.oldData, evento.newData);

        var request = {};
        request.Categoria = data;

        $http.post($scope.apiHost + "indicador/alterarcategoria", request)
         .then(
             function (response) {
                 if (response.data.Valido) {
                     DevExpress.ui.notify(response.data.Mensagens[0], "success", $scope.messageDelay);
                     pendencia.resolve();
                 } else {
                     DevExpress.ui.notify(response.data.Mensagens[0], "error", $scope.messageDelay);
                     pendencia.resolve(true);
                 }
             },
             function (response) {
                 DevExpress.ui.notify(response.data.Mensagens[0], "error", $scope.messageDelay);
                 pendencia.resolve(true);
             }
          );

        evento.cancel = pendencia.promise();

    }

    var incluirCategoria = function (evento) {

        var pendencia = $.Deferred();

        var request = {};
        request.Categoria = evento.data;

        $http.post($scope.apiHost + "/indicador/incluircategoria", request)
         .then(
             function (response) {
                 if (response.data.Valido) {

                     DevExpress.ui.notify(response.data.Mensagens[0], "success", $scope.messageDelay);
                     evento.data.idCategoria = response.data.Categoria.idCategoria;
                     pendencia.resolve();

                 } else {

                     DevExpress.ui.notify(response.data.Mensagens[0], "error", $scope.messageDelay);
                     pendencia.resolve(true);
                 }
             },
             function (response) {
                 DevExpress.ui.notify(response.data.Mensagens[0], "error", $scope.messageDelay);
                 pendencia.resolve(true);

             }
          );

        evento.cancel = pendencia.promise();
    }

    var excluirCategoria = function (evento) {

        var pendencia = $.Deferred();

        request = {};
        request.idCategoria = evento.data.idCategoria;

        $http.post($scope.apiHost + "/indicador/excluircategoria", request)
         .then(
             function (response) {
                 if (response.data.Valido) {
                     DevExpress.ui.notify(response.data.Mensagens[0], "success", $scope.messageDelay);
                     pendencia.resolve();
                 } else {

                     DevExpress.ui.notify(response.data.Mensagens[0], "error", $scope.messageDelay);
                     pendencia.resolve(true);
                 }
             },
             function (response) {
                 DevExpress.ui.notify(response.data.Mensagens[0], "error", $scope.messageDelay);
                 pendencia.resolve(true);
             }
          );

        evento.cancel = pendencia.promise();

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

        $scope.dataGridOptionsCategoria = {
            dataSource: $scope.ListaCategoria,
            paging: {
                enabled: true,
                pageSize: 20
            },
            editing: {
                mode: "row",
                allowUpdating: false,
                allowDeleting: false,
                allowAdding: true,
                allowColumnReordering: true,
                rowAlternationEnabled: true,
                showBorders: true,
                showRowLines: true,
                columnAutoWidth: true,
            },
            columns: [{ dataField: "Nome", caption: $scope.Dicionario["Nome"], width: "12%" },
                     { dataField: "idCategoria", visible: false, sortIndex: 0, sortOrder: 'desc' }
            ],

            onEditingStart: function (e) {
            },
            onInitNewRow: function (e) {
            },
            onRowInserting: function (e) {
                incluirCategoria(e);
            },
            onRowInserted: function (e) {
                e.component.clearSorting();
                e.component.columnOption('idCategoria', 'sortOrder', 'desc');
            },
            onRowUpdating: function (e) {
                atualizarcategoria(e);

            },
            onRowUpdated: function (e) {
            },
            onRowRemoving: function (e) {
                excluirCategoria(e);
            },
            onRowRemoved: function (e) {
            }
        };

        if ($('#gridContainerCategoria').parent().attr('id') == 'admcategoria-container') {
            $scope.dataGridOptionsCategoria.editing.allowUpdating = true;
            $scope.dataGridOptionsCategoria.editing.allowDeleting = true;

        }
        
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