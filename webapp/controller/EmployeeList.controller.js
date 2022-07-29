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
        return Controller.extend("logaligroup.logalifinal2.controller.EmployeeList", {

            onBeforeRendering: function () {
                //this._employeeListView = this.getView().byId("EmpList");
               
            },

            onInit: function () {
                //this.readEmployeeData();
                this._bus = sap.ui.getCore().getEventBus();

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

            onSearch: function (oEvent) {
                
                // add filter for search
                let radButGroup = this.getView().byId("GroupE");
                let name = radButGroup.getSelectedButton().getText();
                let oRB = this.getView().getModel("i18n").getResourceBundle();

                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {

                    //filter = new Filter("LastName", FilterOperator.Contains, sQuery);
                   // aFilters.push(filter);
                   switch (name) {
                   //switch ("1") {    
                        case oRB.getText("searchCriteriaName"):
                             aFilters.push(new Filter("FirstName", FilterOperator.Contains, sQuery)); 
                            break;                           
                        case oRB.getText("searchCriteriaLastName"):
                            aFilters.push(new Filter("LastName", FilterOperator.Contains, sQuery)); 
                            break;
                        case oRB.getText("searchCriteriaDNI"):   
                            aFilters.push(new Filter("Dni", FilterOperator.Contains, sQuery)); 
                            break;
                       default:
                           break;
                   }               
                }

                    //filter = new Filter("LastName", FilterOperator.Contains, sQuery);
                    //aFilters.push(filter);
                sQuery = this.getOwnerComponent().SapId,
                //this.getOwnerComponent().SapId,
                filter = new Filter("SapId", FilterOperator.EQ , sQuery);
                aFilters.push(filter);

                // update list binding
                var oList = this.byId("EmployeeList");
                var oBinding = oList.getBinding("items");
                //oBinding.filter(aFilters, "Application");
                oBinding.filter(aFilters);
            },

            showEmployee: function(oEvent){

                //Forma más corta de obtener el path
                let path =  oEvent.getSource().getSelectedContextPaths()[0];
                this._bus.publish("flexible", "showEmployee", path);

                 var standarlist = this.getView().byId("EmployeeList");
                 var selected = standarlist.getSelectedItem();  
                 let Object = selected.getBindingContext("employeeModel").getObject();
                 this._bus.publish("flexible", "showEmployeeObject", Object );
                
               //Esto funciona también para obtener el path
               // var standarlist = this.getView().byId("EmployeeList");
               // var selected = standarlist.getSelectedItem();  
              //  let path = selected.getBindingContext("employeeModel").getPath(); //Funciona para obtener el path
               // this._bus.publish("flexible", "showEmployee", path);
                     

            },

            onSelectionChange3: function(oEvent){
                
                // var oList = oEvent.getSource();
                // var selecteditems = oList.getSelectedItems();
                //  var standarlist = this.getView().byId("EmployeeList");
                var standarlist = this.getView().byId("EmployeeList");
                  var selecteditems = standarlist.getSelectedItems();
                  var selected = standarlist.getSelectedItem();
 
                 if(selecteditems.length > 0){
                     for(var i in selecteditems){
 
                         var context = selecteditems[i].getBindingContext("employeeModel");
                         var oContext = context.getObject();
                         sap.m.MessageToast.show(oContext.Dni);
 
                     }
                 }
             },

            onSelectionChange: function (oEvent) {
                var oList = oEvent.getSource();
                var oLabel = this.byId("idFilterLabel");
                var oInfoToolbar = this.byId("idInfoToolbar");

                // With the 'getSelectedContexts' function you can access the context paths
                // of all list items that have been selected, regardless of any current
                // filter on the aggregation binding.
                var aContexts = oList.getSelectedContexts(true);

                // update UI
                var bSelected = (aContexts && aContexts.length > 0);
                var sText = (bSelected) ? aContexts.length + " selected" : null;
                oInfoToolbar.setVisible(bSelected);
                oLabel.setText(sText);
            },

            readEmployeeData: function () {

                var employeeModel2 = this.getView().getModel("employeeModel");

                this.getView().getModel("employeeModel").read("/Users", {
                    filters: [
                        new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                        // new sap.ui.model.Filter("EmployeeId", "EQ", employeeID.toString())
                    ],
                    success: function (data) {
                        var employeeModel = this.getView().getModel("employeeModel");
                        employeeModel.setData(data.results);
                        //this._employeeListView.getModel("employeeModel").setData(data.results); 

                    }.bind(this),
                    error: function (e) {
                        //
                    }

                });
            }
        });
    });