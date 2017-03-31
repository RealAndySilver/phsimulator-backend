/**
 * @common.js 
 * File dedicated to manage common functions.
 * Author: Andrés Abril
 * © 2017, Emerson Electric Co
 */

//////////////////////////
///// Dependencies ///////
//////////////////////////


//////////////////////////
///End of Dependencies ///
//////////////////////////

////////////////////
/////// Vars ///////
//*avoid hoisting*//
////////////////////
//Common 
var Common = {};
////////////////////
////End of Vars ////
////////////////////

Common.apps = [
	{
		id:'b1',
		name:'psnodejs',
		type:'base',
		short_name:'PSNJS',
		version:1,
		be_branch:'base',
		fe_branch:'development',
		description:'Base platform capable of running Plantweb Insight Apps.',
		display_name:'Base Platform',
		be_repo_clone:'git@bitbucket.org:emersonpsap/psnodejs.git',
		be_main_folder:'psnodejs',
		fe_repo_clone:'git@bitbucket.org:emersonpsap/fe-base.git',
		fe_main_folder:'fe-base',
		fe_final_folder:'emersonfrontend'
	},
	{
		id:0,
		name:'steamtrap',
		type:'app',
		short_name:'ST',
		version:1,
		be_branch:'dev-v3',
		fe_branch:'development',
		description:'Steam Trap app.',
		display_name:'Steam Trap',
		be_repo_clone:'git@bitbucket.org:emersonpsap/steamtrap.git',
		be_main_folder:'steamtrap',
		fe_repo_clone:'git@bitbucket.org:emersonpsap/fe-steamtrap.git',
		fe_main_folder:'fe-steamtrap',
		fe_final_folder:'steamtrap',
		icon:'steamtrap.png'
	},
	{
		id:1,
		name:'pump',
		type:'app',
		short_name:'PM',
		version:1,
		be_branch:'development',
		fe_branch:'development',
		description:'Pump app.',
		display_name:'Pump',
		be_repo_clone:'git@bitbucket.org:emersonpsap/pump.git',
		be_main_folder:'pump',
		fe_repo_clone:'git@bitbucket.org:emersonpsap/fe-pump.git',
		fe_main_folder:'fe-pump',
		fe_final_folder:'pump',
		icon:'pump.png'
	},
	{
		id:3,
		name:'heatexchanger',
		type:'app',
		short_name:'HE',
		version:1,
		be_branch:'development',
		fe_branch:'development',
		description:'Heat Exchanger app.',
		display_name:'Heat Exchanger',
		be_repo_clone:'git@bitbucket.org:emersonpsap/heatexchanger.git',
		be_main_folder:'heatexchanger',
		fe_repo_clone:'git@bitbucket.org:emersonpsap/fe-heatexchanger.git',
		fe_main_folder:'fe-heatexchanger',
		fe_final_folder:'heatexchanger',
		icon:'heatexchanger.png'
	}
];

module.exports = Common;