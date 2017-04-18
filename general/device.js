/**
 * @device.js 
 * File dedicated to manage device persistance.
 * Author: Andrés Abril
 * © 2016, Emerson Electric Co
 */

//////////////////////////
///// Dependencies ///////
//////////////////////////
var fs = require("fs");
var file = "./data/device.db";
var exists = fs.existsSync(file);
var dblite = require("dblite");
var dataHelper = require('./datahelper');
var settings = require('./settings');
var request = require("request");
//////////////////////////
///End of Dependencies ///
//////////////////////////

////////////////////
/////// Vars ///////
//*avoid hoisting*//
////////////////////
var db;
var arrayResponse = [];
var dbModule = {};

//////////////////////////////////////////////////////
//* vvvvvvvvvvvvvvvvvvv VERY IMPORTANT ********** ////
var table_name = 'Device'; // <<<<<<<<<<<<<<<<<<< ////
// This variable defines the creation of the table  //
// and tells datahelper class where to do the query //
//////////////////////////////////////////////////////

// This object will help to parse the data comming from the database into a familiar js type
// Needs to be in the exact order
var dataParseDesc = {
	id : Number,
	device_tag: String,
	device_address: String,
	device_src : String, 
	gateway_tag : String,
	gateway_address : String, 
	network_id : String, 
	device_type : Number,
	out_of_service : Number, 
	update_rate : Number,
	var_list : String, //Comma separated strings (PV,SV,TV,QV)
	data : JSON.parse,
	log : JSON.parse,
	polling_info : JSON.parse,
	active : Number, 
};

//For each field in the table we push the individual query in an array.
//This will make the creation of new fields easier and more readable
var tableArray = [];

////////////////////
////End of Vars ////
////////////////////


//This snippet creates a database file if it doesn't exist
if(!exists){
	console.log("Creating DB file from device.");
	fs.openSync(file, "w");
}

tableArray.push('id INTEGER PRIMARY KEY AUTOINCREMENT'); // id
tableArray.push('device_tag TEXT UNIQUE NOT NULL'); // device_tag
tableArray.push('device_address TEXT NOT NULL'); // device_address
tableArray.push('device_src TEXT NOT NULL'); // device_src
tableArray.push('gateway_tag TEXT NOT NULL'); // gateway_tag
tableArray.push('gateway_address TEXT NOT NULL'); // gateway_address
tableArray.push('network_id TEXT'); // network_id
tableArray.push('device_type NUMERIC'); // type
tableArray.push('out_of_service NUMERIC'); // outofservice
tableArray.push('update_rate NUMERIC'); // update_rate
tableArray.push('var_list TEXT'); // outofservice
tableArray.push('data TEXT'); // data
tableArray.push('log TEXT'); // log
tableArray.push('polling_info TEXT'); // polling_info
tableArray.push('active NUMERIC'); // active

//Starts the database and initializes it into the db variable
db = dblite(file);


