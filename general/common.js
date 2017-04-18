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
			settings : {
				SPEED_MAX : 5200,
				SPEED_SP : 4800,
				CONST : 0.05,
				GOOD : 128,
				BAD : 0,
				
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
	
				FLOW_H_SS : 7000,
				TEMP_H_I_SS : 226,
				TEMP_H_O_SS : 215,
				DP_H_SS : 10,
				FLOW_C_SS : 32500,
				TEMP_C_I_SS : 12.5,
				TEMP_C_O_SS : 23,
				DP_C_SS : 20,
				FLOW_H_DENS_SS : 1000,
				FLOW_C_DENS_SS : 1100,
				UDV1_SS : 300,
				UDV2_SS : 6,
				UDV3_SS : 3.5,
				UDV4_SS : 200,
				UDV5_SS : 0,
				UDV6_SS : 0.5,
				UDV7_SS : 11,
				UDV8_SS : 9,
				UDV9_SS : 3.5,
				UDV10_SS : 2000
			},
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