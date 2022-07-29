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
            
            let gNextEmloyeeId = 0;
         
            return Controller.extend("logaligroup.logalifinal2.controller.CreateEmloyee", {  

            //ctrl+K+C: Comentar
            //ctrl+K+U: Descomentar
                

            onInit: function () {

                this._oNavContainer = this.byId("wizardNavContainer");
                this._oWizardContentPage = this.byId("wizardContentPage");
                this._wizard = this.byId("CreateEmployeeWizard");

                this.model = new JSONModel();
                this.model.setData({
                    employeeNameState: "Error",
                    employeeLastNameState: "Error",
                    employeeDNIState: "Error",
                    employeeCIFState: "Error",
                    employeeDateState: "Error",
                    //employeeDateIn: new Date()

                });
                this.getView().setModel(this.model);
                this.model.setProperty("/navApiEnabled", true);
                //this.model.setProperty("/nextEmloyeeId", 0);
                this._resetfields();
                
                //var employeeModel = this.getView().getModel("employeeModel");
                //var odata = employeeModel.getData();
                //var index = odata.length;
                //odata.push({ index: index + 1, _ValidateDate: false, EnabledSave: false });
                // this.model.setProperty("/employeeType", "Interno");             

                // //Visibilidad del DNI 
                // this.byId("EmployeeDNI").setProperty("visible", true);
                // this.byId("EmployeeDNI").setProperty("required", true);

                // //Visibilidad del CIF
                // this.byId("EmployeeCIF").setProperty("visible", false);
                // this.byId("EmployeeCIF").setProperty("required", false);

                // //Slider
                // this.model.setProperty("/SliderSalaryText", "Sueldo bruto anual");
                // this.byId("EmployeeSalarySlider").setProperty("value", 24000);
                // this.byId("EmployeeSalarySlider").setProperty("min", 12000);
                // this.byId("EmployeeSalarySlider").setProperty("max", 80000);
                 

            },

            onAfterRendering: function (){
                this._getNextEmpoyeeId();
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

            _setEmptyValue: function (sPath) {
                this.model.setProperty(sPath, "");
            },

            _resetfields: function () {
                this.model.setProperty("/employeeType", "Interno");
                this._setEmptyValue("/employeeName");
                this._setEmptyValue("/employeeLastName");
                this._setEmptyValue("/employeeDNI");
                this._setEmptyValue("/employeeCIF");
                this._setEmptyValue("/employeeSalary");
                this._setEmptyValue("/employeeDateIn");
                this._setEmptyValue("/dateValue");
                this._setEmptyValue("/employeeComentario");
                this._setEmptyValue("/employeeAnexos");

                this.model.setProperty("/employeeNameState", "Error");
                this.model.setProperty("/employeeLastNameState", "Error");
                this.model.setProperty("/employeeDNIState", "Error");
                this.model.setProperty("/employeeCIFState", "Error");
                this.model.setProperty("/employeeDateState", "Error");


                this.byId("EmployeeName").setValue("");
                this.byId("EmployeeLastName").setValue("");
                this.byId("EmployeeDNI").setValue("");
                this.byId("EmployeeCIF").setValue("");
                this.byId("EmployeeDateIn").setValue("");

                //Visibilidad del DNI 
                this.byId("EmployeeDNI").setProperty("visible", true);
                this.byId("EmployeeDNI").setProperty("required", true);

                //Visibilidad del CIF
                this.byId("EmployeeCIF").setProperty("visible", false);
                this.byId("EmployeeCIF").setProperty("required", false);

                //Slider
                this.model.setProperty("/SliderSalaryText", "Sueldo bruto anual");
                this.byId("EmployeeSalarySlider").setProperty("value", 24000);
                this.byId("EmployeeSalarySlider").setProperty("min", 12000);
                this.byId("EmployeeSalarySlider").setProperty("max", 80000);

                //Comentarios
                this.byId("EmployeeComentario").setValue("");

            },

            setEmployeeTypeFromSegmented: function (evt) {
                var employeeType = evt.getParameters().item.getText();
                this.model.setProperty("/employeeType", employeeType);
                this._wizard.validateStep(this.byId("EmployeeTypeStep"));

                var interno = this.getView().getModel("i18n").getResourceBundle().getText("employeeInterno");
                var gerente = this.getView().getModel("i18n").getResourceBundle().getText("employeeGerente");
                var slidertext = "";

                //Visibilidad del DNI y CIF
                this.byId("EmployeeDNI").setValue("");
                this.byId("EmployeeCIF").setValue("");
                if (employeeType == interno || employeeType == gerente) {

                    this.byId("EmployeeDNI").setProperty("visible", true);
                    this.byId("EmployeeDNI").setProperty("required", true);

                    this.byId("EmployeeCIF").setProperty("visible", false);
                    this.byId("EmployeeCIF").setProperty("required", false);
                } else {
                    this.byId("EmployeeDNI").setProperty("visible", false);
                    this.byId("EmployeeDNI").setProperty("required", false);

                    this.byId("EmployeeCIF").setProperty("visible", true);
                    this.byId("EmployeeCIF").setProperty("required", true);
                };
                //Resetea los valores originales con cada cambio de tipo de empleado
                this.employeeInfoValidation();

                //  this.byId("EmployeeName").setValue("");
                //  this.byId("EmployeeLastName").setValue("");
                //  this.byId("EmployeeDNI").setValue("");
                //  this.byId("EmployeeCIF").setValue("");
                //  this.byId("EmployeeDateIn").setValue(""); 
                //  this._wizard.invalidateStep(this.byId("EmployeeDataStep"));                    


                //Control del Slider de salario
                if (employeeType == interno) {
                    slidertext = this.getView().getModel("i18n").getResourceBundle().getText("employeeSalary");
                    this.model.setProperty("/SliderSalaryText", slidertext);
                    this.byId("EmployeeSalarySlider").setProperty("value", 24000);
                    this.byId("EmployeeSalarySlider").setProperty("min", 12000);
                    this.byId("EmployeeSalarySlider").setProperty("max", 80000);
                } else if (employeeType == gerente) {
                    slidertext = this.getView().getModel("i18n").getResourceBundle().getText("employeeSalary");
                    this.model.setProperty("/SliderSalaryText", slidertext);
                    this.byId("EmployeeSalarySlider").setProperty("value", 70000);
                    this.byId("EmployeeSalarySlider").setProperty("min", 50000);
                    this.byId("EmployeeSalarySlider").setProperty("max", 200000);
                } else {
                    slidertext = this.getView().getModel("i18n").getResourceBundle().getText("employeePrice");
                    this.model.setProperty("/SliderSalaryText", slidertext);
                    this.byId("EmployeeSalarySlider").setProperty("value", 400);
                    this.byId("EmployeeSalarySlider").setProperty("min", 100);
                    this.byId("EmployeeSalarySlider").setProperty("max", 2000);
                };
            },

            employeeInfoValidation: function () {

                var name = this.byId("EmployeeName").getValue();
                var lastName = this.byId("EmployeeLastName").getValue();
                var DNI = this.byId("EmployeeDNI").getValue();
                var CIF = this.byId("EmployeeCIF").getValue();
                var oDateIn = this.byId("EmployeeDateIn");
                let statusField = ["0", "0", "0", "0", "0"];
                let flagDNI = "0";
                //var weight = parseInt(this.byId("ProductWeight").getValue());

                if (name.length > 0) {
                    this.model.setProperty("/employeeNameState", "Success");
                    statusField[0] = "0";
                } else {
                    this.model.setProperty("/employeeNameState", "Error");
                    statusField[0] = "1";
                };

                if (lastName.length > 0) {
                    this.model.setProperty("/employeeLastNameState", "Success");
                    statusField[1] = "0";
                } else {
                    this.model.setProperty("/employeeLastNameState", "Error");
                    statusField[1] = "1";
                };

                if (this.byId("EmployeeDNI").getProperty("visible") == true) {
                    if (DNI.length > 0) {

                        flagDNI = this.validateDNI(DNI);
                        if (flagDNI == "0") {
                            this.model.setProperty("/employeeDNIState", "Success");
                            statusField[2] = "0";
                        } else {
                            this.model.setProperty("/employeeDNIState", "Error");
                            statusField[2] = "1";
                        }
                    } else {
                        this.model.setProperty("/employeeDNIState", "Error");
                        statusField[2] = "1";
                    };
                } else { statusField[2] = "0"; }

                if (this.byId("EmployeeCIF").getProperty("visible") == true) {
                    if (CIF.length > 0) {
                        this.model.setProperty("/employeeCIFState", "Success");
                        statusField[3] = "0";
                    } else {
                        this.model.setProperty("/employeeCIFState", "Error");
                        statusField[3] = "1";
                    };
                } else { statusField[3] = "0"; }

                if (oDateIn.getValue().length > 0 && oDateIn.isValidValue()) {
                    this.model.setProperty("/employeeDateState", "Success");
                    statusField[4] = "0";
                } else {
                    this.model.setProperty("/employeeDateState", "Error");
                    statusField[4] = "1";
                };

                //if (name.length == 0 || lastName.length == 0 || DNI.length == 0 ) {
                if (statusField[0] == 0 && statusField[1] == 0 && statusField[2] == 0 &&
                    statusField[3] == 0 && statusField[4] == 0) {

                    this.model.setProperty("/employeeName", name);
                    this.model.setProperty("/employeeLastName", lastName);
                    this.model.setProperty("/employeeDNI", DNI);
                    this.model.setProperty("/employeeCIF", CIF);
                    this.model.setProperty("/employeeSalary", this.byId("EmployeeSalarySlider").getValue());
                    //this.model.setProperty("/employeeDateIn", oDateIn.getValue());
                    

                    this._wizard.validateStep(this.byId("EmployeeDataStep"));

                } else {
                    this._wizard.invalidateStep(this.byId("EmployeeDataStep"));
                }
            },

            validateDNI: function (dni) {
                var number;
                var letter;
                var letterList;
                var regularExp = /^\d{8}[a-zA-Z]$/;

                let flag = "0";

                //Se comprueba que el formato es válido
                if (regularExp.test(dni) === true) {
                    //Número
                    number = dni.substr(0, dni.length - 1);
                    //Letra
                    letter = dni.substr(dni.length - 1, 1);
                    number = number % 23;
                    letterList = "TRWAGMYFPDXBNJZSQVHLCKET";
                    letterList = letterList.substring(number, number + 1);
                    if (letterList !== letter.toUpperCase()) {
                        //Error
                        flag = "1"
                    } else {
                        //Correcto
                        flag = "0";
                    }
                } else {
                    //Error
                    flag = "1";
                }

                return flag;
            },
             
             _getNextEmpoyeeId: function(){
                this.getView().getModel("employeeModel").read("/Users", {
                    filters: [
                        new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                       // new sap.ui.model.Filter("EmployeeId", "EQ", employeeID.toString())
                    ],
                    success: function (data) {

                      //Obtiene el ID del proximo empleado a crear ////////////////////////////
                      let count = 0, i = 0, j = 0;

                      if(data.results.length === 0){
                              count = 1;
                       }else{
                          while(i < data.results.length){
                              j = i + 1;

                              if( j !== parseInt(data.results[i].EmployeeId)){
                                  count = j;
                                  break;
                              }                                 
                              i++;
                          }  

                          if(count === 0){
                             count =  data.results.length + 1
                          }                           
                       }	
                      ////////////////////////////////////////////////////////////////////////
    
                      gNextEmloyeeId = count;
                    },
                    error: function (e) {
                        //
                    }

                });
                
             } ,
             saveData2: function(){
                this.onSaveEmployee(gNextEmloyeeId.toString());
             } ,

             saveData: function (){

  
                this.getView().getModel("employeeModel").read("/Users", {
                    filters: [
                        new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                       // new sap.ui.model.Filter("EmployeeId", "EQ", employeeID.toString())
                    ],
                    success: function (data) {

                      //Obtiene el ID del proximo empleado a crear ////////////////////////////
                      let count = 0, i = 0, j = 0;

                      if(data.results.length === 0){
                              count = 1;
                       }else{
                          while(i < data.results.length){
                              j = i + 1;

                              if( j !== parseInt(data.results[i].EmployeeId)){
                                  count = j;
                                  break;
                              }                                 
                              i++;
                          }  

                          if(count === 0){
                             count =  data.results.length + 1
                          }                           
                       }	
                      ////////////////////////////////////////////////////////////////////////

                        this.onSaveEmployee(count.toString());
                        //return count;
                        // var incidenceModel = this._detailEmployeeView.getModel("incidenceModel");
                        // incidenceModel.setData(data.results);
                        // var tableIncidence = this._detailEmployeeView.byId("tableIncidence");
                        // tableIncidence.removeAllContent();

                        // for (var incidence in data.results) {

                        //     data.results[incidence]._ValidateDate = true;
                        //     data.results[incidence].EnabledSave = false;
                            
                        //     var newIncidence = sap.ui.xmlfragment("logaligroup.employees.fragment.NewIncidence", this._detailEmployeeView.getController());
                        //     this._detailEmployeeView.addDependent(newIncidence);
                        //     newIncidence.bindElement("incidenceModel>/" + incidence);
                        //     tableIncidence.addContent(newIncidence);

                        // }
                    }.bind(this),
                    error: function (e) {
                        //
                    }

                });
                
                
            },
             
            _saveSalary: function (employeeId){

                //employeeId = '9'
                let salary = this.byId("EmployeeSalarySlider").getProperty("value");
                var body = {
                    //SalaryId: '0001',
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: employeeId,
                    CreationDate: this.model.getProperty("/employeeDateIn"),
                    Amount: parseFloat(salary).toFixed(2),
                    Waers: 'EUR',
                    Comments: this.model.getProperty("/employeeComentario"),
                };

                this.getView().getModel("employeeModel").create("/Salaries", body, {
                    success: function () {
                       
                    }.bind(this),
                    error: function (e) {
                        
                    }.bind(this)
                })               
            },
            onSaveEmployee: function (employeeId) {
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                let emptype = "";
                let DNI = "";


                switch(this.model.getProperty("/employeeType")){
                  case oResourceBundle.getText("employeeInterno"): emptype = '0'; break;
                  case oResourceBundle.getText("employeeAutonomo"): emptype = '1'; break;
                  case oResourceBundle.getText("employeeGerente"): emptype = '2'; break;
                }

                if(this.model.getProperty("/employeeDNI") !== "" ){
                    DNI = this.model.getProperty("/employeeDNI");
                }else{
                    DNI = this.model.getProperty("/employeeCIF");
                }
                 

                var body = {
                    EmployeeId: employeeId,
                    SapId: this.getOwnerComponent().SapId,
                    Type: emptype,
                    FirstName: this.model.getProperty("/employeeName"),
                    LastName: this.model.getProperty("/employeeLastName"),
                    Dni: DNI.toString(),
                    CreationDate: this.model.getProperty("/employeeDateIn"),
                    Comments: this.model.getProperty("/employeeComentario"),
                };

                this.getView().getModel("employeeModel").create("/Users", body, {
                    success: function () {
                        //this.onReadODataIncidence.bind(this)(employeeId);
                        MessageBox.success(oResourceBundle.getText("odataSaveOk"));
                        //Guarda el salario del empleado
                        this._saveSalary(employeeId);
                        this._resetfields();
                        this._getNextEmpoyeeId();//Actualiza el número del siguiente empleado
                        this._handleNavigationToStep(0);
                        this._wizard.discardProgress(this._wizard.getSteps()[0]);
                        //sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOk"));
                    }.bind(this),
                    error: function (e) {
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveNOk"));
                    }.bind(this)
                })
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
                //let objContext = oEvent.getSource().getBindingContext("employeeModel").getObject();

                let oCustumerHeaderSlug = new sap.m.UploadCollectionParameter({
                    name: "slug",
                    value: this.getOwnerComponent().SapId + ";" + gNextEmloyeeId.toString() + ";" + fileName
                });

                oEvent.getParameters().addHeaderParameter(oCustumerHeaderSlug);
            },


            onFileUploadComplete: function (oEvent) {

            //Bind Files
                this.byId("uploadCollection").bindAggregation("items", {
                    path: "employeeModel>/Attachments",
                    filters: [                        
                        new Filter("SapId", FilterOperator.EQ, this.getOwnerComponent().SapId),
                        new Filter("EmployeeId", FilterOperator.Contains, gNextEmloyeeId.toString() ), //
                    ],
                    template: new sap.m.UploadCollectionItem({
                        documentId: "{employeeModel>AttId}",
                        visibleEdit: false,
                        fileName: "{employeeModel>DocName}"
                    }).attachPress(this.downloadFile)

                });                
                oEvent.getSource().getBinding("items").refresh();

                //Contamos a cantidad de anexos
                //this.byId("uploadCollection")
               // this.model.setProperty("/employeeAnexos", this.byId("uploadCollection").aItems.length + 1)

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

            //========================= CONTROLES y FUNCIONES DEL WIZARD =====================///////
            backToWizardContent: function () {
                this._oNavContainer.backToPage(this._oWizardContentPage.getId());
            },
            _handleNavigationToStep: function (iStepNumber) {
                var fnAfterNavigate = function () {
                    this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
                    this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
                }.bind(this);

                this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
                this.backToWizardContent();
            },
            _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
                MessageBox[sMessageBoxType](sMessage, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            this._resetfields();
                            this._handleNavigationToStep(0);
                            this._wizard.discardProgress(this._wizard.getSteps()[0]);
                        }
                    }.bind(this)
                });
            },
            handleWizardCancel: function () {
                let cancelWizardText = this.getView().getModel("i18n").getResourceBundle().getText("cancelWizardText");
                this._handleMessageBoxOpen(cancelWizardText, "warning");
            },
            handleWizardSubmit: function () {
                //this._handleMessageBoxOpen("Are you sure you want to submit your report?", "confirm");
                this.saveData2();
            },
            wizardCompletedHandler: function () {
              
               
                this.model.setProperty("/employeeAnexos", this.byId("uploadCollection").aItems.length);

                this._oNavContainer.to(this.byId("wizardReviewPage"));
            },

            editStepOne: function () {
                this._handleNavigationToStep(0);
            },

            editStepTwo: function () {
                this._handleNavigationToStep(1);
            },

            editStepThree: function () {
                this._handleNavigationToStep(2);
            },

        });
    });