//This snippet creates the Table if it doesn't exist yet
db.query("CREATE TABLE IF NOT EXISTS "+table_name+" (" +tableArray.join(',')+ ")");
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// MAIN FUNCTION FOR DEVICE CREATION //////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for createNewDevice //////////////////////////////////////////////////////
//**********************************************************************************
//*deviceObj -> Object: javascript object with multiple params *********************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dbModule.createNewDevice = function(deviceObj,callback){
	db.ignoreErrors = true;
	//Var created to store deviceObj
	var objectToStore = {};
	
	//Check if deviceObj exists, if not, return error
	if(Object.keys(deviceObj).length === 0){
		console.log('No device Object');
		callback({status:false, error: 'No device Object received', code:422},null);
		return;
	}
	
	//Check if deviceObj.asset_tag exists, if not, return error
	if(!deviceObj.device_tag){
		console.log('No Device tag');
		callback({status:false, error: 'No device tag specified. This field is required.', code:422},null);
		return;
	}
	//Set deviceObj.device_tag into objectToStore
	else{
		objectToStore.device_tag = deviceObj.device_tag;
	}
	
	//Check if deviceObj.device_address exists, if not, return error
	if(!deviceObj.device_address){
		deviceObj.device_address = 'NO DEVICE ADDRESS';
	}
	//Set deviceObj.device_address into objectToStore
	else{
		objectToStore.device_address = deviceObj.device_address;
	}
	
	//Check if deviceObj.device_src exists, if not, return HART-IP as default value
	if(!deviceObj.device_src){
		objectToStore.device_src = 'HART-IP';
	}
	//Set deviceObj.device_src into objectToStore
	else{
		objectToStore.device_src = deviceObj.device_src;
	}
	
	//Check if deviceObj.gateway_tag exists, if not, return error
	if(!deviceObj.gateway_tag){
		deviceObj.gateway_tag = 'NO GATEWAY TAG';
	}
	//Set deviceObj.gateway_tag into objectToStore
	else{
		objectToStore.gateway_tag = deviceObj.gateway_tag;
	}
	
	//Check if deviceObj.gateway_address exists, if not, return error
	if(!deviceObj.gateway_address){
		deviceObj.gateway_address = 'NO GATEWAY ADDRESS';
	}
	//Set deviceObj.gateway_address into objectToStore
	else{
		objectToStore.gateway_address = deviceObj.gateway_address;
	}
	
	//Check if deviceObj.update_rate exists
	if(!deviceObj.update_rate){
		objectToStore.update_rate = 0;
	}
	//Set deviceObj.update_rate into objectToStore
	else{
		//Check if it is a number
		if(!isNaN(deviceObj.update_rate))
			objectToStore.update_rate = deviceObj.update_rate;
		//If not a number set 0 as default
		else
			objectToStore.update_rate = 0;
	}
	//Check if deviceObj.type exists
	if(!deviceObj.device_type){
		objectToStore.device_type = 0;
	}
	//Set deviceObj.update_rate into objectToStore
	else{
		//Check if it is a number
		if(!isNaN(deviceObj.device_type))
			objectToStore.device_type = deviceObj.device_type;
		//If not a number set 0 as default
		else
			objectToStore.device_type = 0;
	}
	
	//Check if deviceObj.out_of_service exists
	if(!deviceObj.out_of_service){
		objectToStore.out_of_service = 0;
	}
	//Set deviceObj.out_of_service into objectToStore
	else{
		//Check if it is a number
		if(!isNaN(deviceObj.out_of_service))
			objectToStore.out_of_service = deviceObj.out_of_service;
		//If not a number set 0 as default
		else
			objectToStore.out_of_service = 0;
	}
	
	//Check if deviceObj.network_id exists
	if(!deviceObj.network_id){
		objectToStore.network_id = 'NO NETWORK ID';
	}
	//Set deviceObj.network_id into objectToStore
	else{
		objectToStore.network_id = deviceObj.network_id;
	}
	
	//Check if deviceObj.var_list exists
	if(!deviceObj.var_list){
		objectToStore.var_list = '';
	}
	//Set deviceObj.var_list into objectToStore
	else{
		objectToStore.var_list = deviceObj.var_list;
	}
	
	//Check if deviceObj.data exists
	if(!deviceObj.data){
		objectToStore.data = JSON.stringify({});
	}
	//Set deviceObj.data into objectToStore
	else{
		objectToStore.data = JSON.stringify(deviceObj.data);
	}
	
	//Check if deviceObj.log exists
	if(!deviceObj.log){
		objectToStore.log = JSON.stringify({});
	}
	//Set deviceObj.data into objectToStore
	else{
		objectToStore.log = JSON.stringify(deviceObj.log);
	}
	
	//Check if deviceObj.polling_info exists
	if(!deviceObj.polling_info){
		objectToStore.polling_info = JSON.stringify({});
	}
	//Set deviceObj.polling_info into objectToStore
	else{
		objectToStore.polling_info = JSON.stringify(deviceObj.polling_info);
	}
	
	//Check if deviceObj.active is 1 or 0
	if(deviceObj.active == 1 || deviceObj.active == 0){
		objectToStore.active = deviceObj.active;
	}
	//If not a number set 0 as default
	else{
		objectToStore.active = 1;
	}
	
	dataHelper.insert(db, table_name, ['null', ':device_tag', ':device_address', ':device_src', ':gateway_tag', ':gateway_address', ':network_id', ':device_type', ':out_of_service', ':update_rate', ':var_list', ':data', ':log', ':polling_info', ':active'], objectToStore, callback);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// End of createNewDevice //////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTION FOR GETTING DEVICE BY ID //////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for getDeviceByID ////////////////////////////////////////////////////////
