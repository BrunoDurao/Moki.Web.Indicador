MokiIndicadoresApp.controller('FiltrosController', function GraficosController($scope, $http, Filtro) {

    DevExpress.localization.locale('pt');
    $scope.lookupIndicadoresValue = -1;
    $scope.lookupUnidadesValue = -1;
    $scope.dataInicialValue = undefined;
    $scope.dataFinalValue = undefined;
    $scope.listaIndicadorFiltrada = [];

    $scope.Filtro = Filtro.getParametros();
    $scope.Controles = Filtro.getControles();

    var obterDadosIniciais = function () {
        var request = {};
        $http.post($scope.apiHost + "indicador/obterlancamentovalores", request)
        .then(
           function (response) {
               $scope.listaIndicador = response.data.Indicadores;
               $scope.listaFrequencia = response.data.ListaFrequencia;
               $scope.listaUnidade = response.data.ListaUnidade;
               configuraFrequenciaPadrao();
               filtraListaIndicadores();
               configurarControles();
               configuraDatapadrao();
           },
           function (response) {
               DevExpress.ui.notify("Sistema com erro favor contactar suporte", "error", $scope.messageDelay);
           }
        );
    };

    var init = function () {
        obterDadosIniciais();
    };
    
    function configurarControles() {

        $scope.dbDataInicialConfig = {
            maxZoomLevel: 'decade',
            minZoomLevel: 'decade',
            bindingOptions: { value: 'Filtro.DataInicial' }
        };

        $scope.dbDataFinalConfig = {
            maxZoomLevel: 'decade',
            minZoomLevel: 'decade',
            bindingOptions: { value: 'Filtro.DataFinal' }
        };
        
        $scope.listaIndicadorConfig = { 
            dataSource: $scope.listaIndicadorFiltrada,
            displayExpr: 'Nome',
            searchEnabled: true,
            bindingOptions: { value: 'Filtro.Indicador' },
            onValueChanged: function (e) {
                var maxItems = $scope.Controles.ListaIndicadorMaxItems;
                if (e.value.length > maxItems) {
                    var allPrevValues = e.previousValue;
                    allPrevValues[maxItems - 1] = e.value[maxItems];
                    e.component.option('values', allPrevValues);
                }
            }
        };
              
        $scope.listaUnidadeConfig = {
            dataSource: $scope.listaUnidade,
            displayExpr: 'NomeFantasia',
            searchEnabled: true,
            bindingOptions: { value: 'Filtro.Unidade' },
            onValueChanged: function (e) {
                var maxItems = $scope.Controles.ListaUnidadeMaxItems;
                if (e.value.length > maxItems) {
                    var allPrevValues = e.previousValue;
                    allPrevValues[maxItems - 1] = e.value[maxItems];
                    e.component.option('values', allPrevValues);
                }
            }
        };
        
        $scope.escolhafrequencia = {
            dataSource: $scope.listaFrequencia,
            displayExpr: 'Nome',
            layout: "horizontal",
            bindingOptions: { value: 'Filtro.Frequencia' },
            onOptionChanged: function (e) {

                if (e.value != undefined) {

                    filtraListaIndicadores();
                    $('#listaIndicadores').dxTagBox('instance').option("dataSource", $scope.listaIndicadorFiltrada);


                    switch (e.value.idTipoFrequencia) {
                        case 1:
                            $('#dbDataInicial').dxDateBox('instance').option('maxZoomLevel', 'month');
                            $('#dbDataInicial').dxDateBox('instance').option('minZoomLevel', 'month');
                            $('#dbDataInicial').dxDateBox('instance').option('displayFormat', 'shortDate');

                            $('#dbDataFinal').dxDateBox('instance').option('maxZoomLevel', 'month');
                            $('#dbDataFinal').dxDateBox('instance').option('minZoomLevel', 'month');
                            $('#dbDataFinal').dxDateBox('instance').option('displayFormat', 'shortDate');

                            break;
                        case 2:
                            break;
                        case 3:
                            $('#dbDataInicial').dxDateBox('instance').option('maxZoomLevel', 'year');
                            $('#dbDataInicial').dxDateBox('instance').option('minZoomLevel', 'year');
                            $('#dbDataInicial').dxDateBox('instance').option('displayFormat', 'monthAndYear');

                            $('#dbDataFinal').dxDateBox('instance').option('maxZoomLevel', 'year');
                            $('#dbDataFinal').dxDateBox('instance').option('minZoomLevel', 'year');
                            $('#dbDataFinal').dxDateBox('instance').option('displayFormat', 'monthAndYear');
                            break;
                        case 4:
                            $('#dbDataInicial').dxDateBox('instance').option('maxZoomLevel', 'decade');
                            $('#dbDataInicial').dxDateBox('instance').option('minZoomLevel', 'decade');
                            $('#dbDataInicial').dxDateBox('instance').option('displayFormat', 'year');

                            $('#dbDataFinal').dxDateBox('instance').option('maxZoomLevel', 'decade');
                            $('#dbDataFinal').dxDateBox('instance').option('minZoomLevel', 'decade');
                            $('#dbDataFinal').dxDateBox('instance').option('displayFormat', 'year');
                            break;
                    }
                }
            }
        };  

        //$scope.btBuscar = {
        //    text: 'Buscar', type: 'normal', onClick: function (e) {
        //        console.log($scope.Filtro.Unidade);
        //    }
        //};
    }

    var configuraDatapadrao = function () {
        var hoje = new Date();

        if ($scope.Filtro.DataInicial == undefined) {
            switch ($scope.Filtro.Frequencia.idTipoFrequencia) {
                case 1:
                    $scope.Filtro.DataInicial = hoje;
                    $scope.Filtro.DataFinal = hoje;
                    break;
                case 2:
                    break;
                case 3:
                    $scope.Filtro.DataInicial = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
                    $scope.Filtro.DataFinal = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
                    break;
                case 4:
                    $scope.Filtro.DataInicial = new Date(hoje.getFullYear(), 0, 1);
                    $scope.Filtro.DataFinal = new Date(hoje.getFullYear(), 0, 1);
                    break;
            }
        }
    };

    var configuraFrequenciaPadrao = function () {
        //if ($scope.Filtro.Frequencia == undefined) {
        var frequencia = $scope.listaFrequencia.filter(function (obj) {
            return obj.idTipoFrequencia == 3;
        });
        $scope.Filtro.Frequencia = frequencia[0];
        //}
    }

    var filtraListaIndicadores = function () {
       
        $scope.listaIndicadorFiltrada = [];

        for (var i = 0; i < $scope.listaIndicador.length; i++) {

            if ($scope.listaIndicador[i].kpiTiposFrequencias.idTipoFrequencia == $scope.Filtro.Frequencia.idTipoFrequencia) {
                $scope.listaIndicadorFiltrada.push($scope.listaIndicador[i]);
            }
        }

        for (var i = 0; i < $scope.Filtro.Indicador.length; i++) {

            if ($scope.Filtro.Indicador[i].kpiTiposFrequencias.idTipoFrequencia != $scope.Filtro.Frequencia.idTipoFrequencia) {
                $scope.Filtro.Indicador.splice(i, 1);
            }
        }

    };


    init();

});