MokiIndicadoresApp.controller('IndicadorTipoUnidadeController', function IndicadorTipoUnidadeController($scope, $http) {

    $scope.selectedItemKeys = [];
    $scope.selectionMode = "all";
    $scope.selectAllMode = "page";

    $scope.listOptions = {
        dataSource: new DevExpress.data.DataSource({
            store: new DevExpress.data.ArrayStore({
                key: "id",
                data: tasks
            })
        }),
        //height: 400,
        showSelectionControls: true,
        bindingOptions: {
            selectedItemKeys: "selectedItemKeys",
            selectionMode: "selectionMode",
            selectAllMode: "selectAllMode",
        }
    };

    $scope.selectAllModeOptions = {
        items: ["page", "allPages"],
        bindingOptions: {
            disabled: "selectionMode !== 'all'",
            value: "selectAllMode"
        }
    };

    $scope.listOptions1 = {
        dataSource: employees,
        height: "100%",
        grouped: true,
        collapsibleGroups: true,
        groupTemplate: function (data) {
            return $("<div>Assigned: " + data.key + "</div>");

        }
    };
        
});