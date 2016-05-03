//
// Required library
//
var Util = require('util');
var _ = require('lodash');

(function (LocationHelper) {
    
    LocationHelper.getDistance = function (firstLocation, secondLocation) {
        var p = 0.017453292519943295;    // Math.PI / 180
        var a = 0.5 - Math.cos((secondLocation.latitude - firstLocation.latitude) * p)/2 + 
                Math.cos(firstLocation.latitude * p) * Math.cos(secondLocation.latitude * p) * 
                (1 - Math.cos((secondLocation.longitude - firstLocation.longitude) * p))/2;

        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    };
    
})(module.exports);