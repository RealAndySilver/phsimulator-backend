/**
 * @assetconfig.js 
 * File dedicated to manage assetconfig persistance.
 * Author: Andrés Abril
 * © 2016, Emerson Electric Co
 */

//////////////////////////
///// Dependencies ///////
//////////////////////////
var fs = require("fs");
var file = "./data/globalsettings.db";
var exists = fs.existsSync(file);
var dblite = require("dblite");
//var config = require('./config');
var dataHelper = require('./datahelper');
var common = require('./common');
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
var table_name = 'GlobalSettings';//<<<<<<<<<<<<< ////
// This variable defines the creation of the table  //
// and tells datahelper class where to do the query //
//////////////////////////////////////////////////////

// This object will help to parse the data comming from the database into a familiar js type
// Needs to be in the exact order
var dataParseDesc = {
	id : Number,
	active : Number,
	data : JSON.parse
};
////////////////////
////End of Vars ////
////////////////////


//This snippet creates a database file if it doesn't exist
if(!exists){
	console.log("Creating DB file from globalsettings.");
	fs.openSync(file, "w");
}

//Starts the database and initializes it into the db variable
db = dblite(file);

//For each field in the table we push the individual query in an array.
//This will make the creation of new fields easier and more readable
var tableArray = [];

tableArray.push('id INTEGER PRIMARY KEY UNIQUE NOT NULL');
tableArray.push('active INTEGER'); // active
tableArray.push('data TEXT'); // data

var list =  common.list();


//This snippet creates the Table if it doesn't exist yet
dataHelper.newTable(db, table_name,tableArray,0, function(){
	createDefaults(0);
});

//db.query("DROP TABLE "+table_name);
//Temporary snippet ---> this code must be optimized and all queries must move to
//data helper class, but needs to be done carefully and consistent
/////////////////////////////////////////////////////////////////////////////////////
/////// Recursive function to check config file app list and create defaults ////////
/////////////////////////////////////////////////////////////////////////////////////
//******* This code will only be executed once everytime the server starts ********//
/////////////////////////////////////////////////////////////////////////////////////
// Params for createDefaults ////////////////////////////////////////////////////////
//***********************************************************************************
//*i -> Number: iteration count *****************************************************
//***********************************************************************************
/////////////////////////////////////////////////////////////////////////////////////
var createDefaults = function(i){
	//If the iteration count is greater than the size of the config.apps array we stop the function
	if(i>=list.length){
		//Get settings from database and asign them to a public variable
		//syncSettings(0);
		return;
	}
	//First we try to find any existing Global Settings for this app using the id from the config file
	db.query("SELECT * FROM "+table_name+" WHERE id = ?", 
	[list[i].id],
	dataParseDesc,
	function(err, row) {
		//console.log('Attempting to create', apps_list[i].name);
		if(err){
			console.log('Error',err.toString());
			return;
		}
		if(!row.length){
			//Global Settings data for this app doesn't exist, so we create one based on the config file data
			//console.log('Config doesn\'t exist for ', config.apps[i].name);
			//console.log('I will try to create it..');
			db.query("INSERT INTO "+table_name+" VALUES (:id, :active, :data)", 
			{
				id : list[i].id,
				active : list[i].active,
				data : JSON.stringify(list[i].data)
			},
			function(err,data){
				if(err){
					//console.log('Error creating app -> ', apps_list[i].name);
				}
				else{
					//Select the data from the table. Just for testing purposes.
/*
					db.query("SELECT * FROM "+table_name+" WHERE id = ?",
					[apps_list[i].id],
					dataParseDesc,
					function(err, new_row){
						if(new_row.length){
							console.log('Global settings and '+ apps_list[i].name +'Inserted successfully: ',new_row);
						}
					});
*/
					//console.log('App created', apps_list[i].name);
				}
			});
		}
		else{
			//Global Settings for this app already exist
			//console.log('App already exist: ',apps_list[i].name);
		}
		createDefaults(i+1);
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// End of createDefaults ///////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTION FOR GETTING GLOBAL SETTINGS BY ID /////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for getGlobalSettingsByID ////////////////////////////////////////////////
//**********************************************************************************
//*id -> Number: Positive integer **************************************************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dbModule.getGlobalSettingsByID = function(id, callback){
	//Check if id exists as a parameter
	if(!id){
		callback({error:'No ID specified.', code:422}, null);
		return;
	}
	dataHelper.getByID(db,id,table_name,dataParseDesc,callback);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// End of getGlobalSettingsByID  ///////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// MAIN FUNCTION FOR GLOBAL SETTINGS UPDATE ///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Params for updateUserWithID /////////////////////////////////////////////////////
//**********************************************************************************
//*id -> Number: Positive integer **************************************************
//*settingsObj -> Object: javascript object with multiple params *******************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dbModule.updateGlobalSettingsByID = function(id,data,callback){
	dataHelper.updateByID(db,id,table_name,['active=:active','data=:data'],{
		id:id,
		active:data.active,
		data:JSON.stringify(data.data)
	},dataParseDesc,function(err, response){
		if(err){
			callback(err,null);
			return;
		}		
		callback(null,response);
		return;
	});
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// End of updateUserWithID /////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// FUNCTION FOR RESETING GLOBAL SETTINGS BY ID ////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for resetGlobalSettingsToDefaultByID /////////////////////////////////////
//**********************************************************************************
//*id -> Number: Positive integer **************************************************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dbModule.resetGlobalSettingsToDefaultByID = function(id, callback){
	var configs = [];
	//Check if id exists as a parameter
	if(!id){
		callback({error:'No id specified.', code:422}, null);
		return;
	}

	configs = list.filter(function(current_config){
		return current_config.id == id;
	});
	
	if(configs.length < 1){
		callback({error:'Wrong App id: '+id, code:404}, null);
		return;
	}
	dbModule.updateGlobalSettingsByID(id, configs[0], callback);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// End of resetGlobalSettingsToDefaultByID /////////////////////////////////////
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
dbModule.toggleMasterSwitch = function(settings_id,toggle_value,callback){
	dataHelper.updateByID(db,settings_id,table_name,['active=:active'],{
		active:toggle_value
	},dataParseDesc,function(err, response){
		if(err){
			callback(err,null);
			return;
		}		
		callback(null,response);
		return;
	});
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// End of updateDeviceByTag ////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = dbModule; 