MokiIndicadoresApp.controller('LancamentoValoresController', function LancamentoValoresController($scope, $http) {

    DevExpress.localization.locale('pt');

    $scope.lookupIndicadoresValue = -1;
    $scope.lookupUnidadesValue = -1;
    $scope.escolhaVisaoValue = 'Indicador';
    $scope.currentValue = undefined;
    $scope.medida = '';
    $scope.dados = [];
    $scope.alterados = [];
    $scope.Listaindicador = [];

    var obterDadosIniciais = function () {
        var request = {};
        request.verbetes = {}; //ObterListaVerbetes();
        $http.post($scope.apiHost + "indicador/obterlancamentovalores", request)
        .then(
           function (response) {
               $scope.Listaindicador = response.data.Indicadores;
               $scope.ListaFrequencia = response.data.ListaFrequencia;
               $scope.ListaUnidade = response.data.ListaUnidade;
               //$scope.Dicionario = getDicionario(response.data.Dicionario);
               setLookupIndicadores();
               setLookupUnidades();
               setEscolhaFrequencia();
           },
           function (response) {
               DevExpress.ui.notify("Sistema com erro favor contactar suporte", "error",  $scope.messageDelay);
           }
        );
    };

    var obterResultados = function () {

          var request = $scope.parametros;

        $http.post($scope.apiHost + "indicador/obterlistaresultado", request)
        .then(
           function (response) {

               $scope.ListaResultado = response.data.ListaResultado;
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
                        coluna.caption = 'Indicador';
                    $scope.colunas.unshift(coluna);
                }
            }
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
                $scope.escolhaFrequenciaValue = {idFrequencia: 1, Nome: 'Mensal'};
            }
        },
    };

    function setLookupIndicadores() {
        $scope.LookupIndicadores = {
            displayExpr: 'Nome',
            dataSource: new DevExpress.data.DataSource({
                store: $scope.Listaindicador,
                group: "kpiCategorias.Nome"
            }),
            showPopupTitle: false,
            grouped: true,
            bindingOptions: { value: 'lookupIndicadoresValue' },
            onOptionChanged: function (e) {

                var tipo = typeof e.value;

                if (tipo == 'object' && e.value != null) {

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
                }
            }
        };
    }

    function setLookupUnidades() {
        $scope.LookupUnidades = {
            displayExpr: 'NomeFantasia',
            dataSource: $scope.ListaUnidade,
            showPopupTitle: false,
            bindingOptions: { value: 'lookupUnidadesValue' },
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
                argumento = argumento + " - M�s: ";
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
        $scope.escolhaFrequenciaValue = 1;
        $scope.escolhafrequencia = {
            dataSource: $scope.ListaFrequencia,
            displayExpr: 'Nome',
            //valueExpr: 'idTipoFrequencia',
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
            enabled: false,
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
                console.log("alterar");
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
                                kpivalor.ano = kpivalor.ano + '01-01T00:00:00Z';
                                break;
                            case 7:
                                kpivalor.ano = kpivalor.ano + '-01T00:00:00Z';
                                break;
                            case 10:
                                kpivalor.ano = kpivalor.ano + 'T00:00:00Z';
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

        console.log(salvar);
        salvarResultados(salvar);

    };

    var salvarResultados = function (resultados) {

        var request = {};
        request.ListaResultado = resultados;

        $http.post($scope.apiHost + "indicador/salvarlistaresultado", request)
        .then(
           function (response) {

               DevExpress.ui.notify("Resultados salvos com sucesso", "success", $scope.messageDelay);
              
           },
           function (response) {

               DevExpress.ui.notify("Sistema com erro favor contactar suporte", "error", $scope.messageDelay);
           }
        );
    };

    init();
   
});