MokiIndicadoresApp.controller('ImportarController', function ImportarController($scope, $http) {

    DevExpress.localization.locale('pt');
 
    $scope.colunas = [
        { Idx: 0, Nome: 'Coluna A' },
        { Idx: 1, Nome: 'Coluna B' },
        { Idx: 2, Nome: 'Coluna C' },
        { Idx: 3, Nome: 'Coluna D' },
        { Idx: 4, Nome: 'Coluna E' },
    ];

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
               //$('#lkUnidades').dxLookup('instance').option("dataSource", $scope.ListaUnidade);
               carregaLista();
               carregaListaColunas();
               //configuraListaIndicadores();
           },
           function (response) {
               DevExpress.ui.notify("Sistema com erro favor contactar suporte", "error", $scope.messageDelay);
           }
        );
    };
  
    function carregaLista() {

        var dataSource = new DevExpress.data.DataSource({
            store: $scope.ListaIndicador,
            searchOperation: "contains",
            searchExpr: "Nome"
        });

        $scope.listOptions = {
            dataSource: dataSource,
            height: "95%",
            itemTemplate: function (data) {
                return $("<div>").text(data.Nome);
            }
        };

        $scope.searchOptions = {
            valueChangeEvent: "keyup",
            placeholder: "Search",
            mode: "search",
            onValueChanged: function (args) {
                dataSource.searchValue(args.value);
                dataSource.load();
            }
        };
    }

    function carregaListaColunas() {

        var dataSource = new DevExpress.data.DataSource({
            store: $scope.colunas,
            searchOperation: "contains",
            searchExpr: "Nome",
            selectionMode: "single",
        });

        $scope.listColunaOptions = {
            dataSource: dataSource,
            height: "95%",
            itemTemplate: function (data) {
                return $("<div>").text(data.Nome);
            }
        };

    }

    var init = function () {
        obterDadosIniciais();
    };

    init();

});