//**********************************************************************************
//*id -> Number: Positive integer **************************************************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dbModule.getDeviceByID = function(id, callback){
	//Check if id exists
	if(!id){
		callback({status:false, error: 'No ID specified.', code:422}, null);
		return;
	}
	
	dataHelper.getByID(db,id,table_name,dataParseDesc,callback);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// End of getDeviceByID ////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTION FOR GETTING DEVICE BY TAG /////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for getDeviceByTag //////////////////////////////////////////////////////
//**********************************************************************************
//*device_tag -> String: device_tag ************************************************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dbModule.getDeviceByTag = function(device_tag, callback){
	//Check if tag exists
	if(!device_tag){
		callback({error:'No Device tag specified.', code:422}, null);
		return;
	}
	dataHelper.getByParam(db, device_tag, 'device_tag', table_name, dataParseDesc, callback);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// End of getDeviceByTag ///////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTION FOR GETTING LIST OF DEVICES WITH ORDER AND LIMIT AS PARAMETERS ////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for getDevicesList ///////////////////////////////////////////////////////
//**********************************************************************************
//*order -> String: should be ASC or DESC ******************************************
//*limit -> Number: should be a positive number from 1 to 2500 *********************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dbModule.getDevicesList = function(order, limit, callback){
	//If we don't receive any known value in 'order' param we set it as ASC by default
	if(order == 'ASC' || order == 'asc'){
		order = 'ASC';
	}
	else if(order == 'DESC' || order == 'desc'){
		order = 'DESC';
	}
	else{
		order = 'ASC';
	}
	
	//If we don't receive any limit value in 'limit' param we set it as 10 by default
	if(!limit){
		limit = 10;
	}
	//If the value is lower than 1 we set it as 1
	else if(limit < 1){
		limit = 1;
	}
	//If the value is higher than 2500 we set it as 2500
	else if(limit > 5000){
		limit = 5000;
	}
	
	dataHelper.list(db,table_name,order,limit,dataParseDesc,callback);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// End of getDevicesList ///////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTION FOR GETTING LIST OF DEVICES WITH ORDER AND LIMIT AS PARAMETERS ////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for getDevicesList ///////////////////////////////////////////////////////
//**********************************************************************************
//*order -> String: should be ASC or DESC ******************************************
//*limit -> Number: should be a positive number from 1 to 2500 *********************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dbModule.getActiveDevicesList = function(order, limit, callback){
	//If we don't receive any known value in 'order' param we set it as ASC by default
	if(order == 'ASC' || order == 'asc'){
		order = 'ASC';
	}
	else if(order == 'DESC' || order == 'desc'){
		order = 'DESC';
	}
	else{
		order = 'ASC';
	}
	
	//If we don't receive any limit value in 'limit' param we set it as 10 by default
	if(!limit){
		limit = 10;
	}
	//If the value is lower than 1 we set it as 1
	else if(limit < 1){
		limit = 1;
	}
	//If the value is higher than 2500 we set it as 2500
	else if(limit > 5000){
		limit = 5000;
	}
	dataHelper.listByParam(db,table_name,1,'active',order,limit,dataParseDesc,callback);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// End of getDevicesList ///////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTION LIST DEVICES BY TYPE //////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for getDevicesList ///////////////////////////////////////////////////////
