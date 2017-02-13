MokiIndicadoresApp.controller('IndicadorController', function IndicadorController($scope, $http) {

    var obterDadosIniciais = function () {
        var request = {};
        request.verbetes = ObterListaVerbetes();
        $http.post($scope.apiHost + "indicador/obterlistaindicador", request)
        .then(
           function (response) {
               $scope.Listaindicador = response.data.Indicadores;
               $scope.ListaCategoria = response.data.ListaCategoria;
               $scope.ListaFrequencia = response.data.ListaFrequencia;
               $scope.ListaDirecao = response.data.ListaDirecao;
               $scope.ListaFormato = response.data.ListaFormato;
               $scope.Dicionario = getDicionario(response.data.Dicionario);
               $scope.ListaUnidade = response.data.ListaUnidade;
               buildDataGrid();
           },
           function (response) {
               DevExpress.ui.notify("Sistema com erro favor contactar suporte", "error", 200);
           }
        );
    }

    var atualizarIndicador = function (evento) {

        var pendencia = $.Deferred();

        var data = {};
        $.extend(data, evento.oldData, evento.newData);

        var request = {};
        request.indicador = data;

        $http.post($scope.apiHost + "indicador/alterarindicador", request)
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

    var incluirIndicador = function (evento) {

        var pendencia = $.Deferred();

        var request = {};
        request.indicador = evento.data;

        $http.post($scope.apiHost + "indicador/incluirindicador", request)
         .then(
             function (response) {
                 if (response.data.Valido) {

                     DevExpress.ui.notify(response.data.Mensagens[0], "success", $scope.messageDelay);

                     evento.data.idKpi = response.data.Id;
                     evento.data.idPessoal = response.data.IdPessoal;
                     evento.data.dtCriacao = response.data.dtCriacao;
                     evento.data.ListaUnidade = response.data.ListaUnidade;

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

        listaVerbetes.push("idKpi");
        listaVerbetes.push("idCategoria");
        listaVerbetes.push("idTipoFormato");
        listaVerbetes.push("idTipoFrequencia");
        listaVerbetes.push("idImportacao");
        listaVerbetes.push("idPessoal");
        listaVerbetes.push("Nome");
        listaVerbetes.push("Descricao");
        listaVerbetes.push("Ativo");
        listaVerbetes.push("dtInicio");
        listaVerbetes.push("dtCriacao");
        listaVerbetes.push("dtFim");
        listaVerbetes.push("idDirecao");
        listaVerbetes.push("Ordem");
        listaVerbetes.push("idTipoMedida");
        listaVerbetes.push("Administração Indicadores");

        return listaVerbetes;
    }

    function buildDataGrid() {

        $scope.dataGridOptions = {
            dataSource: $scope.Listaindicador,
            paging: {
                enabled: true
            },
            selection: {
                mode: "single"
            },
            editing: {
                mode: "row",
                allowUpdating: true,
                allowDeleting: false,
                allowAdding: true,
                allowColumnReordering: true,
                rowAlternationEnabled: true,
                showBorders: true,
                showRowLines: true,
                columnAutoWidth: true,
            },

            columns: [{ dataField: "Nome", caption: $scope.Dicionario["Nome"]},
                    { dataField: "Descricao", caption: $scope.Dicionario["Descricao"] },
                    { dataField: "idCategoria", caption: $scope.Dicionario["idCategoria"], lookup: { dataSource: $scope.ListaCategoria, valueExpr: 'idCategoria', displayExpr: 'Nome' } },
                    { dataField: "idTipoFormato", caption: $scope.Dicionario["idTipoFormato"], lookup: { dataSource: $scope.ListaFormato, valueExpr: 'idTipoFormato', displayExpr: 'Nome' } },
                    { dataField: "idTipoFrequencia", caption: $scope.Dicionario["idTipoFrequencia"], lookup: { dataSource: $scope.ListaFrequencia, valueExpr: 'idTipoFrequencia', displayExpr: 'Nome' } },
                    //{ dataField: "idTipoFrequenciaMeta", caption: $scope.Dicionario["idTipoFrequenciaMeta"], lookup: { dataSource: $scope.ListaFrequencia, valueExpr: 'idTipoFrequencia', displayExpr: 'Nome' } },
                    { dataField: "idDirecao", caption: $scope.Dicionario["idDirecao"], lookup: { dataSource: $scope.ListaDirecao, valueExpr: 'idDirecao', displayExpr: 'Nome' } },
                    { dataField: "Medida", caption: $scope.Dicionario["idTipoMedida"] },
                    { dataField: "dtInicio", caption: $scope.Dicionario["dtInicio"], format: "dd/MM/yyyy", dataType: "date" },
                    { dataField: "dtFim", caption: $scope.Dicionario["dtFim"], format: "dd/MM/yyyy", dataType: "date" },
                    { dataField: "Ativo", caption: $scope.Dicionario["Ativo"], dateType: "boolean", allowSorting: false },
                    { dataField: "dtCriacao", format: "dd/MM/yyyy", dataType: "date" ,visible: false, sortIndex: 0, sortOrder: 'desc' }
            ],
            masterDetail: {
                enabled: true,
                template: function (container, options) {
                    var indicadorCorrente = options.data;   
                    container.addClass("internal-grid-container");
                    $("<div>")
                        .text("Tipos de Unidade:")
                        .css("margin", "auto")
                        .css("text-align", "center")
                        .appendTo(container);
                    $("<div>")
                        .addClass("internal-grid")
                        .css("margin", "auto")
                        .dxDataGrid({
                            columnAutoWidth: true,
                            showColumnLines: false,
                            showRowLines: true,
                            rowAlternationEnabled: true,
                            showBorders: true,
                            width: "45%",
                            editing: {
                                mode: "batch",
                                allowUpdating: true,
                            },
                            selection: {
                                mode: "none"
                            },
                            onRowUpdating: function (e) {
                                alert('internalSave');
                            },
                            onContentReady: function (e) {
                                e.component.element().find(".dx-datagrid-header-panel").hide();
                            },
                        
                            columns: [{ dataField: "Nome", allowEditing: false }, { dataField: "Associado", dataType: "boolean", allowEditing: false }],
                            dataSource: indicadorCorrente.ListaUnidade,
                            id: "gridUnidade"
                        }).appendTo(container);
                }
            },
            onEditingStart: function (e) {

                e.component.expandRow(e.key);
                var gridUnidade = $(".internal-grid").dxDataGrid("instance");
                gridUnidade.columnOption("Associado", { allowEditing: true });

            },
            onInitNewRow: function (e) {

                e.data.Ativo = true;
                collapse();

            },
            onRowInserting: function (e) {

                incluirIndicador(e);
              
            },
            onRowInserted: function (e) {

                e.component.clearSorting();
                e.component.columnOption('dtCriacao', 'sortOrder', 'desc');

            },
            onRowUpdating: function (e) {

                atualizarIndicador(e);
               

            },
            onRowUpdated: function (e) {

                e.component.collapseAll(-1);

            },
            onSelectionChanged: function (e) {

                e.component.collapseAll(-1);
                e.component.expandRow(e.currentSelectedRowKeys[0]);

            },
            onContentReady: function (e) {

                var lnkCancel = $(".dx-link.dx-link-cancel");
                if (lnkCancel.length == 1) {
                    lnkCancel.click(function () {
                        collapse();
                    });
                }

                var lnkSave = $(".dx-link.dx-link-save");
                if (lnkSave.length == 1) {
                    lnkSave.click(function () {
                        var gridUnidade = $(".internal-grid").dxDataGrid("instance");
                        gridUnidade.saveEditData();
                        collapse();
                    });
                }
            },
        };
    }

    function collapse() {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.collapseAll(-1);
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