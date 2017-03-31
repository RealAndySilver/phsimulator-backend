/**
 * @common.js 
 * File dedicated to manage common functions.
 * Author: Andrés Abril
 * © 2016, Emerson Electric Co
 */

//////////////////////////
///// Dependencies ///////
//////////////////////////
var fs = require("fs");
//var steam_logic = require('../steam_logic/steam_logic');
//////////////////////////
///End of Dependencies ///
//////////////////////////

////////////////////
/////// Vars ///////
//*avoid hoisting*//
////////////////////
//Common 
var common = {};
////////////////////
////End of Vars ////
////////////////////

common.list = function(){
	var list =  [];
	var pumps = {
		id : 1,
		active : 1,
		data : {
			OV1_SS : 0.1,
			PKV1_SS : 1.5,
			OV2_SS : 0.2,
			PKV2_SS : 1.5,
			DISCH_P_SS : 5,
			FLOW_SS : 700,
			SUCT_P_SS : 2.5,
			STR_DP_SS : 800,
			SEAL_L_SS : 60,
			SEAL_P_SS : 0.8,
			BEAR1_T_SS : 50,
			BEAR2_T_SS : 60,
			SPEED_SP : 4800,
			SPEED_MAX : 5200,
			update_rate : 300,
			endpoint : 'http://ENDPOINT_URL_AND_PORT_HERE/api/v2'
		}
	};
	list.push(pumps);
	return list;
};

//Check if input is a json
common.isJson = function(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

module.exports = common;