sap.ui.define([
    "sap/ui/core/mvc/Controller",
],
    function (Controller) {
        return Controller.extend("logaligroup.logalifinal2.controller.App", {

            onInit: function () {

            },

            navigateToCreateEmployee: function(oEvent){
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("CreateEmployee");//Este es el name configurado en el manifest.json en la sección "routes" 
            },

            navigateToEmployeeList: function(oEvent){
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("MainEmployeeList");//Este es el name configurado en el manifest.json en la sección "routes" 
            },
            navigateToSignOrder: function(oEvent){
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("SignOrder");//Este es el name configurado en el manifest.json en la sección "routes" 
            }
    });
});