MokiIndicadoresApp.controller('DashboardController', function DashboardController($scope, $http, Filtro) {

    DevExpress.localization.locale('pt');
    $scope.ListaResultado = [];
    $scope.Resultado = [];
    $scope.titulo = "";
    $scope.subtitulo = "";
    $scope.painelDisplay = "none";

    Filtro.setControles({
        ListaIndicador: false,
        ListaUnidade: false,
        RbFrequencia: true,
        DatePickerInicial: true,
        DatePickerFinal: true,
        ListaIndicadorMaxItems: 4,
        ListaUnidadeMaxItems: 1,
    });

    Filtro.setParametros({
        Indicador: [],
        Unidade: [],
        Frequencia: {},
        DataInicial: new Date(),
        DataFinal: new Date(),
    });

    $scope.btBuscar = {
        text: 'Buscar', type: 'normal', onClick: function (e) {
            $scope.Filtro = Filtro.getParametros();
            obterDadosGrafico();
        }
    };

    var obterDadosGrafico = function () {

        var request = {};

        request.ListaIdUnidade = [];
        $scope.Filtro.Unidade.forEach(function (unidade) {
            request.ListaIdUnidade.push(unidade.idUnidade);
        });

        request.ListaIdIndicador = [];
        $scope.Filtro.Indicador.forEach(function (indicador) {
            request.ListaIdIndicador.push(indicador.idKpi);
        });
        
        request.DataFim = new Date();
        request.DataInicio = new Date();
        request.DataInicio.setMonth(new Date().getMonth() - 6);

        $http.post($scope.apiHost + "indicador/obterresultadosindicadoresunidades", request)
         .then(
            function (response) {

                $scope.titulo = $scope.Filtro.Unidade[0].NomeFantasia;
                $scope.subtitulo = "(\u00DAltimos 6 meses)";

                listaResultado = response.data.ListaResultado;
                var listaTransformada = [];

                for (var i = 0; i < listaResultado.length; i++) {

                    var resultado = BuscaResultado(listaResultado[i].dtReferencia, listaTransformada);
                    resultado = inserirPropriedades(resultado, listaResultado[i]);
                    listaTransformada.push(resultado);
                }

                $scope.ListaResultado = listaTransformada;

                $scope.painelDisplay = "block";

                var series = [];
                $scope.Filtro.Indicador.forEach(function (indicador) {
                    series.push({
                        valueField: "Valor" + indicador.idKpi,
                        name: indicador.Nome,
                    });
                });

                $('#chart1').dxChart('instance').option("dataSource", $scope.ListaResultado);
                $('#chart1').dxChart('instance').option("series", series);

                $('#chart2').dxChart('instance').option("dataSource", $scope.ListaResultado);
                $('#chart2').dxChart('instance').option("series", series);

                $('#chart3').dxPieChart('instance').option("dataSource", $scope.ListaResultado);
                $('#chart3').dxPieChart('instance').option("series", series);

                $('#chart4').dxPolarChart('instance').option("dataSource", $scope.ListaResultado);
                $('#chart4').dxPolarChart('instance').option("series", series);

                $('#chart5').dxChart('instance').option("dataSource", $scope.ListaResultado);
                $('#chart5').dxChart('instance').option("series", series);

                $('#chart6').dxBarGauge('instance').option("dataSource", $scope.ListaResultado);
                $('#chart6').dxBarGauge('instance').option("series", series);

            },
            function (response) {
                DevExpress.ui.notify("Sistema com erro favor contactar suporte", "error", $scope.messageDelay);
            });
    }

    var BuscaResultado = function (referencia, listaTransformada) {

        var mesano = referencia.split("-")[1] + '-' + referencia.split("-")[0];

        var arrayBusca = listaTransformada.filter(function (obj) {
            return obj.dtReferencia == mesano;
        });

        if (arrayBusca.length == 1) {
            return arrayBusca[0];
        }
        else {
            return {
                dtReferencia: mesano
            };
        }
    }

    var inserirPropriedades = function (resultado, origem) {
        resultado["Valor" + origem.idKpi] = origem.Valor;
        resultado["Nome" + origem.idKpi] = origem.IndicadorNome;
        return resultado;
    }

    var formataData = function () {
        $scope.Resultado = [];
        for (var i = 0; i < $scope.ListaResultado.length; i++) {
            var dataAux = $scope.ListaResultado[i].Data;
            $scope.ListaResultado[i].Data = dataAux.substr(5, 2) + '-' + dataAux.substr(0, 4);
            $scope.ListaResultado[i].Percentual = 100 * $scope.ListaResultado[i].ValorResultado / $scope.ListaResultado[i].ValorMeta;
            $scope.Resultado.push($scope.ListaResultado[i].Percentual);
        }
    }
      
    var types = ["line", "stackedLine", "fullStackedLine"];

    var tooltip = {
        enabled: true,
        customizeTooltip: function (arg) {
            console.log(arg);
            return {
                text: arg.seriesName + "  -  Valor: " + arg.valueText
            };
        }
    };

    $scope.currentType = types[0];

    $scope.chartOptions1 = {
        ValueAxis : [      {
            min:30,
        }
        ],
        palette: $scope.palhetaDefault,
        dataSource: $scope.ListaResultado,
        commonSeriesSettings: {
            argumentField: "dtReferencia",
            type: "line"
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
        tooltip: tooltip
    };

    $scope.chartOptions2 = {
        palette: $scope.palhetaDefault,
        dataSource: $scope.ListaResultado,
        commonSeriesSettings: {
            argumentField: "dtReferencia",
            type: "bar"
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
        tooltip: tooltip
    };

    $scope.chartOptions3 = {
        palette: $scope.palhetaDefault,
        dataSource: $scope.ListaResultado,
        commonSeriesSettings: {
            argumentField: "dtReferencia"
        },
       tooltip : tooltip,
        title: "",
        "export": {
            enabled: true
        },
    };

    $scope.chartOptions4 = 
        {
            palette: $scope.palhetaDefault,
            dataSource: $scope.ListaResultado,
            commonSeriesSettings: {
                argumentField: "dtReferencia",
                type: "scatter"
            },
            "export": {
                enabled: true
            },
            tooltip: tooltip,
        };


    $scope.chartOptions5 = {
        palette: $scope.palhetaDefault,
        dataSource: $scope.ListaResultado,
        commonSeriesSettings: {
            argumentField: "dtReferencia",
            type: "area"
        },
        argumentAxis: {
            valueMarginsEnabled: false,
            discreteAxisDivisionMode: "crossLabels",
            grid: {
                visible: true
            },
        },
         legend: {
            verticalAlignment: "bottom",
            horizontalAlignment: "center",
            itemTextPosition: "bottom"
        },
        "export": {
            enabled: true
        },
        tooltip: tooltip,
    };

    $scope.chartOptions6 = {
        palette: $scope.palhetaDefault,
        startValue: 0,
        endValue: 100,
        values: $scope.Resultado,
        label: {
            //indent: 100,
            format: {
                type: "fixedPoint",
                precision: 1
            },
            customizeText: function (arg) {
                return arg.valueText + " %";
            }
        },
        "export": {
            enabled: true
        },
        tooltip: tooltip,
    };
   
});