//**********************************************************************************
//*device_type -> String: comma separated device type NUMERIC **********************
//*order -> String: should be ASC or DESC ******************************************
//*limit -> Number: should be a positive number from 1 to 2500 *********************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dbModule.getDeviceListByType = function(device_type,order, limit, callback){
	var sorted_devices = [];
	//If we don't receive any known value in 'order' param we set it as ASC by default
	if(order == 'ASC' || order == 'asc'){
		order = 'ASC';
	}
	else if(order == 'DESC' || order == 'desc'){
		order = 'DESC';
	}
	else{
		order = 'ASC';
	}
	
	//If we don't receive any limit value in 'limit' param we set it as 10 by default
	if(!limit){
		limit = 10;
	}
	//If the value is lower than 1 we set it as 1
	else if(limit < 1){
		limit = 1;
	}
	//If the value is higher than 2500 we set it as 2500
	else if(limit > 5000){
		limit = 5000;
	}
	//Turn the comma separated values into an array of device types
	device_type = device_type.split(',');
	//dataHelper.listByParam(db, table_name, device_type, 'device_type', order, limit, dataParseDesc, callback);
	dataHelper.listByParamList(db, table_name, device_type, 'device_type', order, limit, dataParseDesc, function(err, response){
		if(err){
			callback(err, null);
			return;
		}
		else{
			response.data = response.data.sort(function(a,b) {
				var textA = a.device_tag.toUpperCase();
				var textB = b.device_tag.toUpperCase();
				if (textA < textB){
					return -1;
				}
				if (textA > textB){
					return 1;
				}
				return 0;
			});
			callback(null, response);			
		}
	});
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// End of getDeviceListByType //////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTION FOR DELETING DEVICE BY ID /////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for deleteDeviceByID /////////////////////////////////////////////////////
//**********************************************************************************
//*id -> Number: Positive integer **************************************************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dbModule.deleteDeviceByID = function(id, callback){
	//Check if id exists as parameter
	if(!id){
		callback({status:false, error: 'No ID specified.', code:422}, null);
		return;
	}
	
	dataHelper.deleteByID(db,id,table_name,dataParseDesc,callback);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// End of deleteDeviceByID /////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTION FOR DELETING DEVICE BY TAG ////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for deleteDeviceByTag ///////////////////////////////////////////////
//**********************************************************************************
//*device_tag -> String: device_tag **************************************************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dbModule.deleteDeviceByTag = function(device_tag, callback){
	//Check if device_tag exists as param
	if(!device_tag){
		callback({error:'No device_tag specified.', code:422}, null);
		return;
	}
	dataHelper.deleteByParam(db, device_tag, 'device_tag', table_name, dataParseDesc, callback);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// End of deleteDeviceByTag ////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTION FOR DELETING DEVICES BY ID LIST ///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for deleteDevicesByIDList ////////////////////////////////////////////////
//**********************************************************************************
//*ids -> String: Comma separated values *******************************************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dbModule.deleteDevicesByIDList = function(ids, callback){
	//Check if id exists as parameter
	var ids_array = ids.split(',');
	if(!ids_array.length){
		callback({status:false, error: 'No IDs specified.', code:422}, null);
		return;
	}
	
	dataHelper.deleteByIDList(db,ids_array,table_name,dataParseDesc,callback);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// End of deleteDevicesByID  ///////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////
// MAIN FUNCTION FOR DEVICE UPDATE BY ID //////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Params for updateDeviceByID /////////////////////////////////////////////////////
//**********************************************************************************
//*id -> Number: Positive integer **************************************************
//*deviceObj -> Object: javascript object with multiple params ********************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dbModule.updateDeviceByID = function(id,deviceObj,callback){
	//Var created to store deviceObj
	var query = [];
	var valueObject = {};
	//Check if deviceObj exists, if not, return error
	if(Object.keys(deviceObj).length === 0){
		callback({status:false, error: 'No device Object received', code:422},null);
		return;
	}
	
	//Check if deviceObj.update_rate exists
	if(deviceObj.update_rate){
		//Add the value only if it is a number
		if(!isNaN(deviceObj.update_rate)){
			query.push('update_rate=:update_rate');
			valueObject.update_rate = deviceObj.update_rate;
		}
	}
	
	//Add the value only if it is 0 or 1
	if(deviceObj.out_of_service === 0 || deviceObj.out_of_service === 1){
		query.push('out_of_service=:out_of_service');
		valueObject.out_of_service = deviceObj.out_of_service;
	}
	
	//Check if deviceObj.network_id exists
	if(deviceObj.network_id){
		query.push('network_id=:network_id');
		valueObject.network_id = deviceObj.network_id;
	}
	
	//Check if deviceObj.var_list exists
	if(deviceObj.var_list){
		query.push('var_list=:var_list');
		valueObject.var_list = deviceObj.var_list;
	}
	
	//Check if deviceObj.var_list exists
	if(deviceObj.device_type){
		query.push('device_type=:device_type');
		valueObject.device_type = deviceObj.device_type;
	}
		
	//Check if deviceObj.data exists
	if(deviceObj.data){
		query.push('data=:data');
		valueObject.data = JSON.stringify(deviceObj.data);
	}
	
	//Check if deviceObj.log exists
