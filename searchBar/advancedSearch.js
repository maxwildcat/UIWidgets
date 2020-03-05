angular
  .module('Search')
  .component(
  'scriptrAdvancedSearchDevices',
  {
    bindings : {
      options: "<?", //["recordCount", "day", "dateRange"]
      selectedSearch: "@",
      selectedRecordCount:"@"
    },
    templateUrl:'/UIWidgets/searchBar/advancedSearch.html',
    controller: function($timeout, $scope, $window, $location, $route, $routeParams, $translate) {
      var self = this;
      this.$onInit = function() {
        
        this.startDate = null;
        this.endDate = null;
        this.showDatePicker = false;
        this.showDayPicker = false;
        this.showRecordCount = false;
        this.recordCount = null;
        if($routeParams && $routeParams.deviceId) {
          this.selectedDevice = $routeParams.deviceId;
        }
        if($routeParams && $routeParams.startTime) {
          this.dateRangeStart= moment($routeParams.startTime, "MM/DD/YYYY");
          this.startDate = moment($routeParams.startTime).format('L'); 
        }
        if($routeParams && $routeParams.endTime) {
          this.dateRangeEnd= moment($routeParams.endTime, "MM/DD/YYYY");
          this.endDate = moment($routeParams.endTime).format('L'); 
        }
        
        if($routeParams && $routeParams.day) {
          this.dateDay= moment($routeParams.day, "MM/DD/YYYY");
        } 
        
        if($routeParams && $routeParams.recordCount) {
          this.recordCount = parseFloat($routeParams.recordCount);
        } else if(this.selectedRecordCount){
         	 this.recordCount = parseFloat(this.selectedRecordCount);
        }
        
        this.searchModel = ($routeParams.recordCount || (this.selectedSearch && this.selectedSearch == 'recordCount')) ? {key:"recordCount", label:"Data points count"} : (($routeParams.day)?{"key": "day", "label":"By day"} : (($routeParams.startTime && ($routeParams.endTime)? {"key": "dateRange", "label": "Custom Range"} : null)))
        
        if(this.searchModel)
        	this.onSelected(this.searchModel)
        
        this.default_options= [{key:"recordCount", label:"Data points count"},{"key": "day", "label":"By day"}, {"key": "dateRange", "label": "Custom Range"}];
        if(this.options) {
          	this._options = _.map(this.default_options, function(entry) {
             	if(self.options.indexOf(entry["key"]) > -1) return entry;
            })
        } else {
          this._options = this.default_options;
        }
        
        this.rerender = true;
      }
      
      this.onSelected = function(selected) {
        if(selected.key == "dateRange") {
          self.showDayPicker = false;
          self.showRecordCount = false;
          self.showDatePicker = true;
        } 
        if(selected.key == "day") {
          self.showDatePicker = false;
          self.showRecordCount = false;
          self.showDayPicker = true
        }
        if(selected.key == "recordCount") {
          self.showDatePicker = false;
          self.showDayPicker = false;
          self.showRecordCount = true;
        }
      }
      
      this.filterData = function() {
        //this.params["recordCount"] = this.recordCount;
        $location.search({"recordCount": self.recordCount});
        this.rerenderCharts();
      }
      
      this.startDateOnSetTime = function(date){
        self.startDate = moment(date).format('L'); 
        if(self.endDate!=null) { 
          $location.search({"startTime": self.startDate, "endTime": self.endDate});
          self.rerenderCharts();
        }
      }
      
      this.endDateOnSetTime = function(date){
        self.endDate = moment(date).format('L'); 
        if(self.startDate!=null) {
          $location.search({"startTime": self.startDate, "endTime": self.endDate});
          self.rerenderCharts();
        }
      }  
      
      this.onSetTime = function(date){
        $location.search({"day": moment(date).format('L')});
        self.rerenderCharts();
      }
      
      this.rerenderCharts = function() {
        self.rerender = false;
        $timeout(function(){self.rerender=true},1000);
      }
    }   
  });
