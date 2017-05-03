var list = function(){
	return {
		apps : ['Pumps', 'HeatExchanger', 'WirelessPressureGauge'],
		device_types : ['Pressure','Flow','Temp','Vibration','HE-Flow', "HE-Pressure", "HE-Temp"],
		device_sub_types : {
			Pressure : [9817,9828,9836,9841,9845],
			Flow : [9817,9828,9836,9841,9845],
			Temp : [57517],
			Vibration : [57517],
			"HE-Flow" : [9817,9828,9836,9841,9845],
			"HE-Pressure" : [9817,9828,9836,9841,9845],
			"HE-Temp" : [57517]
		},
		variable_status_list : ['0xc0','0x80','0x40'],
		variable_value_list : {
			Pressure : ['Flow','Discharge P','Suction P','Strainer dP','Seal Pressure','Seal Level'],
			Flow : ['Flow','Discharge P','Suction P','Strainer dP','Seal Pressure','Seal Level'],
			Temp : ['Vibration 1','Peakvue 1','Vibration 2','Peakvue 2','Bear Temp 1','Bear Temp 2'],
			Vibration : ['Vibration 1','Peakvue 1','Vibration 2','Peakvue 2','Bear Temp 1','Bear Temp 2'],
			"HE-Flow" : ['Hot Side Flow', 'Cold Side Fow','Hot Side Pressure','Cold Side Pressure'],
			"HE-Pressure" : ['Hot Side Flow', 'Cold Side Fow','Hot Side Pressure','Cold Side Pressure'],
			"HE-Temp" : ['Hot Side Inlet Temp','Hot Side Outlet Temp','Cold Side Inlet Temp','Cold Side Outlet Temp'],
		},
		update_rate_options : [6,10,20,30,60,120,180,240,300],
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
		units : {
			Pressure : [
				"InH2O 68F",  //PU_inH2OAt68F:  2.4864110E+02, //Inch of water at 68F                  
				"InHg 0C",    //PU_inHgAt0C: 3.3863800E+03, // Inch of mercury at 0C                   
				"FtH2O 68F",  //PU_ftH20At68F: 2.9836932E+03, // Foot of water at 68F                  
				"mmH2O 68F",  //PU_mmH20At68F: 9.7890218E+00, // Milimeter of water at 68F                    
				"mmHg 0C",    //PU_mmHgAt0C: 1.3332200E+02, //Milimeter of mercury at 0C                  
				"PSI ",       //PU_psi: 6.8947570E+03,    //                                                           
				"bar",        //PU_bars: 1.0000000E+05,   //                                           
				"mbar",       //PU_milliBars: 1.0000000E+02, //                                        
				"g/Sqcm",     //PU_gramPerSqCm: 9.8066500E+01, //Gram per square centimetre            
				"kg/Sqcm ",   //PU_kiloGramPerSqCm: 9.8066500E+04, //Kilogram per square centimetre    
				"kPa",        //PU_kiloPascals: 1.0000000E+03,   //                                    
				"Torr",       //PU_torr: 1.3332200E+02, //                                             
				"atm",        //PU_atm: 1.0132500E+05, //Atmosphere                                    
				"InH2O 60F",  //PU_inH2OAt60F: 2.4884283E+02, //Inch of water at 60F                   
				"cmH2O 4C",   //PU_cmH2OAt4C: 9.8063749E+01, //Centimetre of water at 4C               
				"mH2O 4C",    //PU_mH2OAt4C: 9.8063749E+03, //Meter of water at 4C                     
				"cmHg 0C",    //PU_cmHGAt0C: 1.3332240E+03, //Centimetre of mercury at 0C              
				"lbs/ft^2",   //PU_psf: 4.7880260E+01, //Pounds per Square Foot Pressure               
				"hPascals",   //PU_hectoPascals: 1.0000000E+02, //                                     
				"kg/m^2",     //PU_kgsm: 9.8066500E+00, //Kiligram  per square meter                   
				"FtH2O 4C",   //PU_ftH2OAt4C: 2.9889831E+03,  //Foot of water at 4C                    
				"FtH2O 60F",  //PU_ftH2OAt60F: 2.9861139E+03, //Foot of water at 60F                   
				"mHg 0C",     //PU_mHGAt0C: 1.3332240E+05, //Meter of mercury at 0C                    
				"MPSI",       //PU_megaPascals: 1.0000000E+06, //                                      
				"InH2O 4C",   //PU_inH20At4C: 2.4908200E+02, //Inch of water at 4C                     
				"mmH2O 4C",   //PU_mmH20At4C: 9.8063800E+00, //Millimeter of water at 4C  
				"kg/cm^2",    //TESTING UNIT equal to Kg/Sqcm   
				"mmWc",       //Millimeters water column
			],
			Flow : [
				"ft^3/min",    //pies cubicos por minuto
				"gal/min",     //galones por minuto
				"l/min",        //litros por minuto
				"IG/min",       //
				"m^3/hr",       // metros cubicos por hora
				"gal/s",        //galones por segundo 
				"Mgal/day",     //Megagalones por dia
				"l/s",          //Litros por segundo
				"Ml/day",       //Megalitros por dia
				"ft^3/s",        //Pies cubicos por segundo
				"ft^3/day",     //Pies cubicos por dia
				"m^3/s",        //Metros cubidos por segundo
				"m^3/day",      //Metros cubicos por dia
				"IG/hr",        //
				"IG/day",       //
				"n m^3/hr",     //Metros cubicos NORMALES por hora
				"n l/hr",       //litros cubicos NORMALES por hora
				"std ft^3/min", //pies cubidos estadar por minuto
				"ft^3/hr",      //Pies cubicos por hora
				"m^3/min",      //Metros cubicos por minuto
				"barrels/s",    //Barriles por segundo
				"barrels/min",  //Barriles por minuto
				"barrels/hr",   //Barriles por hora
				"barrels/day",  //Barriles por día
				"gal/hr",       //Galones por hora
				"IG/s",         //
				"l/hr",         //litros por hora
				"gal/day",      //galones por dia
			],
			Temp : [
				"DegC", //Grados centigrados
				"DegF", //Grados faranheit
				"DegR", //Grados Racon
				"DegK", //Grados Kelvin
			],
			Vibration : [
				"in/sec", //pulgadas por segundo
				"mm/sec", //milimetros por segundo
			],
			Peakvue : [
				"g's",     //??
				"m/sec^2", //metros por segundo cuadrado
			],
			Seallevel : [
				"%"       //porcentaje
			],
			"HE-Flow2" : [
				"ft^3/min",    //pies cubicos por minuto
				"gal/min",     //galones por minuto
				"l/min",        //litros por minuto
				"IG/min",       //
				"m^3/hr",       // metros cubicos por hora
				"gal/s",        //galones por segundo 
				"Mgal/day",     //Megagalones por dia
				"l/s",          //Litros por segundo
				"Ml/day",       //Megalitros por dia
				"ft^3/s",        //Pies cubicos por segundo
				"ft^3/day",     //Pies cubicos por dia
				"m^3/s",        //Metros cubidos por segundo
				"m^3/day",      //Metros cubicos por dia
				"IG/hr",        //
				"IG/day",       //
				"n m^3/hr",     //Metros cubicos NORMALES por hora
				"n l/hr",       //litros cubicos NORMALES por hora
				"std ft^3/min", //pies cubidos estadar por minuto
				"ft^3/hr",      //Pies cubicos por hora
				"m^3/min",      //Metros cubicos por minuto
				"barrels/s",    //Barriles por segundo
				"barrels/min",  //Barriles por minuto
				"barrels/hr",   //Barriles por hora
				"barrels/day",  //Barriles por día
				"gal/hr",       //Galones por hora
				"IG/s",         //
				"l/hr",         //litros por hora
				"gal/day",      //galones por dia
			],
			"HE-Pressure" : [
				"InH2O 68F",  //PU_inH2OAt68F:  2.4864110E+02, //Inch of water at 68F                  
				"InHg 0C",    //PU_inHgAt0C: 3.3863800E+03, // Inch of mercury at 0C                   
				"FtH2O 68F",  //PU_ftH20At68F: 2.9836932E+03, // Foot of water at 68F                  
				"mmH2O 68F",  //PU_mmH20At68F: 9.7890218E+00, // Milimeter of water at 68F                    
				"mmHg 0C",    //PU_mmHgAt0C: 1.3332200E+02, //Milimeter of mercury at 0C                  
				"PSI ",       //PU_psi: 6.8947570E+03,    //                                                           
				"bar",        //PU_bars: 1.0000000E+05,   //                                           
				"mbar",       //PU_milliBars: 1.0000000E+02, //                                        
				"g/Sqcm",     //PU_gramPerSqCm: 9.8066500E+01, //Gram per square centimetre            
				"kg/Sqcm ",   //PU_kiloGramPerSqCm: 9.8066500E+04, //Kilogram per square centimetre    
				"kPa",        //PU_kiloPascals: 1.0000000E+03,   //                                    
				"Torr",       //PU_torr: 1.3332200E+02, //                                             
				"atm",        //PU_atm: 1.0132500E+05, //Atmosphere                                    
				"InH2O 60F",  //PU_inH2OAt60F: 2.4884283E+02, //Inch of water at 60F                   
				"cmH2O 4C",   //PU_cmH2OAt4C: 9.8063749E+01, //Centimetre of water at 4C               
				"mH2O 4C",    //PU_mH2OAt4C: 9.8063749E+03, //Meter of water at 4C                     
				"cmHg 0C",    //PU_cmHGAt0C: 1.3332240E+03, //Centimetre of mercury at 0C              
				"lbs/ft^2",   //PU_psf: 4.7880260E+01, //Pounds per Square Foot Pressure               
				"hPascals",   //PU_hectoPascals: 1.0000000E+02, //                                     
				"kg/m^2",     //PU_kgsm: 9.8066500E+00, //Kiligram  per square meter                   
				"FtH2O 4C",   //PU_ftH2OAt4C: 2.9889831E+03,  //Foot of water at 4C                    
				"FtH2O 60F",  //PU_ftH2OAt60F: 2.9861139E+03, //Foot of water at 60F                   
				"mHg 0C",     //PU_mHGAt0C: 1.3332240E+05, //Meter of mercury at 0C                    
				"MPSI",       //PU_megaPascals: 1.0000000E+06, //                                      
				"InH2O 4C",   //PU_inH20At4C: 2.4908200E+02, //Inch of water at 4C                     
				"mmH2O 4C",   //PU_mmH20At4C: 9.8063800E+00, //Millimeter of water at 4C  
				"kg/cm^2",    //TESTING UNIT equal to Kg/Sqcm   
				"mmWc",       //Millimeters water column
			],
			"HE-Temp" : [
				"DegC", //Grados centigrados
				"DegF", //Grados faranheit
				"DegR", //Grados Racon
				"DegK", //Grados Kelvin
			],
			"HE-Flow" : [
				"ug/s",
				"mg/s",
				"g/s",
				"ounces/s",
				"lbs/s",
				"kg/s",
				"st/s",
				"cwtusa/s",
				"cwtuk/s",
				"short tons/s",
				"metric tons/s",
				"long tons/s",
				"kshort tons/s",
				"kmetric tons/s",
				"klong tons/s",
				"Mshort tons/s",
				"Mmetric tons/s",
				"Mlong tons/s",
				"ug/day",
				"mg/day",
				"g/day",
				"ounces/day",
				"lbs/day",
				"kg/day",
				"st/day",
				"cwtusa/day",
				"cwtuk/day",
				"short tons/day",
				"metric tons/day",
				"long tons/day",
				"kshort tons/day",
				"kmetric tons/day",
				"klong tons/day",
				"Mshort tons/day",
				"Mmetric tons/day",
				"Mlong tons/day",
				"ug/hr",
				"mg/hr",
				"g/hr",
				"ounces/hr",
				"lbs/hr",
				"kg/hr",
				"st/hr",
				"cwtusa/hr",
				"cwtuk/hr",
				"short tons/hr",
				"metric tons/hr",
				"long tons/hr",
				"kshort tons/hr",
				"kmetric tons/hr",
				"klong tons/hr",
				"Mshort tons/hr",
				"Mmetric tons/hr",
				"Mlong tons/hr",
			],
			
		}
	}
};
module.exports = list();