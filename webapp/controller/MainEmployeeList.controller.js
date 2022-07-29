// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",    

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.core.routing.History} History
     * @param {typeof sap.ui.core.UIComponent} UIComponent
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.m.MessageToast} MessageToast
     * @param {typeof sap.m.MessageBox} MessageBox}
     * @param {typeof sap.ui.model.Filter} Filter}
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator}
     */
    function (Controller, History, UIComponent, JSONModel, MessageToast, MessageBox,Filter,FilterOperator) {
        return Controller.extend("logaligroup.logalifinal2.controller.MainEmployeeList", {

            onBeforeRendering: function () {
                this._detailEmployeeView = this.getView().byId("detailEmployeeView");
            },
            onInit: function () {
                
                this._bus = sap.ui.getCore().getEventBus();
                this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);

            },


            onNavBack: function () {
                const oHistory = History.getInstance();
                const sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);

                } else {
                    const oRouter = UIComponent.getRouterFor(this);
                    //Redirecciona a la página principal de la App
                    oRouter.navTo("RouteApp", {}, true);//Este es el name configurado en el manifest.json en la sección "routes" 
                };

            },

            showEmployeeDetails: function(category,nameEvent,path){
                
                let detailView = this.getView().byId("detailEmployeeView");
                detailView.bindElement("employeeModel>" + path);

                //var salaryModel = new sap.ui.model.json.JSONModel([]);
                //detailView.setModel(salaryModel, "salaryModel");

                //Leer los datos del salario
                //let EmployeeId = this._detailEmployeeView.getBindingContext("employeeModel").getObject().EmployeeId;
               // this._readEmployeeSalary(EmployeeId);
            }

    });

});