MokiIndicadoresApp.controller('GraficosController', function GraficosController($scope, $http, Filtro) {

    DevExpress.localization.locale('pt');
    $scope.ListaResultado = [];

    Filtro.setControles({
        ListaIndicador: false,
        ListaUnidade: false,
        RbFrequencia: true,
        DatePickerInicial: true,
        DatePickerFinal: true,
        });

    $scope.btBuscar = {
        text: 'Buscar', type: 'normal', onClick: function (e) {
            $scope.Filtro = Filtro.getParametros();
            obterDadosGrafico();
        }
    };

    var obterDadosGrafico = function () {

        var request = {};
        request.Unidade = $scope.Filtro.Unidade[0];;
        request.Indicador = $scope.Filtro.Indicador[0];
        request.Data = new Date();
        request.Quantidade = 6;

        $http.post($scope.apiHost + "indicador/obterresultadosindicadorunidade", request)
        .then(
           function (response) {
               $scope.ListaResultado = response.data.ListaResultado;
               formataData();
               $('#chart').dxChart('instance').option("dataSource", $scope.ListaResultado);
               $('#chart').dxChart('instance').option("title", {
                   text: $scope.Filtro.Unidade[0].NomeFantasia + ' - ' + $scope.Filtro.Indicador[0].Nome,
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
   
});