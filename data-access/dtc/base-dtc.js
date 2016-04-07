(function (module) {
    function BaseDTC() {

    };
    
    BaseDTC.prototype.validate = function (dto) { };
    
    BaseDTC.prototype.mapFromDTO = function (dto) { };
    
    BaseDTC.prototype.mapFromMO = function (mongooseObject) { };
    
    module.exports = BaseDTC;
})(module);