/*
	if(deviceObj.data){
		query.push('log=:log');
		valueObject.log = JSON.stringify(deviceObj.log);
	}
*/
	
	//Check if deviceObj.polling_info exists
	if(deviceObj.polling_info){
		query.push('polling_info=:polling_info');
		valueObject.polling_info = JSON.stringify(deviceObj.polling_info);
	}
	
	//Check if deviceObj.active exists
	if(deviceObj.active){
		query.push('active=:active');
		valueObject.active = deviceObj.active;
	}
	
	valueObject.id=id;
	
	dataHelper.updateByID(db,id,table_name,query,valueObject,dataParseDesc,callback);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// End of updateDeviceWithID ///////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// MAIN FUNCTION FOR UPDATE DEVICE BY TAG /////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Params for updateDeviceByTag ////////////////////////////////////////////////////
//**********************************************************************************
//*device_tag -> String: gateway_tag ***********************************************
//*deviceObj -> Object: javascript object with multiple params *********************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dbModule.updateDeviceByTag = function(device_tag,deviceObj,callback){
	//Var created to store deviceObj
	var query = [];
	var valueObject = {};
	//Check if deviceObj exists, if not, return error
	if(Object.keys(deviceObj).length === 0){
		callback({status:false, error: 'No device Object received', code:422},null);
		return;
	}
	
	//Check if deviceObj.update_rate exists
	if(deviceObj.update_rate){
		//Add the value only if it is a number
		if(!isNaN(deviceObj.update_rate)){
			query.push('update_rate=:update_rate');
			valueObject.update_rate = deviceObj.update_rate;
		}
	}
	
	//Add the value only if it is 0 or 1
	if(deviceObj.out_of_service === 0 || deviceObj.out_of_service === 1){
		query.push('out_of_service=:out_of_service');
		valueObject.out_of_service = deviceObj.out_of_service;
	}
	
	//Check if deviceObj.network_id exists
	if(deviceObj.network_id){
		query.push('network_id=:network_id');
		valueObject.network_id = deviceObj.network_id;
	}
	
	//Check if deviceObj.var_list exists
	if(deviceObj.var_list){
		query.push('var_list=:var_list');
		valueObject.var_list = deviceObj.var_list;
	}
	
	//Check if deviceObj.var_list exists
	if(deviceObj.device_type){
		query.push('device_type=:device_type');
		valueObject.device_type = deviceObj.device_type;
	}
		
	//Check if deviceObj.data exists
	if(deviceObj.data){
		query.push('data=:data');
		valueObject.data = JSON.stringify(deviceObj.data);
	}
	
	//Check if deviceObj.log exists
	if(deviceObj.log){
		query.push('log=:log');
		valueObject.log = JSON.stringify(deviceObj.log);
	}
	
	//Check if deviceObj.polling_info exists
	if(deviceObj.polling_info){
		query.push('polling_info=:polling_info');
		valueObject.polling_info = JSON.stringify(deviceObj.polling_info);
	}
	
	//Check if deviceObj.active exists
	if(deviceObj.active){
		query.push('active=:active');
		valueObject.active = deviceObj.active;
	}
	
	valueObject.device_tag=device_tag;

	dataHelper.updateByParam(db, device_tag, 'device_tag', table_name, query, valueObject, dataParseDesc, callback);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// End of updateDeviceByTag ////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// MAIN FUNCTION FOR UPDATE DEVICE BY TAG /////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Params for updateDeviceByTag ////////////////////////////////////////////////////
//**********************************************************************************
//*device_tag -> String: gateway_tag ***********************************************
//*deviceObj -> Object: javascript object with multiple params *********************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dbModule.toggleDevice = function(device_id,toggle_value,callback){
	//Var created to store deviceObj
	var query = [];
	var valueObject = {};
	
	//Check if deviceObj.id exists, if not, return error
	if(!device_id){
		console.log('No Device ID');
		callback({status:false, error: 'No device id specified. This field is required.', code:422},null);
		return;
	}
	
	//Check if deviceObj.active exists
	if(toggle_value == 1 || toggle_value == 0){
		query.push('active=:active');
		valueObject.active = toggle_value;
	}
	
	valueObject.id=device_id;

	dataHelper.updateByParam(db, device_id, 'id', table_name, query, valueObject, dataParseDesc, callback);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// End of updateDeviceByTag ////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

