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
               createCategoriaStore();
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

        if ($scope.ListaUnidade.length > 0) {
            data.ListaUnidade = $scope.ListaUnidade.slice(0, $scope.ListaUnidade.length);
        }

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

                     evento.data.idKpi = response.data.Indicador.Id;
                     evento.data.idPessoal = response.data.Indicador.IdPessoal;
                     evento.data.dtCriacao = response.data.Indicador.dtCriacao;
                     evento.data.ListaUnidade = response.data.Indicador.ListaUnidade;

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

    var obterListaCategoria = function () {
        var pendencia = $.Deferred();

        var request = {};
        $http.post($scope.apiHost + "indicador/obterlistacategoria", request)
        .then(
           function (response) {
               $scope.ListaCategoria = response.data.ListaCategoria;
               pendencia.resolve();
           },
           function (response) {
               DevExpress.ui.notify("Sistema com erro favor contactar suporte", "error", 200);
               pendencia.resolve();
           }
        );

        pendencia.promise();
    }

    var desfazAlteracaoListaUnidade = function () {
       
        var dataGrid = $('.internal-grid').dxDataGrid('instance');
        var items = dataGrid.getDataSource().items();
        //items = $scope.editionKey.ListaUnidade.slice(0, $scope.editionKey.ListaUnidade.length);

        for (var i = 0; i < $scope.editionKey.ListaUnidade.length; i++) {
            items[i].Associado = $scope.editionKey.ListaUnidade[i].Associado;
        }

        dataGrid.refresh();
    }

    function createCategoriaStore() {
        $scope.storeCategoria = new DevExpress.data.CustomStore({
            load: function (loadOptions) {
                return $scope.ListaCategoria;
            },
            byKey: function (key) {

                if (key == "")
                    return;

                for (var i = 0; i < $scope.ListaCategoria.length; i++) {
                    var categoria = $scope.ListaCategoria[i];
                    if (categoria.idCategoria == key)
                        return $scope.ListaCategoria[i];
                }
            }
        });
    }

    var allowSorting = function (column, allow) {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.columnOption(column, "allowSorting", allow);
    }

    $scope.showCategoriaPopup = function () {
        $scope.visiblePopup = true;
    };

    var headerTemplate = function (header, info) {

        $('<a/>').addClass('dx-link')
                    .text(info.column.caption)
                    .on('dxclick', function (event) {
                        event.stopPropagation();
                        $scope.showCategoriaPopup();
                    })
                    //.on('mouseover', function () {

                    //   allowSorting('idCategoria', false);

                    //})
                    //.on('mouseout', function () {

                    //  allowSorting('idCategoria', true);

                    //})
                    .appendTo(header);
    };

    var init = function () {
        $scope.ListaUnidade = [];
        $scope.visiblePopup = false;
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

    $scope.popupOptions = {
        width: 200,
        height: 500,
        contentTemplate: "info",
        showTitle: true,
        title: "Categorias",
        dragEnabled: false,
        closeOnOutsideClick: true,
        bindingOptions: {
            visible: "visiblePopup",
        },
        onHidden: function (e) {
            obterListaCategoria();
        },
    };

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
                    { dataField: 'idCategoria', caption: $scope.Dicionario["idCategoria"], lookup: { displayExpr: 'Nome', valueExpr: 'idCategoria', dataSource: $scope.storeCategoria }, headerCellTemplate: headerTemplate },
                    { dataField: "idTipoFormato", caption: $scope.Dicionario["idTipoFormato"], lookup: { dataSource: $scope.ListaFormato, valueExpr: 'idTipoFormato', displayExpr: 'Nome' } },
                    { dataField: "idTipoFrequencia", caption: $scope.Dicionario["idTipoFrequencia"], lookup: { dataSource: $scope.ListaFrequencia, valueExpr: 'idTipoFrequencia', displayExpr: 'Nome' } },
                    { dataField: "idDirecao", caption: $scope.Dicionario["idDirecao"], lookup: { dataSource: $scope.ListaDirecao, valueExpr: 'idDirecao', displayExpr: 'Nome' } },
                    { dataField: "Medida", caption: $scope.Dicionario["idTipoMedida"] },
                    { dataField: "dtInicio", caption: $scope.Dicionario["dtInicio"], format: "dd/MM/yyyy", dataType: "date" },
                    { dataField: "dtFim", caption: $scope.Dicionario["dtFim"], format: "dd/MM/yyyy", dataType: "date" },
                    { dataField: "Ativo", caption: $scope.Dicionario["Ativo"], dateType: "boolean"},
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
                            onEditingStart: function (e) {
                                $scope.ListaUnidade = [];
                            },
                            onRowUpdating: function (e) {
                                var data = {};
                                $.extend(data, e.oldData, e.newData);
                                $scope.ListaUnidade.push(data);
                            },
                            onContentReady: function (e) {
                                e.component.element().find(".dx-datagrid-header-panel").hide();
                            },
                            columns: [{ dataField: "Nome", allowEditing: false }, { dataField: "Associado", dataType: "boolean", allowEditing: false }],
                            //dataSource: indicadorCorrente.ListaUnidade,
                            dataSource: {
                                store: {
                                    type: "array",
                                    key: "IdAssociacao",
                                    data: indicadorCorrente.ListaUnidade
                                }
                            },
                            id: "gridUnidade"
                        }).appendTo(container);
                }
            },
            onEditingStart: function (e) {
                e.element.find('.dx-datagrid-headers').toggleClass('dx-state-disabled', true);
                e.element.find('.dx-datagrid-pager').toggleClass('dx-state-disabled', true);
                collapse();
                $scope.editionKey = {};
                $scope.editionKey = $.extend(true, $scope.editionKey, e.key);
                e.component.expandRow(e.key);
                var gridUnidade = $(".internal-grid").dxDataGrid("instance");
                gridUnidade.columnOption("Associado", { allowEditing: true });
                
            },
            onInitNewRow: function (e) {

                $scope.editionKey = {};
                $scope.editionKey = $.extend(true, $scope.editionKey, e.key);
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
            onRowExpanding: function (e) {
                collapse();
            },
            onSelectionChanged: function (e) {

                e.component.collapseAll(-1);
                e.component.expandRow(e.currentSelectedRowKeys[0]);

            },
            onContentReady: function (e) {

                e.element.find('.dx-datagrid-headers').toggleClass('dx-state-disabled', e.component.hasEditData());
                e.element.find('.dx-datagrid-pager').toggleClass('dx-state-disabled', e.component.hasEditData());

                var lnkCancel = $(".dx-link.dx-link-cancel");
                if (lnkCancel.length == 1) {
                    lnkCancel.click(function () {
                        desfazAlteracaoListaUnidade();
                        collapse();
                    });
                }

                var lnkSave = $(".dx-link.dx-link-save");
                if (lnkSave.length == 1) {
                    lnkSave.click(function () {
                        var gridUnidade = $(".internal-grid").dxDataGrid("instance");
                        if (gridUnidade != undefined) {
                            save();
                        }
                    });
                }
         
            },
            onContextMenuPreparing: function (e) {
                if (e.column.dataField == 'idCategoria') {
                    e.items.push({ text: "Administrar Categorias", onItemClick: function () { $scope.showCategoriaPopup(); } });
                }
            },
        };
    }

    var save = function () {

        // Salva Tipos Unidade associados
        var gridUnidade = $(".internal-grid").dxDataGrid("instance");
        if (gridUnidade != undefined) {
            gridUnidade.saveEditData();
        }

        // Se indicador não estiver modificado força atualização
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        if (dataGrid.hasEditData() == false) {
            var evento = {};
            evento.cancel = false;
            evento.oldData = {};
            evento.newData = $scope.editionKey;
            atualizarIndicador(evento);
        }
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