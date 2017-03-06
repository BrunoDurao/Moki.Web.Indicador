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
               DevExpress.ui.notify("Sistema com erro favor contactar suporte", "error", 200);
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

    var obterValores = function () {
        $scope.dados.push({ id: 1, unidade: 'Ipanema', ano: 2000, valor: 500.00 });
        $scope.dados.push({ id: 2, unidade: 'Ipanema', ano: 2001, valor: 600.00 });
        $scope.dados.push({ id: 3, unidade: 'Ipanema', ano: 2002, valor: 700.00 });
        $scope.dados.push({ id: 4, unidade: 'Ipanema', ano: 2003, valor: 800.00 });
        $scope.dados.push({ id: 5, unidade: 'Ipanema', ano: 2004, valor: 900.00 });
        $scope.dados.push({ id: 6, unidade: 'Barra', ano: 2000, valor: 550.00 });
        $scope.dados.push({ id: 7, unidade: 'Barra', ano: 2001, valor: 650.00 });
        $scope.dados.push({ id: 8, unidade: 'Barra', ano: 2002, valor: 750.00 });
        $scope.dados.push({ id: 9, unidade: 'Barra', ano: 2003, valor: 850.00 });
        $scope.dados.push({ id: 10, unidade: 'Barra', ano: 2004, valor: 950.00 });
        $scope.dados.push({ id: 11, unidade: 'Botafogo', ano: 2000, valor: 590.00 });
        $scope.dados.push({ id: 12, unidade: 'Botafogo', ano: 2001, valor: 690.00 });
        $scope.dados.push({ id: 13, unidade: 'Botafogo', ano: 2002, valor: 790.00 });
        $scope.dados.push({ id: 14, unidade: 'Botafogo', ano: 2003, valor: 890.00 });
        $scope.dados.push({ id: 15, unidade: 'Botafogo', ano: 2004, valor: 990.00 });
        $scope.dados.push({ id: 16, unidade: 'Bangu', ano: 2000, valor: 0 });
        $scope.dados.push({ id: 17, unidade: 'Bangu', ano: 2001, valor: 0 });
        $scope.dados.push({ id: 18, unidade: 'Bangu', ano: 2002, valor: 0 });
        $scope.dados.push({ id: 19, unidade: 'Bangu', ano: 2003, valor: 0 });
        $scope.dados.push({ id: 20, unidade: 'Bangu', ano: 2004, valor: 0 });
        $scope.dados.push({ id: 21, unidade: 'Santa Cruz', ano: 2000, valor: 560.00 });
        $scope.dados.push({ id: 22, unidade: 'Santa Cruz', ano: 2001, valor: 660.00 });
        $scope.dados.push({ id: 23, unidade: 'Santa Cruz', ano: 2002, valor: 760.00 });
        $scope.dados.push({ id: 24, unidade: 'Santa Cruz', ano: 2003, valor: 860.00 });
        $scope.dados.push({ id: 25, unidade: 'Santa Cruz', ano: 2004, valor: 960.00 });
        $scope.dados.push({ id: 26, unidade: 'Flamengo', ano: 2000, valor: 540.00 });
        $scope.dados.push({ id: 27, unidade: 'Flamengo', ano: 2001, valor: 640.00 });
        $scope.dados.push({ id: 28, unidade: 'Flamengo', ano: 2002, valor: 740.00 });
        $scope.dados.push({ id: 29, unidade: 'Flamengo', ano: 2003, valor: 840.00 });
        $scope.dados.push({ id: 30, unidade: 'Flamengo', ano: 2004, valor: 940.00 });
        $scope.dados.push({ id: 31, unidade: 'Centro', ano: 2000, valor: 530.00 });
        $scope.dados.push({ id: 32, unidade: 'Centro', ano: 2001, valor: 630.00 });
        $scope.dados.push({ id: 33, unidade: 'Centro', ano: 2002, valor: 730.00 });
        $scope.dados.push({ id: 34, unidade: 'Centro', ano: 2003, valor: 830.00 });
        $scope.dados.push({ id: 35, unidade: 'Centro', ano: 2004, valor: 930.00 });
        $scope.dados.push({ id: 36, unidade: 'Leblon', ano: 2000, valor: 510.00 });
        $scope.dados.push({ id: 37, unidade: 'Leblon', ano: 2001, valor: 610.00 });
        $scope.dados.push({ id: 38, unidade: 'Leblon', ano: 2002, valor: 710.00 });
        $scope.dados.push({ id: 39, unidade: 'Leblon', ano: 2003, valor: 810.00 });
        $scope.dados.push({ id: 40, unidade: 'Leblon', ano: 2004, valor: 910.00 });
        $scope.dados.push({ id: 41, unidade: 'Copacabana', ano: 2000, valor: 520.00 });
        $scope.dados.push({ id: 42, unidade: 'Copacabana', ano: 2001, valor: 620.00 });
        $scope.dados.push({ id: 43, unidade: 'Copacabana', ano: 2002, valor: 720.00 });
        $scope.dados.push({ id: 44, unidade: 'Copacabana', ano: 2003, valor: 820.00 });
        $scope.dados.push({ id: 45, unidade: 'Copacabana', ano: 2004, valor: 920.00 });
        $scope.dados.push({ id: 46, unidade: 'Recreio', ano: 2000, valor: 520.00 });
        $scope.dados.push({ id: 47, unidade: 'Recreio', ano: 2001, valor: 620.00 });
        $scope.dados.push({ id: 48, unidade: 'Recreio', ano: 2002, valor: 720.00 });
        $scope.dados.push({ id: 49, unidade: 'Recreio', ano: 2003, valor: 820.00 });
        $scope.dados.push({ id: 50, unidade: 'Recreio', ano: 2004, valor: 920.00 });
        $scope.dados.push({ id: 51, unidade: 'Campo Grande', ano: 2000, valor: 525.00 });
        $scope.dados.push({ id: 52, unidade: 'Campo Grande', ano: 2001, valor: 625.00 });
        $scope.dados.push({ id: 53, unidade: 'Campo Grande', ano: 2002, valor: 725.00 });
        $scope.dados.push({ id: 54, unidade: 'Campo Grande', ano: 2003, valor: 825.00 });
        $scope.dados.push({ id: 55, unidade: 'Campo Grande', ano: 2004, valor: 925.00 });
        $scope.dados.push({ id: 56, unidade: 'Tijuca', ano: 2000, valor: 1525.00 });
        $scope.dados.push({ id: 57, unidade: 'Tijuca', ano: 2001, valor: 1625.00 });
        $scope.dados.push({ id: 58, unidade: 'Tijuca', ano: 2002, valor: 1725.00 });
        $scope.dados.push({ id: 59, unidade: 'Tijuca', ano: 2003, valor: 1825.00 });
        $scope.dados.push({ id: 60, unidade: 'Tijuca', ano: 2004, valor: 1925.00 });



        transformar($scope.dados);
        var transformado = transformar($scope.dados);
        $scope.dadosgrid = transformado.slice(0, transformado.lenght);
    }

    var transformar = function (dados) {

        transformado = [];

        var i = 0;
        var x = 0;

        while (x < dados.length) {
            transformado[i] = {};
            transformado[i].unidade = dados[x].unidade;

            while (transformado[i].unidade == dados[x].unidade) {
                transformado[i][dados[x].ano] = dados[x].valor;
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
                        if (options.value !== 0) {
                            if ($scope.medida == 'R$') {
                                return 'R$ ' + options.valueText;
                            } else {
                                return options.valueText + ' ' + $scope.medida;
                            }
                        }
                    };

                    $scope.colunas.push(coluna);
                } else {
                    coluna.allowEditing = false;
                    $scope.colunas.unshift(coluna);
                }
            }
        }
    };

    //$scope.ListaUnidade = [{ idCliente: 1, NomeFantasia: 'Ipanema' },
    //                        { idCliente: 2, NomeFantasia: 'Barra' },
    //                        { idCliente: 3, NomeFantasia: 'Botafogo' },
    //                        { idCliente: 4, NomeFantasia: 'Bangu' },
    //                        { idCliente: 5, NomeFantasia: 'Santa Cruz' },
    //                        { idCliente: 6, NomeFantasia: 'Centro' },
    //                        { idCliente: 7, NomeFantasia: 'Leblon' },
    //                        { idCliente: 8, NomeFantasia: 'Copacabana' },
    //                        { idCliente: 9, NomeFantasia: 'Recreio' },
    //                        { idCliente: 10, NomeFantasia: 'Campo Grande' },
    //                        { idCliente: 11, NomeFantasia: 'Tijuca' }];

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
                $scope.escolhaFrequenciaValue = 1;
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

                    $scope.escolhaFrequenciaValue = e.value.idTipoFrequencia;
                    
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
        $scope.escolhaFrequenciaValue = 1;
        $scope.escolhafrequencia = {
            dataSource: $scope.ListaFrequencia,
            displayExpr: 'Nome',
            valueExpr: 'idTipoFrequencia',
            layout: "horizontal",
            onOptionChanged: function (e) {
                
                               
                switch(e.value) {
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
            },
            bindingOptions: { value: 'escolhaFrequenciaValue' }
        };

    }

    $scope.btBuscar = {
        text: 'Buscar', type: 'normal', onClick: function (e) {

            obterParametros();
            obterValores();
            montarColunas();
            buildDataGrid();
        }
    };

    $scope.btback = {
        text: ' <<  ', type: 'normal', onClick: function (e) {
            alert('back');
        }
    };

    $scope.btforward = {
        text: '  >>  ', type: 'normal', onClick: function (e) {
            alert('forward');

        }
    };


    function buildDataGrid() {

        $scope.dataGridOptionsValores = {
            dataSource: $scope.dadosgrid,
            noDataText: "dasdasdasdasd",
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


    }

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
                    }
                }
            }

            var result = $scope.dados.filter(function (obj) {
                return obj.unidade == kpivalor.unidade && obj.ano == kpivalor.ano;
            });

            kpivalor.id = result[0].id;

            salvar.push(kpivalor);
        }

        console.log(salvar)

    };

    init();
   
});