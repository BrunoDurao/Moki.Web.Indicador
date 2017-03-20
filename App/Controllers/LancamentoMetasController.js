MokiIndicadoresApp.controller('LancamentoMetasController', function LancamentoMetasController($scope, $http) {

    DevExpress.localization.locale('pt');

    $scope.lookupIndicadoresValue = -1;
    $scope.lookupUnidadesValue = -1;
    $scope.escolhaVisaoValue = 'Indicador';
    $scope.medida = '';
    $scope.dados = [];
    $scope.alterados = [];
    $scope.ListaIndicador = [];
    $scope.currentValue = new Date();


    var obterDadosIniciais = function () {
        var request = {};
        request.verbetes = {}; //ObterListaVerbetes();
        $http.post($scope.apiHost + "indicador/obterlancamentovalores", request)
        .then(
           function (response) {
               $scope.ListaIndicador = response.data.Indicadores;
               $scope.ListaFrequencia = response.data.ListaFrequencia;
               $scope.ListaUnidade = response.data.ListaUnidade;
               //$scope.Dicionario = getDicionario(response.data.Dicionario);
               setLookupIndicadores();
               setLookupUnidades();
               setEscolhaFrequencia();
               configuraDatapadrao();
               configuraFrequenciaPadrao();
           },
           function (response) {
               DevExpress.ui.notify("Sistema com erro favor contactar suporte", "error",  $scope.messageDelay);
           }
        );
    };

    var obterResultados = function () {

          var request = $scope.parametros;

        $http.post($scope.apiHost + "indicador/obterlistameta", request)
        .then(
           function (response) {

               $scope.ListaResultado = response.data.ListaMeta;
               var transformado = transformar($scope.ListaResultado);
               $scope.dadosgrid = transformado.slice(0, transformado.lenght);
               montarColunas();
               $('#gridContainervalores').dxDataGrid('instance').option("columns", $scope.colunas);
               $('#gridContainervalores').dxDataGrid('instance').option("dataSource", $scope.dadosgrid);
           },
           function (response) {

               DevExpress.ui.notify("Sistema com erro favor contactar suporte", "error",  $scope.messageDelay);
           }
        );
    };

    var init = function () {
        obterDadosIniciais();
    };

    $scope.dbConfig = {
        maxZoomLevel: 'decade',
        minZoomLevel: 'decade',
        bindingOptions: { value: 'currentValue'}
    };

    var transformar = function (dados) {

        transformado = [];

        var i = 0;
        var x = 0;

        while (x < dados.length) {
            transformado[i] = {};
            transformado[i].unidade = dados[x].NomeFantasia;

            while (transformado[i].unidade == dados[x].NomeFantasia) {


                if ($scope.escolhaFrequenciaValue.idTipoFrequencia == 4) {
                    var ano = dados[x].dtReferencia.substr(0, 4);
                }

                if ($scope.escolhaFrequenciaValue.idTipoFrequencia == 3) {
                    var ano = dados[x].dtReferencia.substr(0, 7);
                }

                if ($scope.escolhaFrequenciaValue.idTipoFrequencia == 1) {
                    var ano = dados[x].dtReferencia.substr(0, 10);
                }

                transformado[i][ano] = dados[x].Valor;

        
                x++;

                if (x >= dados.length)
                    break;
            }

            i++;
        }

        return transformado;
    }

    var montarColunas = function () {

        $scope.colunas = [];

        for (var property in $scope.dadosgrid[0]) {
            if ($scope.dadosgrid[0].hasOwnProperty(property)) {
                var coluna = {};
                coluna.dataField = property;
                if (property != 'unidade') {
                    coluna.format = 'decimal fixedPoint';
                    coluna.precision = '2';
                    coluna.dataType = 'number';
                    coluna.headerCellTemplate = dataHeaderTemplate;
                    coluna.customizeText = function (options) {
                        //if (options.value !== 0) {
                            //if ($scope.medida == 'R$') {
                            //    return 'R$ ' + options.valueText;
                            //} else {
                            //    return options.valueText + ' ' + $scope.medida;
                            //}
                        //}
                        return options.valueText;
                    };
                    $scope.colunas.push(coluna);
                } else {
                    coluna.allowEditing = false;
                    if ($scope.escolhaVisaoValue == 'Unidade')
                        coluna.caption = 'INDICADOR';
                    else
                        coluna.caption = 'UNIDADE';

                    $scope.colunas.unshift(coluna);
                }
            }
        }
    };

    var dataHeaderTemplate = function (header, info) {

        header.css("text-align", "right");

        switch ($scope.escolhaFrequenciaValue.idTipoFrequencia) {
            case 1:
                header[0].innerText = info.column.caption.substr(8,2) + '-'  + info.column.caption.substr(5,2) + '-' + info.column.caption.substr(0,4);
                break;
            case 2:
                break;
            case 3:
                header[0].innerText = info.column.caption.substr(5, 2) + '-' + info.column.caption.substr(0, 4);
                break;
            case 4:
                header[0].innerText = info.column.caption;
                break;
        }
    };

    $scope.escolhaVisao = {
        items: ['Indicador', 'Unidade'],
        value: 'Indicador',
        layout: "horizontal",
        bindingOptions: { value: 'escolhaVisaoValue' },
        onOptionChanged: function (e) {
            if (e.value == 'Indicador') {
                $('#lkIndicadores').show();
                $('#lkUnidades').hide();
                $('#lkUnidades').dxLookup('instance').option('value', undefined);
            } else {
                $('#lkIndicadores').hide();
                $('#lkIndicadores').dxLookup('instance').option('value',undefined);
                $('#lkUnidades').show();
                $('#rgFrequencia').dxRadioGroup('instance').option('disabled', false);
            }
        },
    };

    function setLookupIndicadores() {
        $scope.LookupIndicadores = {
            displayExpr: 'Nome',
            dataSource: new DevExpress.data.DataSource({
                store: $scope.ListaIndicador,
                group: "kpiCategorias.Nome"
            }),
            showPopupTitle: false,
            grouped: true,
            bindingOptions: { value: 'lookupIndicadoresValue' },
            onOptionChanged: function (e) {

                var tipo = typeof e.value;

                if (tipo == 'object' && e.value != null && "idTipoFrequencia" in e.value &&  typeof e.previousValue == 'object' && e.previousValue != null) {
                    
                    if (e.fullName == "selectedItem" && e.previousValue.idKpi == e.value.idKpi) {
                        var frequencia = $scope.ListaFrequencia.filter(function (obj) {
                            return obj.idTipoFrequencia == e.value.idTipoFrequencia;
                        });

                        $scope.escolhaFrequenciaValue = frequencia[0];

                        if (e.value.Medida != undefined) {
                            $scope.medida = e.value.Medida;
                        }
                        else {
                            $scope.medida = "";
                        }

                        $('#rgFrequencia').dxRadioGroup('instance').option('disabled', true);

                        configuraDatapadrao();
                        obterParametros();
                        obterResultados();
                    }
                }
            }
        };
    }

    var configuraDatapadrao = function () {
        var hoje = new Date();

        if ($scope.currentValue == undefined) {
            switch ($scope.escolhaFrequenciaValue.idTipoFrequencia) {
                case 1:
                    $scope.currentValue = hoje;
                    break;
                case 2:
                    break;
                case 3:
                    $scope.currentValue = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
                    break;
                case 4:
                    $scope.currentValue = new Date(hoje.getFullYear(), 0, 1);
                    break;
            }
        }
    };

    var configuraFrequenciaPadrao = function () {
        if ($scope.escolhaFrequenciaValue == undefined) {
            var frequencia = $scope.ListaFrequencia.filter(function (obj) {
                return obj.idTipoFrequencia == 3;
            });
            $scope.escolhaFrequenciaValue = frequencia[0];
        }
    }

    function setLookupUnidades() {
        $scope.LookupUnidades = {
            displayExpr: 'NomeFantasia',
            dataSource: $scope.ListaUnidade,
            showPopupTitle: false,
            bindingOptions: { value: 'lookupUnidadesValue' },
            onOptionChanged: function (e) {
                var tipo = typeof e.value;

                if ((tipo == 'object' && e.value != null && "idUnidade" in e.value && typeof e.previousValue == 'object' && e.previousValue != null)) {
                    if (e.fullName == "selectedItem" && e.previousValue.idUnidade == e.value.idUnidade) {
                        obterParametros();
                        obterResultados();
                    }
                }
            }
        };
    }

    var obterParametros = function () {

        $scope.parametros = {
            tipoBusca: $scope.escolhaVisaoValue,
            Id: ($scope.escolhaVisaoValue == "Indicador") ? $scope.lookupIndicadoresValue.idKpi : $scope.lookupUnidadesValue.idUnidade,
            Data: $scope.currentValue,
            Frequencia: $scope.escolhaFrequenciaValue
        }
    };

    var obterParametrosTexto = function () {
        
        var argumento = '';
        if ($scope.escolhaVisaoValue == 'Indicador') {
            argumento = "Indicador: " + $scope.lookupIndicadoresValue.Nome;
        }
        else {
            argumento = "Unidade: " + $scope.lookupIndicadoresValue.NomeFantasia;
        }

        switch ($scope.escolhaFrequenciaValue) {
            case 1:
                argumento = argumento + " - Dia: ";
                argumento = argumento + $scope.currentValue.toDateString();
                break;
            case 2:
                break;
            case 3:
                argumento = argumento + " - Mês: ";
                argumento = argumento + ($scope.currentValue.getMonth() + 1) + "/" + ($scope.currentValue.getFullYear());
                break;
            case 4:
                argumento = argumento + " - Ano: ";
                argumento = argumento + $scope.currentValue.getFullYear();
                break;
        }

       $scope.argumento =  argumento;
    }

    function setEscolhaFrequencia() {
        $scope.escolhafrequencia = {
            dataSource: $scope.ListaFrequencia,
            displayExpr: 'Nome',
            layout: "horizontal",
            bindingOptions: { value: 'escolhaFrequenciaValue' },
            onOptionChanged: function (e) {
                               
                if (e.value != undefined) {
                    switch (e.value.idTipoFrequencia) {
                        case 1:
                            $('#dbArgumento').dxDateBox('instance').option('maxZoomLevel', 'month');
                            $('#dbArgumento').dxDateBox('instance').option('minZoomLevel', 'month');
                            $('#dbArgumento').dxDateBox('instance').option('displayFormat', 'shortDate');
                            break;
                        case 2:
                            break;
                        case 3:
                            $('#dbArgumento').dxDateBox('instance').option('maxZoomLevel', 'year');
                            $('#dbArgumento').dxDateBox('instance').option('minZoomLevel', 'year');
                            $('#dbArgumento').dxDateBox('instance').option('displayFormat', 'monthAndYear');
                            break;
                        case 4:
                            $('#dbArgumento').dxDateBox('instance').option('maxZoomLevel', 'decade');
                            $('#dbArgumento').dxDateBox('instance').option('minZoomLevel', 'decade');
                            $('#dbArgumento').dxDateBox('instance').option('displayFormat', 'year');
                            break;
                    }                
                }
            }
        };

    }

    $scope.btBuscar = {
        text: 'Buscar', type: 'normal', onClick: function (e) {
            obterParametros();
            obterResultados();
        }
    };

    $scope.btback = {
        text: ' <<  ', type: 'normal', onClick: function (e) {
            navegar('back');
        }
    };

    $scope.btforward = {
        text: '  >>  ', type: 'normal', onClick: function (e) {
            navegar('forward');

        }
    };

    var navegar = function (direcao) {
        var year = $scope.currentValue.getFullYear();
        var month = $scope.currentValue.getMonth();
        var day = $scope.currentValue.getDate();
        var i = 1;

        if (direcao == 'back') {
            i = -1;
        }
      
        switch ($scope.escolhaFrequenciaValue.idTipoFrequencia) {
            case 1:
                day = day + i;
                break;
            case 2:
                break;
            case 3:
                month = month + i;
                break;
            case 4:
                year = year + i;
                break;
        }

        $scope.currentValue = new Date(year, month, day);
        $scope.parametros.Data = $scope.currentValue;
        obterResultados();
    };
    
    $scope.dataGridOptionsValores = {
        dataSource: $scope.dadosgrid,
        noDataText: " ",
        paging: {
            pageSize: 20
        },
        rowAlternationEnabled: true,
        allowColumnReordering: true,
        showBorders: true,
        showRowLines: true,
        columnAutoWidth: true,
        editing: {
            mode: "batch",
            allowUpdating: true,
            allowDeleting: false,
            allowAdding: false,
        },
        columns: $scope.colunas,
        onEditingStart: function (e) {

        },
        onRowUpdating: function (e) {
            var data = {};
            $.extend(data, e.oldData, e.newData);
            $scope.alterados.push(data);
        },
        onRowUpdated: function (e) {

        },
        onContentReady: function (e) {

            if (e.component.hasEditData() == false && $scope.alterados.length > 0) {
                save();
                $scope.alterados = [];
            }
        },
    };
    
    var save = function () {

        var salvar = [];

        for (var i = 0; i < $scope.alterados.length; i++) {

            var kpivalor = {};
            kpivalor.unidade = $scope.alterados[i].unidade;

            for (var property in $scope.alterados[i]) {
                if ($scope.alterados[0].hasOwnProperty(property)) {

                    if (property != 'unidade') {
                        kpivalor.ano = property;
                        kpivalor.valor = $scope.alterados[i][property];

                        switch (kpivalor.ano.length) {
                            case 4:
                                kpivalor.ano = kpivalor.ano + '01-01T00:00:00';
                                break;
                            case 7:
                                kpivalor.ano = kpivalor.ano + '-01T00:00:00';
                                break;
                            case 10:
                                kpivalor.ano = kpivalor.ano + 'T00:00:00';
                                break;
                        }

                        var result = $scope.ListaResultado.filter(function (obj) {
                            return obj.NomeFantasia == kpivalor.unidade && obj.dtReferencia == kpivalor.ano;
                        });

                        result[0].Valor = kpivalor.valor;

                        salvar.push(result[0]);

                    }
                }
            }

        }

        salvarResultados(salvar);

    };

    var salvarResultados = function (resultados) {

        var request = {};
        request.ListaMeta = resultados;

        $http.post($scope.apiHost + "indicador/salvarlistameta", request)
        .then(
           function (response) {
               atualizarBase(response.data.ListaMeta)
               DevExpress.ui.notify("Metas salvas com sucesso", "success", $scope.messageDelay);
              
           },
           function (response) {

               DevExpress.ui.notify("Sistema com erro favor contactar suporte", "error", $scope.messageDelay);
           }
        );
    };

    var atualizarBase = function (baseAtualizada) {
        
        for (var i = 0; i < baseAtualizada.length; i++) {

            var indicador = $scope.ListaResultado.filter(function (obj) {
                return obj.idKpi == baseAtualizada[i].idKpi && obj.idUnidade == baseAtualizada[i].idUnidade && obj.dtReferencia == baseAtualizada[i].dtReferencia
            });

            indicador[0].idMeta = baseAtualizada[i].idMeta;
        }
    }

    init();
   
});