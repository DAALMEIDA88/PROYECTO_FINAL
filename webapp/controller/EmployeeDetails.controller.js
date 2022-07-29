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
    'sap/suite/ui/commons/TimelineFilterType',

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.core.routing.History} History
     * @param {typeof sap.ui.core.UIComponent} UIComponent
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.m.MessageToast} MessageToast
     * @param {typeof sap.m.MessageBox} MessageBox
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     * @param {typeof sap.suite.ui.commons.TimelineFilterType'} TimelineFilterType
     */
    function (Controller, History, UIComponent, JSONModel, MessageToast, MessageBox, Filter, FilterOperator, TimelineFilterType) {

        let gEmployeeObject;

        function _onObjectMatched(oEvent) {
            //const objContext = this.getView().getModel("employeeDetails").getContext();
        }

        return Controller.extend("logaligroup.logalifinal2.controller.EmployeeDetails", {

            onInit: function () {

                var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                    msgStripVisible: true,
                    objectPage: false,
                    EmployeeId: "",
                    Date: ""

                });
                this.getView().setModel(oJSONModelConfig, "jsonConfig");

                this._timeline = this.byId("Timeline");
                this._timelineitem = this.byId("TimelineItem");


                this._bus = sap.ui.getCore().getEventBus();
                this._bus.subscribe("flexible", "showEmployeeObject", this.getEmployeeObject, this);

                //let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                //oRouter.getRoute("MainEmployeeList").attachPatternMatched(_onObjectMatched, this);
            },

            onAfterRendering: function () {

            },


            getEmployeeObject: function (channelId, eventId, object) {

                gEmployeeObject = object;
                this.getView().getModel("jsonConfig").setProperty("/msgStripVisible", false);
                this.getView().getModel("jsonConfig").setProperty("/objectPage", true);
                this.getView().getModel("jsonConfig").setProperty("/EmployeeId", gEmployeeObject.EmployeeId);
                this._uploadInfo(gEmployeeObject.EmployeeId);

                //Fitro de TimeLine
                this._fiterTimeine(gEmployeeObject.EmployeeId);

            },


            _fiterTimeine: function (EmployeeId) {

                let filter = null,
                    aSelectedDataItems = [];
                filter = new Filter({
                    path: "EmployeeId",
                    value1: EmployeeId,
                    operator: FilterOperator.EQ
                });

                aSelectedDataItems = [EmployeeId];
                this._timeline.setModelFilter({
                    type: TimelineFilterType.Data,
                    filter: filter
                });
                this._timeline.setCurrentFilter(aSelectedDataItems);

            },
            _uploadInfo: function (EmployeeId) {

                let empoyeeId = parseInt(EmployeeId);
                this.byId("uploadCollection").bindAggregation("items", {
                    path: "employeeModel>/Attachments",
                    filters: [
                        new Filter("SapId", FilterOperator.EQ, this.getOwnerComponent().SapId),
                        new Filter("EmployeeId", FilterOperator.Contains, empoyeeId.toString()), //
                    ],
                    template: new sap.m.UploadCollectionItem({
                        documentId: "{employeeModel>AttId}",
                        visibleEdit: false,
                        fileName: "{employeeModel>DocName}"
                    }).attachPress(this.downloadFile)

                });
                //oEvent.getSource().getBinding("items").refresh();               
            },

            onFileChange: function (oEvent) {
                let uploadCollection = oEvent.getSource();

                //Header token CSRF - Cross-Site request forgeryy
                let oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
                    name: "x-csrf-token",
                    value: this.getView().getModel("employeeModel").getSecurityToken()
                });

                uploadCollection.addHeaderParameter(oCustomerHeaderToken);
            },

            onFileBeforeUpload: function (oEvent) {
                let fileName = oEvent.getParameter("fileName");
                let empoyeeId = parseInt(gEmployeeObject.EmployeeId);

                let oCustumerHeaderSlug = new sap.m.UploadCollectionParameter({
                    name: "slug",
                    value: this.getOwnerComponent().SapId + ";" + empoyeeId.toString() + ";" + fileName
                });

                oEvent.getParameters().addHeaderParameter(oCustumerHeaderSlug);
            },


            onFileUploadComplete: function (oEvent) {

                let empoyeeId = parseInt(gEmployeeObject.EmployeeId);

                //Bind Files
                this.byId("uploadCollection").bindAggregation("items", {
                    path: "employeeModel>/Attachments",
                    filters: [
                        new Filter("SapId", FilterOperator.EQ, this.getOwnerComponent().SapId),
                        new Filter("EmployeeId", FilterOperator.Contains, empoyeeId.toString()), //
                    ],
                    template: new sap.m.UploadCollectionItem({
                        documentId: "{employeeModel>AttId}",
                        visibleEdit: false,
                        fileName: "{employeeModel>DocName}"
                    }).attachPress(this.downloadFile)

                });
                oEvent.getSource().getBinding("items").refresh();

            },

            onFileDeleted: function (oEvent) {
                let oUploadCollection = oEvent.getSource();
                let sPath = oEvent.getParameter("item").getBindingContext("employeeModel").getPath();
                this.getView().getModel("employeeModel").remove(sPath, {
                    success: function () {
                        oUploadCollection.getBinding("items").refresh();
                    },
                    error: function () {

                    }
                });
            },

            downloadFile: function (oEvent) {
                const sPath = oEvent.getSource().getBindingContext("employeeModel").getPath();
                window.open("/sap/opu/odata/sap/ZEMPLOYEES_SRV" + sPath + "/$value");
            },

            onRiseEmployee: function () {

                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                var oButton2 = new sap.m.Button("RiseUpBTn", {
                    text: oResourceBundle.getText("acceptRise"),
                    tap: [this.saveRise, this]
                });

                var oButton3 = new sap.m.Button("RiseCancelBtn", {
                    text: oResourceBundle.getText("cancelRise"),
                    tap: [this.cancelRise, this]

                });

                var oDialog = new sap.m.Dialog("Dialog1", {
                    title: oResourceBundle.getText("newRise"),
                    titleAlignment: sap.m.TitleAlignment.Center,
                    icon: "sap-icon://lead",
                    modal: true,
                    contentWidth: "1em",
                    buttons: [oButton2, oButton3],

                    content: [
                        new sap.m.Label({ text: oResourceBundle.getText("newSalary") }),
                        new sap.m.Input({
                            maxLength: 20,
                            id: "NewSalary"
                        }),

                        new sap.m.Label({ text: oResourceBundle.getText("newDate") }),
                        new sap.m.DateTimeInput("NewDate", {
                            type: "Date",
                            value: {
                                path: '/Date',
                                type: 'sap.ui.model.odata.type.DateTime',
                                formatOptions: {
                                    style: 'medium',
                                    UTC: true
                                },
                                constraints: { displayFormat: 'Date' }

                            }
                        }),


                        new sap.m.Label({ text: oResourceBundle.getText("newComment") }),
                        new sap.m.Input({
                            maxLength: 30,
                            id: "NewComment"
                        }),
                    ]

                });

                oDialog.addStyleClass("sapUiContentPadding");
                sap.ui.getCore().byId("Dialog1").open();
            },

            saveRise: function () {
                //MessageBox.success("Aumento");
                this._saveSalary(gEmployeeObject.EmployeeId);
            },

            cancelRise: function () {
                //MessageBox.success("Cancelar");
                sap.ui.getCore().byId("Dialog1").close();
                sap.ui.getCore().byId("RiseUpBTn").destroy();
                sap.ui.getCore().byId("RiseCancelBtn").destroy();
                sap.ui.getCore().byId("Dialog1").destroyContent();
                sap.ui.getCore().byId("Dialog1").destroy();
            },

            _saveSalary: function (employeeId) {

                oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                let salary = sap.ui.getCore().byId("NewSalary").getValue();
                let date = sap.ui.getCore().byId("NewDate").getDateValue();//sap.ui.getCore().byId("NewDate").getValue(); 
                let comentario = sap.ui.getCore().byId("NewComment").getValue();
                var body = {

                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: employeeId,
                    CreationDate: date,
                    Amount: parseFloat(salary).toFixed(2),
                    Waers: 'EUR',
                    Comments: comentario
                };

                this.getView().getModel("employeeModel").create("/Salaries", body, {
                    success: function () {
                        MessageBox.success(oResourceBundle.getText("riseDone"));
                        this.getView().getModel("employeeModel").refresh();
                    }.bind(this),
                    error: function (e) {

                    }.bind(this)
                })

                this.cancelRise();
            },

            onDismissEmployee: function (oEvent) {

                let deleteText = this.getView().getModel("i18n").getResourceBundle().getText("deleteEmploeeData");
                this._handleMessageBoxOpen(deleteText, "warning");

            },
            _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
                MessageBox[sMessageBoxType](sMessage, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {

                            this._removeSalary();
                            this._removeAttachment();
                            this._removeUser();
                            //this.getView().getModel("employeeModel").refresh();
                        }
                    }.bind(this)
                });
            },

            _removeUser: function () {
                let path = "/Users(SapId='" + gEmployeeObject.SapId + "',EmployeeId='" + gEmployeeObject.EmployeeId + "')";
                this.getView().getModel("employeeModel").remove(path, {
                    success: function () {
                        //MessageBox.success("Borrado");
                        this.getView().getModel("employeeModel").refresh();
                        window.location.reload();
                    }.bind(this),
                    error: function (e) {

                    }.bind(this)
                });

            },
            _removeSalary: function (EmployeeId) {
                //this._readDataSalary(gEmployeeObject.EmployeeId);

                EmployeeId = gEmployeeObject.EmployeeId;
                this.getView().getModel("employeeModel").remove("/Salaries", {
                    filters: [
                        new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                        new sap.ui.model.Filter("EmployeeId", "EQ", EmployeeId)
                    ],
                    success: function (data) {
                       // MessageBox.success("Saalrio Borrado");
                    },
                    error: function (e) {
                        //
                    }.bind(this)

                });

            },

            _readDataSalary: function (EmployeeId) {
                let that = this;
                this.getView().getModel("employeeModel").read("/Salaries", {
                    filters: [
                        new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                        new sap.ui.model.Filter("EmployeeId", "EQ", EmployeeId)
                    ],
                    success: function (data) {
                        // var salaryModel = this._detailEmployeeView.getModel("salaryModel");
                        //salaryModel.setData(data.results);
                        let SalaryId, SapId, EmployeeId;
                        for (var i in data.results) {

                            SalaryId = data.results[i].SalaryId,
                                SapId = data.results[i].SapId,
                                EmployeeId = data.results[i].EmployeeId;
                            that._deleteDataSalary(SalaryId, SapId, EmployeeId);
                        }
                    },
                    error: function (e) {
                        //
                    }.bind(this)

                });
            },

            _deleteDataSalary: function (SalaryId, SapId, EmployeeId) {

                let path = "/Salaries(SalaryId='" + SalaryId + "',SapId='" + SapId + "',EmployeeId='" + EmployeeId + "')";
                this.getView().getModel("employeeModel").remove(path, {
                    success: function () {
                        //MessageBox.success("Saalrio Borrado");
                        //window.location.reload();
                    }.bind(this),
                    error: function (e) {

                    }.bind(this)
                });
            },

            _removeAttachment: function (EmployeeId) {
                // this._readDataAttachment(gEmployeeObject.EmployeeId);

                EmployeeId = gEmployeeObject.EmployeeId;
                this.getView().getModel("employeeModel").remove("/Attachments", {
                    filters: [
                        new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                        new sap.ui.model.Filter("EmployeeId", "EQ", EmployeeId)
                    ],
                    success: function (data) {
                       // MessageBox.success("Saalrio Borrado");
                    },
                    error: function (e) {
                        //
                    }.bind(this)

                });
            },

            _readDataAttachment: function (EmployeeId) {
                let that = this;
                this.getView().getModel("employeeModel").read("/Attachments", {
                    filters: [
                        new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                        new sap.ui.model.Filter("EmployeeId", "EQ", EmployeeId)
                    ],
                    success: function (data) {

                        let AttId, SapId, EmployeeId;
                        for (var i in data.results) {

                            AttId = data.results[i].AttId,
                                SapId = data.results[i].SapId,
                                EmployeeId = data.results[i].EmployeeId;
                            that._deleteDataAttachments(AttId, SapId, EmployeeId);
                        }
                    },
                    error: function (e) {
                        //
                    }.bind(this)

                });
            },
            _deleteDataAttachments: function (AttId, SapId, EmployeeId) {

                let path = "/Attachments(AttId='" + AttId + "',SapId='" + SapId + "',EmployeeId='" + EmployeeId + "')";
                this.getView().getModel("employeeModel").remove(path, {
                    success: function () {
                       // MessageBox.success("Attatch Borrado");
                        //window.location.reload();
                    }.bind(this),
                    error: function (e) {

                    }.bind(this)
                });
            }

        });

    });