//External request
dbModule.updateExternalDeviceByTag = function(device_tag, callback){
	var id = 1;
	var current_settings = {};
	var current_device = {};

	settings.getGlobalSettingsByID(id, function(err,res){
		if(err){
			callback(err,null);
			return;
		}
		else{
			current_settings = res.data.data;
			dbModule.getDeviceByTag(device_tag, function(err,res){
				if(err){
					callback(err,null);
					return;
				}
				else{
					current_device = res.data;
					request({	
						url: current_settings.endpoint+'/general/device/tag/'+device_tag,
						headers: {
							'Content-Type': 'application/json'
						},
						method: "PUT",
						json: current_device
					},function(error, response, body) {
							if(error){
								callback({status:false, error:error, code:response.statusCode},null);
								return;
							}
							else if(response){
								console.log(response.statusCode);
								if(response.statusCode!=200){
									callback({status:false, error:body, code:response.statusCode},null);
									return;
								}
								callback(null,response);
								return;
							}
					});
				}
			});
		}
	});
	
};


dbModule.createExternalDeviceByTag = function(device_tag, callback){
	var id = 1;
	var current_settings = {};
	var current_device = {};

	settings.getGlobalSettingsByID(id, function(err,res){
		if(err){
			callback(err,null);
			return;
		}
		else{
			current_settings = res.data.data;
			dbModule.getDeviceByTag(device_tag, function(err,res){
				if(err){
					callback(err,null);
					return;
				}
				else{
					current_device = res.data;
					console.log('device', current_device);
					request({	
						url: current_settings.endpoint+'/general/device',
						headers: {
							'Content-Type': 'application/json'
						},
						method: "POST",
						form: current_device
					},function(error, response, body) {
							if(error){
								callback(error,null);
								return;
							}
							else if(response){
								callback(null,response);
								return;
							}
					});
				}
			});
		}
	});
	
};

dbModule.deleteExternalDeviceByTag = function(device_tag, callback){
	var id = 1;
	var current_settings = {};
	var current_device = {};

	settings.getGlobalSettingsByID(id, function(err,res){
		if(err){
			callback(err,null);
			return;
		}
		else{
			current_settings = res.data.data;
			dbModule.getDeviceByTag(device_tag, function(err,res){
				if(err){
					callback(err,null);
					return;
				}
				else{
					current_device = res.data;
					console.log('device', current_device);
					request({	
						url: current_settings.endpoint+'/general/device/tag/'+current_device.device_tag,
						headers: {
							'Content-Type': 'application/json'
						},
						method: "DELETE"
					},function(error, response, body) {
							if(error){
								callback(error,null);
								return;
							}
							else if(response){
								callback(null,response);
								return;
							}
					});
				}
			});
		}
	});
	
}

//Timer poll
setInterval(function(){
dbModule.getActiveDevicesList('ASC', 10000, function(device_err,device_res){
	var devices = [];
	var devices_to_poll = [];
	var id = 1;
	var current_settings = {};
	var now = null;
	var device_to_update = {};
	var time_delta = null;
	var settings_to_use = null;
	settings.getGlobalSettingsByID(id, function(settings_err,settings_res){
		if(settings_err){
			console.log('Error loading settings. Can not send request to target server.');
			return;
		}
		else{
			if(settings_res.data && settings_res.data.active){
				current_settings = settings_res.data.data;
				if(device_err){
					//console.log('No active devices found');
				}
				else{
					if(device_res.data){
						now = +new Date();
						devices = device_res.data;
						devices.forEach(function(device){
							var current_device = {};
							if(!device.log || !device.log.last_polling_data_sent){
								device.log = {
									last_polling_data_sent : new Date(),
									last_ten : []
								};
							}
							else{
								time_delta = ((now - device.log.last_polling_data_sent)/1000);
								if( time_delta < device.update_rate){
									//console.log('Not yet', device.device_tag, 'Update rate:', device.update_rate, 'Time elapsed:', time_delta);
									return;
								}
								else{
									console.log('Time to post', device.device_tag, 'Update rate:', device.update_rate, 'Time elapsed:', time_delta);
									device.log.last_polling_data_sent = now;
								}
							}
							if(device.data.override_global_settings){
								settings_to_use = device.data.settings;
								console.log('Using device settings');
							}
							else{
								settings_to_use = current_settings.settings;
								console.log('Using global settings');
							}
							
							current_device = new PollingDataRow(device, settings_to_use);
							//return;
							request({	
								uri: current_settings.endpoint+'/general/private/post',
								headers: {
									'content-type': 'application/json'
								},
								method: "POST",
								json : current_device
							},function(error, response, body) {

									if(error){
										//console.log('error posting', device.device_tag, error);
										return;
									}
									else{
										//console.log(body);
										device.log.last_ten.unshift(current_device.log.concat());
										device_to_update.device_tag = device.device_tag;
										device_to_update.log = device.log;
										device_to_update.log.last_ten.splice(100,device_to_update.log.last_ten.length);
										//console.log('Requested success',device);
										
										dbModule.updateDeviceByTag(device.device_tag, device_to_update, function(err){
											current_device = null;
											if(err){
												//console.log('error updating', device.device_tag);
											}
											else{
												//console.log('device updated', device.device_tag);
											}
										});
									}
							});

						});
					}
				}
			}
		}
	});
	
});
},3000);

