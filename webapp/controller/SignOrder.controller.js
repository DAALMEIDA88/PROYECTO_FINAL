sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    'sap/m/library'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.core.routing.History} History
     * @param {typeof sap.ui.core.UIComponent} UIComponent
     * @param {typeof sap.m.library} Library
     */
    function (Controller,History,UIComponent,Library) {
        return Controller.extend("logaligroup.logalifinal2.controller.SignOrder", {

            onInit: function () {

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

            }
    });
});