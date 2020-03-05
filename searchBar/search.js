angular.module('Search', ["List", "DataService"]);
angular
  .module('Search')
  .component(
  'scriptrSearchDevices',
  {
    bindings : {
      "label": "@",
      "api":"@",
      "selectedDevice": "@",
      "defaultPath": "@"
      
    },
    templateUrl:'/UIWidgets/searchBar/search.html',
    controller: function(httpClient, wsClient,dataService, $scope, $window, $location, $route, $routeParams) {
      
      var self = this;
      this.$onInit = function() {
        if(this.selectedDevice){
          this.params = {"id":  self.selectedDevice }
        }
        if(!this.defaultPath) {
          this.defaultPath = "/map";
        }
      }
      
      self.listCallback = function(data){
        self.searchData = [
          {
            "key" : "all",
            "name" : "All"
          }
        ];
        for(var i = 0; i < data.length; i++) {
          self.searchData.push({"key": data[i].id, "name": data[i].name})
          if(self.selectedDevice && data[i].id == self.selectedDevice)
          		self.selectedValue = data[i].name;
        }
        return self.searchData;
      }
      
      this.onInputChanged = function(text) {
        self.searchText = {"search": text};
      }
      
      self.onSelect = function(data){
        if(data){
          self.selectedValue = data.originalObject.name;
          self.params = {"id": data.originalObject.key}
        }
        if(data.originalObject.key == "all") {
          $location.path(self.defaultPath);
        } else {
          if($routeParams.deviceId)
            $route.updateParams({"deviceId": data.originalObject.key});
          else 
            $location.path(self.defaultPath + "/deviceId/" + data.originalObject.key);
        }
        return data;
      }
    }   
  });
