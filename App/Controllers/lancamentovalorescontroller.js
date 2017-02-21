MokiIndicadoresApp.controller('LancamentoValoresController', function LancamentoValoresController($scope, $http) {

    var obterDadosIniciais = function () {
        $scope.dados.push({id: 1, unidade: 'Ipanema', ano: 2000, valor: 500.00 });
        $scope.dados.push({id: 2, unidade: 'Ipanema', ano: 2001, valor: 600.00 });
        $scope.dados.push({id: 3, unidade: 'Ipanema', ano: 2002, valor: 700.00 });
        $scope.dados.push({id: 4, unidade: 'Ipanema', ano: 2003, valor: 800.00 });
        $scope.dados.push({id: 5, unidade: 'Ipanema', ano: 2004, valor: 900.00 });
        $scope.dados.push({id: 6, unidade: 'Barra', ano: 2000, valor: 550.00 });
        $scope.dados.push({id: 7, unidade: 'Barra', ano: 2001, valor: 650.00 });
        $scope.dados.push({id: 8, unidade: 'Barra', ano: 2002, valor: 750.00 });
        $scope.dados.push({id: 9, unidade: 'Barra', ano: 2003, valor: 850.00 });
        $scope.dados.push({id: 10, unidade: 'Barra', ano: 2004, valor: 950.00 });
        $scope.dados.push({ id: 11, unidade: 'Botafogo', ano: 2000, valor: 590.00 });
        $scope.dados.push({ id: 12, unidade: 'Botafogo', ano: 2001, valor: 690.00 });
        $scope.dados.push({ id: 13, unidade: 'Botafogo', ano: 2002, valor: 790.00 });
        $scope.dados.push({ id: 14, unidade: 'Botafogo', ano: 2003, valor: 890.00 });
        $scope.dados.push({ id: 15, unidade: 'Botafogo', ano: 2004, valor: 990.00 });
        $scope.dados.push({ id: 16, unidade: 'Bangu', ano: 2000, valor: 580.00 });
        $scope.dados.push({ id: 17, unidade: 'Bangu', ano: 2001, valor: 680.00 });
        $scope.dados.push({ id: 18, unidade: 'Bangu', ano: 2002, valor: 780.00 });
        $scope.dados.push({ id: 19, unidade: 'Bangu', ano: 2003, valor: 880.00 });
        $scope.dados.push({ id: 20, unidade: 'Bangu', ano: 2004, valor: 980.00 });
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

    var montarColunas =  function () {
    
        $scope.colunas = [];

        for (var property in $scope.dadosgrid[0]) {
            if ($scope.dadosgrid[0].hasOwnProperty(property)) {
                var coluna = {};    
                coluna.dataField = property;
                if (property != 'unidade') {
                    coluna.format = 'currency';
                    $scope.colunas.push(coluna);
                } else {
                    coluna.allowEditing = false;
                    $scope.colunas.unshift(coluna);
                }
            }
        }
    };

    var init = function () {
        $scope.dados = [];
        $scope.alterados = [];
        obterDadosIniciais();
        montarColunas();
        buildDataGrid()
    };
      
    function buildDataGrid() {

        $scope.dataGridOptionsValores = {
            dataSource: $scope.dadosgrid,
            paging: {
                enabled: true,
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
            columns:  $scope.colunas,
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
            }
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