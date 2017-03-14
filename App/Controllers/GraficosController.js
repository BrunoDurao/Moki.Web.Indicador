MokiIndicadoresApp.controller('GraficosController', function GraficosController($scope, $http) {

    DevExpress.localization.locale('pt');
    $scope.lookupIndicadoresValue = -1;
    $scope.lookupUnidadesValue = -1;


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
               $('#lkUnidades').dxLookup('instance').option("dataSource", $scope.ListaUnidade);
               configuraListaIndicadores();
           },
           function (response) {
               DevExpress.ui.notify("Sistema com erro favor contactar suporte", "error", $scope.messageDelay);
           }
        );
    };

    var obterDadosGrafico = function () {

        var request = {};

        request.Unidade = $scope.lookupUnidadesValue;
        request.Indicador = $scope.lookupIndicadoresValue;
        request.Data = new Date();
        request.Quantidade = 6;

        $http.post($scope.apiHost + "indicador/obterresultadosindicadorunidade", request)
        .then(
           function (response) {
               $scope.ListaResultado = response.data.ListaResultado;
               formataData();
               $('#chart').dxChart('instance').option("dataSource", $scope.ListaResultado);
               $('#chart').dxChart('instance').option("title", {
                   text:  $scope.lookupUnidadesValue.NomeFantasia + ' - ' + $scope.lookupIndicadoresValue.Nome,
                   subtitle: {
                       text: "(\u00DAltimos 6 meses)"
                   }
               });
           },
           function (response) {
               DevExpress.ui.notify("Sistema com erro favor contactar suporte", "error", $scope.messageDelay);
           }
        );
    };

    var formataData = function () {
        for (var i = 0; i < $scope.ListaResultado.length; i++) {
            var dataAux = $scope.ListaResultado[i].Data;
            $scope.ListaResultado[i].Data = dataAux.substr(5, 2) + '-' + dataAux.substr(0, 4);
        }
    }
   
    function configuraListaIndicadores() {
        $scope.LookupIndicadores = {
            displayExpr: 'Nome',
            dataSource: new DevExpress.data.DataSource({
                store: $scope.ListaIndicador,
                group: "kpiCategorias.Nome"
            }),
            showPopupTitle: false,
            grouped: true,
            bindingOptions: { value: 'lookupIndicadoresValue' },
        };
    }
    
    $scope.LookupUnidades = {
        displayExpr: 'NomeFantasia',
        dataSource: $scope.ListaUnidade,
        showPopupTitle: false,
        bindingOptions: { value: 'lookupUnidadesValue' },
    };

    $scope.btBuscar = {
        text: 'Buscar', type: 'normal', onClick: function (e) {
            obterDadosGrafico();
          }
    };


    var types = ["line", "stackedLine", "fullStackedLine"];

    $scope.currentType = types[0];

    $scope.chartOptions = {
        palette: "blue",
        dataSource: $scope.ListaResultado,
        commonSeriesSettings: {
            argumentField: "Data",
        },
        bindingOptions: {
            "commonSeriesSettings.type": "currentType"
        },
        margin: {
            bottom: 20
        },
        argumentAxis: {
            valueMarginsEnabled: false,
            discreteAxisDivisionMode: "crossLabels",
            grid: {
                visible: true
            },
        },
        series: [
            { valueField: "ValorResultado", name: "Resultado" },
            { valueField: "ValorMeta", name: "Meta" },
        ],
        legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            itemTextPosition: "bottom"
        },
        title: {
            text: "",
            subtitle: {
                text: "(\u00DAltimos 6 meses)"
            }
        },
        "export": {
            enabled: true
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function (arg) {
                return {
                    text: arg.valueText
                };
            }
        }
    };

    $scope.typesOptions = {
        dataSource: types,
        bindingOptions: {
            value: "currentType"
        }
    };

    var init = function () {
        obterDadosIniciais();
    };

    init();

});