function PollingDataRow(device,settings){
	var algorithm = '';
	this.date = +new Date();
	this.device_tag = device.device_tag;
	this.device_address = device.device_address || 'NA';
	this.server_type = 'HART-IP';
	this.server_src = 'Simulator';
	this.variable = device.var_list.split(',').length > 1 ? 'MULTI':device.var_list;
	this.data = {
		process_data : []
	};
	var data = this.data;
	this.log = [];
	var log_object = {};
	var log_string = '';
	var self = this;
	Object.keys(device.polling_info).forEach(function(key){
		if(device.polling_info[key] && device.polling_info[key].active){
			device.polling_info[key].dv_TS = +new Date();
			device.polling_info[key].dv_value_description = device.polling_info[key].dv_value;
			
			//Pumps
			if(device.polling_info[key].dv_value=='Vibration 1'){
				device.polling_info[key].dv_value = ((settings.SPEED_SP/settings.SPEED_MAX)*settings.OV1_SS)+(settings.CONST*Math.random())+0.1;
				algorithm = '((SPEED_SP/SPEED_MAX)*OV1_SS)+(CONST*Math.random())+0.1';
			}else if(device.polling_info[key].dv_value=='Peakvue 1'){
				device.polling_info[key].dv_value = ((settings.SPEED_SP/settings.SPEED_MAX)*settings.PKV1_SS)+(settings.CONST*Math.random())+0.1;
				algorithm = '((SPEED_SP/SPEED_MAX)*PKV1_SS)+(CONST*Math.random())+0.1';
			}
			else if(device.polling_info[key].dv_value=='Vibration 2'){
				device.polling_info[key].dv_value = ((settings.SPEED_SP/settings.SPEED_MAX)*settings.OV2_SS)+(settings.CONST*Math.random())+0.1;
				algorithm = '((SPEED_SP/SPEED_MAX)*OV2_SS)+(CONST*Math.random())+0.1';
			}
			else if(device.polling_info[key].dv_value=='Peakvue 2'){
				device.polling_info[key].dv_value = ((settings.SPEED_SP/settings.SPEED_MAX)*settings.PKV2_SS)+(settings.CONST*Math.random())+0.1;
				algorithm = '((SPEED_SP/SPEED_MAX)*PKV2_SS)+(CONST*Math.random())+0.1';
			}
			else if(device.polling_info[key].dv_value=='Discharge P'){
				device.polling_info[key].dv_value = ((settings.SPEED_SP/settings.SPEED_MAX)*settings.DISCH_P_SS)+(settings.CONST*Math.random())+0.1;
				algorithm = '((SPEED_SP/SPEED_MAX)*DISCH_P_SS)+(CONST*Math.random())+0.1';
			}
			else if(device.polling_info[key].dv_value=='Flow'){
				device.polling_info[key].dv_value = ((settings.SPEED_SP/settings.SPEED_MAX)*settings.FLOW_SS)+(settings.CONST*Math.random())+0.1;
				algorithm = '((SPEED_SP/SPEED_MAX)*FLOW_SS)+(CONST*Math.random())+0.1';
			}
			else if(device.polling_info[key].dv_value=='Suction P'){
				device.polling_info[key].dv_value = settings.SUCT_P_SS + (settings.CONST*Math.random());
				algorithm = '(SUCT_P_SS)+(CONST*Math.random())+0.1';
			}
			else if(device.polling_info[key].dv_value=='Strainer dP'){
				device.polling_info[key].dv_value = settings.STR_DP_SS + (settings.CONST*Math.random());
				algorithm = '(STR_DP_SS)+(CONST*Math.random())+0.1';
			}
			else if(device.polling_info[key].dv_value=='Seal Level'){
				device.polling_info[key].dv_value = settings.SEAL_L_SS + (settings.CONST*Math.random());
				algorithm = '(SEAL_L_SS)+(CONST*Math.random())+0.1';
			}
			else if(device.polling_info[key].dv_value=='Seal Pressure'){
				device.polling_info[key].dv_value = settings.SEAL_P_SS + (settings.CONST*Math.random());
				algorithm = '(SEAL_P_SS)+(CONST*Math.random())+0.1';
			}
			else if(device.polling_info[key].dv_value=='Bear Temp 1'){
				device.polling_info[key].dv_value = settings.BEAR1_T_SS + (settings.CONST*Math.random());
				algorithm = '(BEAR1_T_SS)+(CONST*Math.random())+0.1';
			}
			else if(device.polling_info[key].dv_value=='Bear Temp 2'){
				device.polling_info[key].dv_value = settings.BEAR2_T_SS + (settings.CONST*Math.random());
				algorithm = '(BEAR2_T_SS)+(CONST*Math.random())+0.1';
			}
			
			//Heatexchanger
			else if(device.polling_info[key].dv_value=='Hot Side Flow'){
				device.polling_info[key].dv_value = settings.FLOW_H_SS + (settings.CONST*Math.random());
				algorithm = '(FLOW_H_SS)+(CONST*Math.random())+0.1';
			}
			else if(device.polling_info[key].dv_value=='Hot Side Inlet Temp'){
				device.polling_info[key].dv_value = settings.TEMP_H_I_SS + (settings.CONST*Math.random());
				algorithm = '(TEMP_H_I_SS)+(CONST*Math.random())+0.1';
			}
			else if(device.polling_info[key].dv_value=='Hot Side Outlet Temp'){
				device.polling_info[key].dv_value = settings.TEMP_H_O_SS + (settings.CONST*Math.random());
				algorithm = '(TEMP_H_O_SS)+(CONST*Math.random())+0.1';
			}
			else if(device.polling_info[key].dv_value=='Hot Side Pressure'){
				device.polling_info[key].dv_value = settings.DP_H_SS + (settings.CONST*Math.random());
				algorithm = '(DP_H_SS)+(CONST*Math.random())+0.1';
			}
			else if(device.polling_info[key].dv_value=='Cold Side Fow'){
				device.polling_info[key].dv_value = settings.FLOW_C_SS + (settings.CONST*Math.random());
				algorithm = '(FLOW_C_SS)+(CONST*Math.random())+0.1';
			}
			else if(device.polling_info[key].dv_value=='Cold Side Inlet Temp'){
				device.polling_info[key].dv_value = settings.TEMP_C_I_SS + (settings.CONST*Math.random());
				algorithm = '(TEMP_C_I_SS)+(CONST*Math.random())+0.1';
			}
			else if(device.polling_info[key].dv_value=='Cold Side Outlet Temp'){
				device.polling_info[key].dv_value = settings.TEMP_C_O_SS + (settings.CONST*Math.random());
				algorithm = '(TEMP_C_O_SS)+(CONST*Math.random())+0.1';
			}
			else if(device.polling_info[key].dv_value=='Cold Side Pressure'){
				device.polling_info[key].dv_value = settings.DP_C_SS + (settings.CONST*Math.random());
				algorithm = '(DP_C_SS)+(CONST*Math.random())+0.1';
			}
			
			log_object.variable = key;
			log_object.value = device.polling_info[key].dv_value;
			log_object.value_description = device.polling_info[key].dv_value_description;
			
			log_string = 	key + ' ' + 
							device.polling_info[key].dv_value_description + ' ' + 
							' Status: ' + device.polling_info[key].dv_status + 
							' Value: ' + device.polling_info[key].dv_value + ' ' + 
							' Date: ' + new Date() ;

			self.log.push({value:log_string, algorithm: algorithm});
			//device.polling_info[key].dv_value = 'My new calculated value for '+key;
			delete device.polling_info[key].active;
			data.process_data.push(device.polling_info[key]);
		}
	});
	this.data.diagnostics = {  
		"basic_status":"0x00",
		"extended_status":"0x00",
		"standardized_status":"0x00",
		"diag_data":"0x8772f1a000",
		"diag_TS":1488224618000
	}
}

module.exports = dbModule; 