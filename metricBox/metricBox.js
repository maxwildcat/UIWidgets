angular.module('MetricBox', []);

angular
    .module('MetricBox')
    .component(
        'scriptrMetricbox',
        {

            bindings: {
                
                "value": "<?",
                "latValue": "@",
                "longValue": "@",
                "disabled": "<?",
                "label": "@",
                "unit": "@",
                "borderSize": "@",
                "icon": "@",
                "tag": "@",
                "actionIcon": "@",
                "borderColor": "@",
                "backgroundColor": "@",
                "valueFontFamily": "@",
                "valueFontSize": "@",
                "valueCellSize": "@",
                "valueFontWeight": "@",
                "valueTextColor": "@",
                "valueBackgroundColor": "@",
                "valueTextAlignment": "@",
                "labelFontFamily": "@",
                "labelFontSize": "@",
                "labelFontWeight": "@",
                "labelTextColor": "@",
                "labelBackgroundColor": "@",
                "labelTextAlignment": "@",
                "unitFontFamily": "@",
                "unitFontSize": "@",
                "unitCellSize": "@",
                "unitFontWeight": "@",
                "unitTextColor": "@",
                "unitBackgroundColor": "@",
                "unitTextAlignment": "@",
                "api": "@",
                "enableResize": "<?",
                "transport": "@",
                "msgTag": "@",
                "apiParams": "<?",
                "onFormatData": "&",
                "onActionClicked": "&",
                "fetchDataInterval": "@",
                "useWindowParams": "@",
                "clickedModel": "<?"
            },
            templateUrl: '/UIWidgets/metricBox/metricBox.html',
            controller: function ($scope, httpClient, wsClient, $element, $window, $timeout, $interval, $window, wDataService ) {

                var self = this;
                self.isLoading = false;
                                
                this.$onInit = function () {
                 
                    this._apiParams = (this.apiParams) ? angular.copy(this.apiParams) : [];
                    this.widgetLayout = (this.widgetLayout == "vertical") ? this.widgetLayout : "horizontal";
                    this.value = (this.value) ? this.value : "0";

/*                  // forcing 2 decimals
                  var isnum = /^\d+\.\d+$/.test(this.value);//check if string is made only of numbers/float
                  if(isnum){
                    var thisValue = parseFloat(this.value);
                    this.value = +thisValue.toFixed(2);
                  }*/

                  this.latValue = (this.latValue) ? "" : this.latValue;
                  this.longValue = (this.longValue) ? "" : this.longValue;


                    this.label = (this.label) ? this.label : "Items";
                    this.unit = (this.unit) ? this.unit  : "";
                    this.actionIcon = (this.actionIcon) ? this.actionIcon  : "";
                    this.icon = (this.icon) ? this.icon  : "";
                    this.tag = (this.tag) ? this.tag  : "NO_TAG";
                    this.disabled = (this.disabled) ? this.disabled  : false;
                    this.borderSize = (this.borderSize) ? this.borderSize : "1";
                    this.valueCellSize = (this.valueCellSize) ? this.valueCellSize : "";
                    this.borderColor = (this.borderColor) ? this.borderColor : "#ff8c00";
                    this.backgroundColor = (this.backgroundColor) ? this.backgroundColor : "#d7d7d7";
                    this.valueFontFamily = (this.valueFontFamily) ? this.valueFontFamily : "Arial";
                    this.valueFontSize = (this.valueFontSize) ? this.valueFontSize : "42";
                    this.valueFontWeight = (this.valueFontWeight) ? this.valueFontWeight : "600";
                    this.valueTextColor = (this.valueTextColor) ? this.valueTextColor : "#ff8c00";
                    this.valueTextAlignment = (this.valueTextAlignment) ? this.valueTextAlignment : "center";
                    this.labelFontFamily = (this.labelFontFamily) ? this.labelFontFamily : "Arial";
                    this.labelFontSize = (this.labelFontSize) ? this.labelFontSize : "18";
                    this.labelFontWeight = (this.labelFontWeight) ? this.labelFontWeight : "600";
                    this.labelTextColor = (this.labelTextColor) ? this.labelTextColor : "#ff8c00";
                    this.labelTextAlignment = (this.labelTextAlignment) ? this.labelTextAlignment : "center";
                    this.unitFontFamily = (this.unitFontFamily) ? this.unitFontFamily : "Arial";
                    this.unitFontSize = (this.unitFontSize) ? this.unitFontSize : "42";
                    this.unitFontWeight = (this.unitFontWeight) ? this.unitFontWeight : "600";
                    this.unitTextColor = (this.unitTextColor) ? this.unitTextColor : "#ff8c00";
                    this.unitTextAlignment = (this.unitTextAlignment) ? this.unitTextAlignment : "center";

                    this.enableResize = (typeof this.enableResize != 'undefined') ? this.enableResize : true;
                  console.log(this);
                    angular.element($window).on('resize', function () {
                        if (self.timeoutId != null) {
                            $timeout.cancel(self.timeoutId);
                        }
                        return self.timeoutId = $timeout(self.resize, 100);
                    });
                    this.transport = (this.transport) ? this.transport : "wss";
                    this.msgTag = (this.msgTag) ? this.msgTag : null;

                    this.useWindowParams = (this.useWindowParams) ? this.useWindowParams : "true";
                    this.fetchDataInterval = (this.fetchDataInterval) ? parseInt(this.fetchDataInterval) : null;
                    this.style = {};
                }

                this.$postLink = function () {
                   $timeout(self.resize, 100);
                   if (self.timeoutId != null) {
                       $timeout.cancel(self.timeoutId);
                   }
                   self.timeoutId = $timeout(self.resize, 100);
                  
/*                   $scope.$watch(function( $scope ) {
                      // wait for the timeout
                      if($scope.$ctrl.clickedModel){
                        return $scope.$ctrl.clickedModel
                      }
                   },function(newVal, oldVal){
                        if(newVal != oldVal)
                         self.actionClicked(self.tag, newVal)
                   });*/
 
                   initDataService(this.transport);
                }

                self.clickLink = function(){
                  $scope.$ctrl.clickedModel = !$scope.$ctrl.clickedModel;
                  self.actionClicked(self.tag, $scope.$ctrl.clickedModel);
                }
                self.clickCheck = function(){
                  self.actionClicked(self.tag, $scope.$ctrl.clickedModel);
                }

                this.$onDestroy = function () {
                    if (self.msgTag) {
                        wsClient.unsubscribe(self.msgTag, null, $scope.$id);
                    }

                    if (self.refreshTimer) {
                        $interval.cancel(self.refreshTimer);
                    }
                }

                var initDataService = function (transport) {
                  console.log(wDataService );
                    wDataService .getData(transport, self.api, self.apiParams, self.useWindowParams, self.msgTag, self.consumeData.bind(self), self.fetchDataInterval, $scope.$id);

                    if (self.fetchDataInterval && !self.refreshTimer) {
                        //Assuming this is success
                        self.refreshTimer = $interval(
                            function () {
                                initDataService(self.transport)
                            }, self.fetchDataInterval * 1000);
                    }
                }
                
                self.actionClicked=function(tag, value){
                  if (typeof self.onActionClicked() == "function") {
                         self.onActionClicked()(tag, value);
                    }
                }

                this.consumeData = function (value, response) {
                    if (typeof self.onFormatData() == "function") {
                        value = self.onFormatData()(value);
                    }
                    self.value = value;
                    if (typeof value == "object") {
                        if (value && value.value && typeof value.value == "string") {
                            self.value = value.value;
                        }
                    }
                    if (typeof value == "string") {
                        self.value = value
                    }
                }
            }
        });
