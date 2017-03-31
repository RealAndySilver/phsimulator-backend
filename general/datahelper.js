/**
 * @datahelper.js 
 * File dedicated to manage db queries easier.
 * Author: Andrés Abril
 * © 2016, Emerson Electric Co
 */
 
////////////////////
/////// Vars ///////
//*avoid hoisting*//
////////////////////
 
var dataHelper = {};

////////////////////
////End of Vars ////
////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// CREATE TABLE FUNCTION  /////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for insert ///////////////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*table_name -> String: Name of the table *****************************************
//*fields_array -> Array: String array with field names ****************************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.newTable = function(db, table_name, fields_array, timeout,callback){
	db.ignoreErrors = true;
	// Create table using IF NOT EXISTS
	// Insert in an array the table schema: 'ID INTEGER PRIMARY KEY UNIQUE NOT NULL'
	setTimeout(function(){
		db.query("CREATE TABLE IF NOT EXISTS "+table_name+" (" +fields_array.join(',')+ ")", function(){
			callback ? callback():null;
		});
	}, timeout || 0);
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// End CREATE TABLE //////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////////
// INSERT FUNCTION  ///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for insert ///////////////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*table_name -> String: Name of the table *****************************************
//*values -> Array: String array with field names **********************************
//*objectToStore -> Object: javascript object with data to be stored ***************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.insert = function(db, table_name, values, objectToStore, callback){
	db.ignoreErrors = true;
	// Create the query with the data that is going to be inserted
	// i.e INSERT INTO Table VALUES (:name,:date,:description), objectToStore -> {name:'my name', date:'2016-04-25', description:'I am a description'}
	
	db.query("INSERT INTO "+ table_name +" VALUES ("+values.join(',')+")", objectToStore, 
	function(err, data){
		if(err){
			callback({status:false, error: err.toString(), code:409}, null);
		}
		else{
			callback(null,{message:table_name+' inserted successfully'});
		}
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// End of insert /////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// LIST FUNCTION  /////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for list /////////////////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*table_name -> String: Name of the table *****************************************
//*order -> String: should be ASC or DESC ******************************************
//*limit -> Number: should be a positive number from 1 to 2500  ********************
//*dataParseDesc -> Object: object containing data structure of the table **********
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.list = function(db, table_name, order, limit, dataParseDesc, callback){
	db.ignoreErrors = true;
	// Create the query with the data that is going to be selected
	// The query receives an array as a parameter.
	// We inject 'order' literaly because it doesn't work as a parameter for this query
	
	db.query("SELECT * FROM "+ table_name +" ORDER BY rowid "+order+"  LIMIT ?", 
	[limit],
	dataParseDesc,
	function(err, rows) {
		if(err){
			callback({status:false, error: err, code:500},null);
			return;
		}
		else{
			if(!rows.length){
				callback({status:false, error: 'No '+table_name+'s found.', code:404},null);
				return;
			}
			//Send result to the requester
			callback(null,{message:table_name+'s listed.',data:rows, info: {order:order, limit:limit, count:rows.length}});
		}
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// End of list ///////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// LIST FUNCTION  /////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for list /////////////////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*table_name -> String: Name of the table *****************************************
//*fields -> String: Name of the fields to do the query ****************************
//*order -> String: should be ASC or DESC ******************************************
//*limit -> Number: should be a positive number from 1 to 2500  ********************
//*dataParseDesc -> Object: object containing data structure of the table **********
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.lightList = function(db, table_name, fields,order, limit, dataParseDesc, callback){
	db.ignoreErrors = true;
	// Create the query with the data that is going to be selected
	// The query receives an array as a parameter.
	// We inject 'order' literaly because it doesn't work as a parameter for this query
	
	db.query("SELECT "+fields+" FROM "+ table_name +" ORDER BY rowid "+order+"  LIMIT ?", 
	[limit],
	dataParseDesc,
	function(err, rows) {
		if(err){
			callback({status:false, error: err, code:500},null);
			return;
		}
		else{
			if(!rows.length){
				callback({status:false, error: 'No '+table_name+'s found.', code:404},null);
				return;
			}
			//Send result to the requester
			callback(null,{message:table_name+'s listed.',data:rows, info: {order:order, limit:limit, count:rows.length}});
		}
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// End of list ///////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// LIST WITH PARAM FUNCTION  //////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for list with param //////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*table_name -> String: Name of the table *****************************************
//*param -> String: Value for the search *******************************************
//*param_name -> String: params name ***********************************************
//*order -> String: should be ASC or DESC ******************************************
//*limit -> Number: should be a positive number from 1 to 2500  ********************
//*dataParseDesc -> Object: object containing data structure of the table **********
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.listByParam = function(db, table_name, param, param_name, order, limit, dataParseDesc, callback){
	db.ignoreErrors = true;
	// Create the query with the data that is going to be selected
	// We inject 'order' literaly because it doesn't work as a parameter for this query
	
	db.query("SELECT * FROM "+ table_name +" WHERE "+param_name+" = ? ORDER BY id "+order+"  LIMIT ?", 
	[param,limit],
	dataParseDesc,
	function(err, rows) {
		if(err){
			callback({status:false, error: err, code:500},null);
			return;
		}
		else{
			if(!rows.length){
				callback({status:false, error: 'No '+table_name+'s found.', code:404},null);
				return;
			}
			//Send result to the requester
			callback(null,{message:table_name+'s listed.',data:rows, info: {order:order, limit:limit, count:rows.length}});
		}
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// End of list ///////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// LIST WITH PARAM FUNCTION  //////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for list with param //////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*table_name -> String: Name of the table *****************************************
//*param -> String: Value for the search *******************************************
//*param_name -> String: params name ***********************************************
//*order -> String: should be ASC or DESC ******************************************
//*limit -> Number: should be a positive number from 1 to 2500  ********************
//*dataParseDesc -> Object: object containing data structure of the table **********
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.listByConditions = function(db, table_name, condition, order, limit, dataParseDesc, callback){
	db.ignoreErrors = true;
	// Create the query with the data that is going to be selected
	// We inject 'order' literaly because it doesn't work as a parameter for this query
	db.query("SELECT * FROM "+ table_name +" WHERE "+condition.query+" ORDER BY id "+order+"  LIMIT "+limit, 
	condition.data,
	dataParseDesc,
	function(err, rows) {
		if(err){
			callback({status:false, error: err, code:500},null);
			return;
		}
		else{
			if(!rows.length){
				callback({status:false, error: 'No '+table_name+'s found.', code:404},null);
				return;
			}
			//Send result to the requester
			callback(null,{message:table_name+'s listed.',data:rows, info: {order:order, limit:limit, count:rows.length}});
		}
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// End of list ///////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// LIST BY PARAM LIST FUNCTION  ////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for listByParamList ///////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*param_name -> String: params name ***********************************************
//*list -> String Array ************************************************************
//*table_name -> String: Name of the table *****************************************
//*dataParseDesc -> Object: object containing data structure of the table **********
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.listByParamList = function(db, table_name, list, param_name, order, limit, dataParseDesc, callback){
	db.ignoreErrors = true;
	// Create the query with the data that is going to be selected
	// The query receives an array as a parameter.
	var parsed_list = [];
	//Add ' ' around each item, otherwise it won't work with the database
	list.forEach(function(item){
		parsed_list.push("'"+item+"'");
	});
	db.query("SELECT * FROM "+ table_name +" WHERE " + param_name + " IN ("+parsed_list.join(',')+") ORDER BY id "+order+"  LIMIT ?", 
	[limit],
	dataParseDesc,
	function(err, rows) {
		if(err){
			callback({status:false, error: err, code:500},null);
			return;
		}
		else{
			if(!rows.length){
				callback({status:false, error: 'No '+table_name+'s found.', code:404},null);
				return;
			}
			//Send result to the requester
			callback(null,{message:table_name+'s listed.',data:rows, info: {order:order, limit:limit, count:rows.length}});
		}
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// End of listByParamList ///////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// GETBYID FUNCTION  //////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for getByID //////////////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*id -> Number: Positive integer **************************************************
//*table_name -> String: Name of the table *****************************************
//*dataParseDesc -> Object: object containing data structure of the table **********
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.getByID = function(db, id, table_name, dataParseDesc, callback){
	db.ignoreErrors = true;
	// Create the query with the data that is going to be selected
	// The query receives an array as a parameter.
	
	db.query("SELECT * FROM "+ table_name +" WHERE id = ?", 
	[id],
	dataParseDesc,
	function(err, row) {
		//console.log(row);
		if(!row || !row.length){
			callback({status:false, error: 'No results for ID '+id, code:404},null);
			return;
		}
		//Send result to the requester
		callback(null,{message:table_name+' found.', data:row[0]});
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// End of getByID ////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// GETBYIDLIST FUNCTION  //////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for getByIDList //////////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*ids -> Array: Positive integer Array ********************************************
//*table_name -> String: Name of the table *****************************************
//*dataParseDesc -> Object: object containing data structure of the table **********
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.getByIDList = function(db, ids, table_name, dataParseDesc, callback){
	db.ignoreErrors = true;
	// Create the query with the data that is going to be selected
	// The query receives an array as a parameter.
	
	db.query("SELECT * FROM "+ table_name +" WHERE id IN ("+ids.join(',')+")", 
	dataParseDesc,
	function(err, row) {
		//console.log(row);
		if(!row.length){
			callback({status:false, error: 'No results for ID '+ids, code:404},null);
			return;
		}
		//Send result to the requester
		callback(null,{message:table_name+' found.', data:row[0]});
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// End of getByID ////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// DELETEBYID FUNCTION  ///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for deleteByID ///////////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*id -> Number: Positive integer **************************************************
//*table_name -> String: Name of the table *****************************************
//*dataParseDesc -> Object: object containing data structure of the table **********
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.deleteByID = function(db, id, table_name, dataParseDesc, callback){
	db.ignoreErrors = true;
	//First we verify if the object exists using the local getByID function
	dataHelper.getByID(db, id, table_name, dataParseDesc, function(err,data){
		if(err){
			callback(err,null);
		}
		else{
			// Create the query with the data that is going to be deleted
			// The query receives an array as a parameter.
			db.query("DELETE FROM "+ table_name +" WHERE id = ?", 
			[id],
			function() {
				callback(null,{message:table_name+' with ID: '+id+' deleted successfully.', data:null});
			});
		}
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// End of deleteByID /////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// DELETE WITH CONDITIONS FUNCTION  ///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for deleteWithConditions /////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*table_name -> String: Name of the table *****************************************
//*condition -> Object: .query and .data *******************************************
//*dataParseDesc -> Object: object containing data structure of the table **********
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.deleteWithConditions = function(db, table_name, conditions, callback){
	db.ignoreErrors = true;
	db.query("DELETE FROM "+ table_name +" WHERE "+conditions.query, 
	conditions.data,
	function() {
		callback(null,{message:table_name+' row(s) deleted successfully.', data:null});
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// End of deleteWithConditions ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// DELETEBYIDLIST FUNCTION  ///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for deleteByIDList ///////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*ids -> Array: Positive integer Array ********************************************
//*table_name -> String: Name of the table *****************************************
//*dataParseDesc -> Object: object containing data structure of the table **********
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.deleteByIDList = function(db, ids, table_name, dataParseDesc, callback){
	db.ignoreErrors = true;
	//First we verify if the object exists using the local getByID function
	dataHelper.getByIDList(db, ids, table_name, dataParseDesc, function(err,data){
		if(err){
			callback(err,null);
		}
		else{
			// Create the query with the data that is going to be deleted
			// The query receives an array as a parameter.
			db.query("DELETE FROM "+ table_name +" WHERE id IN ("+ids.join(',')+")", 
			function() {
				callback(null,{message:table_name+' with IDs: '+ids.join(',')+' deleted successfully.', data:null});
			});
		}
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// End of deleteByIDList /////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// UPDATEBYID FUNCTION  ///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for updateByID ///////////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*id -> Number: Positive integer **************************************************
//*table_name -> String: Name of the table *****************************************
//*set_values -> Array: String array with field names using 'name=:name' syntax ****
//*valueObject -> Object: javascript object with data to be stored *****************
//*dataParseDesc -> Object: object containing data structure of the table **********
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.updateByID = function(db, id, table_name, set_values, valueObject, dataParseDesc, callback){
	db.ignoreErrors = true;
	// Create the query with the data that is going to be updated
	// The query receives an array as a parameter.
	// To build the query dinamically we will inject it as literal and build it using javascript validation
	db.query("UPDATE "+ table_name +" SET "+set_values.join(',')+" WHERE id ="+id+"", valueObject, 
	function(err,data){
		if(err){
			callback({status:false, error: err.toString(), code:409},null);
		}
		else{
			//After updating, get the object using the local getByID function
			dataHelper.getByID(db, id, table_name, dataParseDesc, function(err,data){
				if(err){
					callback(err,null);
				}
				else{
					//Send result to the requester
					callback(null,{message:table_name+' Updated', data:data.data});
				}
			});
		}
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// End of updateByID /////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////
// Methods that won't use ID as param ///////
/////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// GETBYPARAM FUNCTION  ///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for getByParam ///////////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*param -> String: i.e email@email.co *********************************************
//*param_name -> String: Name of the field to do the search ************************
//*table_name -> String: Name of the table *****************************************
//*dataParseDesc -> Object: object containing data structure of the table **********
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.getByParam = function(db, param, param_name, table_name, dataParseDesc, callback){
	db.ignoreErrors = true;
	// Create the query with the data that is going to be selected
	// The query receives an array as a parameter, and we insert 'param' as the only parameter.
	// We inject the 'param_name' in the query to make the method more global
	
	db.query("SELECT * FROM "+ table_name +" WHERE "+param_name+" = ?", 
	[param],
	dataParseDesc,
	function(err, row) {
		//console.log(row);
		if(err){
			console.log('Internal error', param);
			callback({status:false, error: 'Error getting data '+param_name+' '+param, code:404},null);
			return;
		}
		if(!row.length){
			callback({status:false, error: 'No results for '+param_name+' '+param, code:404},null);
			return;
		}
		//Send result to the requester
		callback(null,{message:table_name+' found.', data:row[0]});
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// End of getByParam /////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// DELETEBYPARAM FUNCTION  ////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for deleteByParam ////////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*param -> String: i.e email@email.co *********************************************
//*param_name -> String: Name of the field to do the search ************************
//*table_name -> String: Name of the table *****************************************
//*dataParseDesc -> Object: object containing data structure of the table **********
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.deleteByParam = function(db, param, param_name, table_name, dataParseDesc, callback){
	db.ignoreErrors = true;
	//First we verify if the object exists using the local getByID function
	dataHelper.getByParam(db, param, param_name, table_name, dataParseDesc, function(err,data){
		if(err){
			callback(err,null);
		}
		else{
			// Create the query with the data that is going to be deleted
			// The query receives an array as a parameter.
			db.query("DELETE FROM "+ table_name +" WHERE "+param_name+" = ?", 
			[param],
			function() {
				callback(null,{message:table_name+' with '+param_name+': '+param+' deleted successfully.', data:data});
			});
		}
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// End of deleteByParam //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// UPDATEBYPARAM FUNCTION  ////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for updateByParam ////////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*param -> String: i.e email@email.co *********************************************
//*param_name -> String: Name of the field to do the search ************************
//*table_name -> String: Name of the table *****************************************
//*set_values -> Array: String array with field names using 'name=:name' syntax ****
//*valueObject -> Object: javascript object with data to be stored *****************
//*dataParseDesc -> Object: object containing data structure of the table **********
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.updateByParam = function(db, param, param_name, table_name, set_values, valueObject, dataParseDesc, callback){
	db.ignoreErrors = true;
	// Create the query with the data that is going to be updated
	// The query receives an array as a parameter.
	// To build the query dinamically we will inject it as literal and build it using javascript validation
	db.query("UPDATE "+ table_name +" SET "+set_values.join(',')+" WHERE "+param_name+" =:"+param_name+"", valueObject, 
	function(err,data){
		if(err){
			callback({status:false, error: err.toString(), code:409},null);
		}
		else{
			
			//After updating, get the object using the local getByID function
			dataHelper.getByParam(db, param, param_name, table_name, dataParseDesc, function(err,data){
				if(err){
					callback(err,null);
				}
				else{
					//Send result to the requester
					callback(null,{message:table_name+' Updated', data:data.data});
				}
			});
		}
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// End of updateByParam ////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// BATCH INSTERT FUNCTION  ////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
// Params for batchInsert ////////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*table_name -> String: Name of the table *****************************************
//*values -> Array: String array with field names using 'name=:name' syntax ********
//*objectsToStoreArray -> Array: array of javascript objects with data to be stored*
//*dataParseDesc -> Object: object containing data structure of the table **********
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.batchInsert = function(db, table_name, values, objectsToStoreArray, callback){
	db.ignoreErrors = true;
	db.query('BEGIN TRANSACTION');
		for(var i = 0; i < objectsToStoreArray.length; i++) {
			db.query('INSERT INTO ' + table_name + ' VALUES ('+values.join(',')+')', objectsToStoreArray[i]);
		}
	db.query('COMMIT', function(err,res){
		callback(err,res);
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// End of batchInsert //////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// BATCH UPDATE FUNCTION  /////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
// Params for batchUpdate ////////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*table_name -> String: Name of the table *****************************************
//*set_array -> Array: .query (property=:property) .condition (smtn='smtn') .data **
//*dataParseDesc -> Object: object containing data structure of the table **********
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.batchUpdate = function(db, table_name, set_array, callback){
	db.ignoreErrors = true;
	db.query('BEGIN TRANSACTION');
		for(var i = 0; i < set_array.length; i++) {
			//console.log("UPDATE "+ table_name +" SET "+set_array[i].query.join(',')+" WHERE "+set_array[i].conditions , set_array[i]);
			db.query("UPDATE "+ table_name +" SET "+set_array[i].query.join(',')+" WHERE "+set_array[i].conditions , set_array[i]);
		}
	db.query('COMMIT', function(err,res){
		callback(err,res);
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// End of batchUpdate //////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// UPDATEBYPARAM FUNCTION  ////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for updateByParamNoReturn ////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*param -> String: i.e email@email.co *********************************************
//*param_name -> String: Name of the field to do the search ************************
//*table_name -> String: Name of the table *****************************************
//*set_values -> Array: String array with field names using 'name=:name' syntax ****
//*valueObject -> Object: javascript object with data to be stored *****************
//*dataParseDesc -> Object: object containing data structure of the table **********
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.updateByParamNoReturn = function(db, param, param_name, table_name, set_values, valueObject, dataParseDesc, callback){
	db.ignoreErrors = true;
	// Create the query with the data that is going to be updated
	// The query receives an array as a parameter.
	// To build the query dinamically we will inject it as literal and build it using javascript validation
	//This function is faster than updateByParam since is not returning the final data
	db.query("UPDATE "+ table_name +" SET "+set_values.join(',')+" WHERE "+param_name+" =:"+param_name+"", valueObject, 
	function(err,data){
		if(err){
			callback({status:false, error: err.toString(), code:409},null);
		}
		else{
			callback(null,{message:table_name+' Updated'});
		}
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// End of updateByParamNoReturn /////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// UPDATEALL FUNCTION  ////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for updateAll ////////////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*table_name -> String: Name of the table *****************************************
//*set_values -> Array: String array with field names using 'name=:name' syntax ****
//*conditions -> Array: String array with field names using 'name=name' syntax *****
//*valueObject -> Object: javascript object with data to be stored *****************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.updateAll = function(db, table_name, set_values, conditions, valueObject, callback){
	db.ignoreErrors = true;
	// Create the query with the data that is going to be updated
	// The query receives an object as a parameter.
	// To build the query dinamically we will inject it as literal and build it using javascript validation
	db.query("UPDATE "+ table_name +" SET "+set_values.join(',')+" WHERE "+ conditions.join(','), valueObject, 
	function(err,data){
		if(err){
			callback({status:false, error: err.toString(), code:409},null);
		}
		else{
			callback(null,{message:table_name+' Updated', data:data});
		}
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// End of updateAll ////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// UPDATE NOT IN LIST FUNCTION  ///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for updateNotInList //////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*table_name -> String: Name of the table *****************************************
//*set_values -> Array: String array with field names using 'name=:name' syntax ****
//*conditions -> Array: String array with field names using 'name=name' syntax *****
//*list -> String: String comma separated for NOT IN condition *********************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.updateNotInList = function(db, table_name, set_values, valueObject, callback){
	db.ignoreErrors = true;
	// Create the query with the data that is going to be updated
	// The query receives an object as a parameter.
	// To build the query dinamically we will inject it as literal and build it using javascript validation
	db.query("UPDATE "+ table_name +" SET "+set_values.join(',')+" WHERE "+ valueObject.condition1 +" NOT IN ("+valueObject.list+") "+valueObject.condition2, valueObject, 
	function(err,data){
		if(err){
			callback({status:false, error: err.toString(), code:409},null);
		}
		else{
			callback(null,{message:table_name+' Updated', data:data});
		}
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// End of updateNotInList //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// UPDATE IN LIST FUNCTION  ///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for updateInList /////////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*table_name -> String: Name of the table *****************************************
//*set_values -> Array: String array with field names using 'name=:name' syntax ****
//*conditions -> Array: String array with field names using 'name=name' syntax *****
//*list -> String: String comma separated for NOT IN condition *********************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.updateInList = function(db, table_name, set_values, valueObject, callback){
	db.ignoreErrors = true;
	// Create the query with the data that is going to be updated
	// The query receives an object as a parameter.
	// To build the query dinamically we will inject it as literal and build it using javascript validation
	db.query("UPDATE "+ table_name +" SET "+set_values.join(',')+" WHERE "+ valueObject.condition1 +" IN ("+valueObject.list+") "+valueObject.condition2, valueObject, 
	function(err,data){
		if(err){
			callback({status:false, error: err.toString(), code:409},null);
		}
		else{
			callback(null,{message:table_name+' Updated', data:data});
		}
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// End of updateInList /////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// GETBETWEENDATES FUNCTION  //////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for getBetweenDates //////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*param -> String: i.e email@email.co *********************************************
//*param_name -> String: Name of the field to do the search ************************
//*table_name -> String: Name of the table *****************************************
//*dataParseDesc -> Object: object containing data structure of the table **********
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.getBetweenDates = function(db, table_name, date1, date2, limit, dataParseDesc, callback){
	db.ignoreErrors = true;
	// Create the query with the data that is going to be selected
	// The query receives an array as a parameter, and we insert 'param' as the only parameter.
	// We inject the 'param_name' in the query to make the method more global
	
	db.query("SELECT * FROM "+table_name+" WHERE date BETWEEN ? AND ? LIMIT ?", [date1, date2,limit],
	dataParseDesc,
	function(err, rows) {
		if(err){
			callback({status:false, error: err, code:500},null);
			return;
		}
		else{
			if(!rows.length){
				callback({status:false, error: 'No Data found.', code:404},null);
				return;
			}
			//Send result to the requester
			callback(null,{data:rows, info:{count:rows.length,limit:limit, start:date1, end:date2 }});
		}
	});	
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// End of getBetweenDates ////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// COUNT FUNCTION  //////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for count ////////////////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*table_name -> String: Name of the table *****************************************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.count = function(db, table_name, callback){
	db.ignoreErrors = true;
	// The query receives table_name as a parameter.
	
	db.query("SELECT COUNT(*) FROM "+ table_name , 
	function(err, row) {
		if(!row.length){
			callback({status:false, error: 'No results ', code:404},null);
			return;
		}
		//Send count number to the requester
		callback(null,{message:row+' total results found in '+table_name+' table.', count:row});
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// End of count //////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// COUNT WITH PARAM FUNCTION  /////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for countWithParam ///////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*table_name -> String: Name of the table *****************************************
//*param_name -> String: Name of the field to do the search ************************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.countWithParam = function(db, table_name, param, param_name, callback){
	db.ignoreErrors = true;
	// The query receives table_name as a parameter.
	
	db.query("SELECT COUNT(*) FROM "+ table_name +" WHERE "+param_name+" = ?",
	[param], 
	function(err, row) {
		if(!row.length){
			callback({status:false, error: 'No results ', code:404},null);
			return;
		}
		//Send count number to the requester
		callback(null,{message:row+' total results found in '+table_name+' table.', count:row});
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// End of countWithParam /////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// DELETE X ROWS FROM TABLE FUNCTION  /////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for deleteXRowsFromTable ///////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*table_name -> String: Name of the table *****************************************
//*param -> String: Value of the field to do the search ****************************
//*param_name -> String: Name of the field to do the search ************************
//*callback -> Function: callback function where the response is going to be sent **
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.deleteXRowsFromTable = function(db,table_name,param,param_name,size_limit){
	// The query receives table_name and param_name as a parameter.
	// Limit and Offset will define the max size
	db.query("DELETE FROM "+table_name+" WHERE rowid IN (SELECT rowid FROM "+table_name+" WHERE "+param_name+"=? ORDER BY date DESC LIMIT ? OFFSET ?)",
	[param,size_limit,size_limit],
	function(err){
		if(err)
			console.log('Error deleting default ',err);
		else{
			//console.log('Success');
		}
	});
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// End of deleteXRowsFromTable ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////////////////////////////////
// INNER JOIN FUNCTION  ///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
// Params for outerJoin ////////////////////////////////////////////////////////////
//**********************************************************************************
//*db -> Object: must be a db object created from the requester ********************
//*select -> String: SELECT statement literal **************************************
//*table_name1 -> String: Name of the table1 ***************************************
//*table_name2 -> String: Name of the table2 ***************************************
//*condition1 -> String: table1 join condition *************************************
//*condition2 -> String: table2 join condition *************************************
//*where -> String: WHERE condition variable = 'value' *****************************
//*dataParseDesc -> Object: object containing data structure of the table **********
//**********************************************************************************
////////////////////////////////////////////////////////////////////////////////////
dataHelper.innerJoin = function(db, select, table_name1, table_name2, condition1, condition2, where, dataParseDesc, callback){
	db.ignoreErrors = true;
	// The query receives table_name as a parameter.
	var query = "SELECT " + select + 
				" FROM " + table_name1 + 
				" INNER JOIN "+ table_name2 + 
				" ON " + table_name1 + "." + condition1 + " = " + table_name2 + "." + condition2 +
				" "+where;
				console.log(query);
	db.query(query,dataParseDesc, 
	function(err, row) {
		if(!row.length){
			callback({status:false, error: 'No results ', code:404},null);
			return;
		}
		//Send count number to the requester
		callback(null,{data:row});
	});
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// End of count //////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// SELECT FUNCTION  ///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
// Params for select /////////////////////////////////////////////////////////////////
// *** JUST FOR WPG *** DO NOT USE IN ANY OTHER APP *** //////////////////////////////
//************************************************************************************
//************************************************************************************
//*db -> Object: must be a db object created from the requester **********************
//*select -> String: query statement *************************************************
//*params -> Array Object ************************************************************
//*dataParseDesc -> Object: object containing data structure of the table ************
//*callback -> Function: callback function where the response is going to be sent ****
//************************************************************************************
//////////////////////////////////////////////////////////////////////////////////////
dataHelper.select = function(db, select, params, dataParseDesc, callback){
	db.ignoreErrors = true;
	// Get the data base on the select statment and params as arguments
	// The query receives an array as a parameter.
	db.query(select,
	params,
	dataParseDesc,
	function(err, rows) {
		if(err){
			callback({status:false, error: err, code:500},null);
			return;
		}
		else{
			//Send result to the requester
			callback(null,{message:select,data:rows, info: {count:rows.length}});
		}
	});
};

module.exports = dataHelper;