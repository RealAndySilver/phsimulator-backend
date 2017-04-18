/**
 * @index.js 
 * Main route dispatcher.
 * Author: Andrés Abril
 * © 2017, Emerson Electric Co
 */

/////////////////////////////
/////// Dependencies ////////
/////////////////////////////
var express = require('express');
var router = express.Router();
var device = require('./general/device');
var list = require('./general/list');
var settings = require('./general/settings');
/////////////////////////////
/// End of Dependencies /////
/////////////////////////////
//GET LISTS [GET]
router.get('/list', function(req, res, next) {
	res.json({status:true, data:list});
	return;
});
//CREATE DEVICE [POST]
router.post('/device', function(req, res, next) {
	device.createNewDevice(req.body, function(err,obj){
		if(err){
			res.status(err.code).send({status:false, error:err});
			return;
		}
		res.json({status:true, message:obj.message, data: obj.data});
		return;
	});
});
//GET ALL DEVICES [GET]
router.get('/devices/:order?/:limit?', function(req, res, next) {
	device.getDevicesList(req.params.order, req.params.limit, function(err,obj){
		if(err){
			res.status(err.code).send({status:false, error:err});
			return;
		}
		
		res.json({status:true, message:obj.message, info:obj.info, data:obj.data });
		return;
	});
});
//GET DEVICE BY ID [GET]
router.get('/device/:id', function(req, res, next) {
	device.getDeviceByID(req.params.id, function(err,obj){
		if(err){
			res.status(err.code).send({status:false, error:err});
			return;
		}
		
		res.json({status:true, message:obj.message, data: obj.data});
		return;
	});
});
//UPDATE DEVICE BY ID [PUT]
router.put('/device/:id', function(req, res, next) {
	device.updateDeviceByID(req.params.id,req.body, function(err,obj){
		if(err){
			res.status(err.code).send({status:false, error:err});
			return;
		}
		res.json({status:true, message:obj.message, data: obj.data});
		return;
	});
});
//GET DEVICE BY TAG [GET]
router.get('/device/tag/:tag', function(req, res, next) {
	device.getDeviceByTag(req.params.tag, function(err,obj){
		if(err){
			res.status(err.code).send({status:false, error:err});
			return;
		}
		res.json({status:true, message:obj.message, data: obj.data});
		return;
	});
});
//DELETE DEVICE BY TAG [DELETE]
router.delete('/device/tag/:tag', function(req, res, next) {
	device.deleteDeviceByTag(req.params.tag, function(err,obj){
		if(err){
			res.status(err.code).send({status:false, error:err});
			return;
		}
		res.json({status:true, message:obj.message});
		return;
	});
});
//GET ALL DEVICES BY TYPE [GET]
router.get('/devices/:device_type/:order?/:limit?', function(req, res, next) {
	device.getDeviceListByType(req.params.device_type, req.params.order, req.params.limit, function(err,obj){
		if(err){
			res.status(err.code).send({status:false, error:err});
			return;
		}
		res.json({status:true, message:obj.message, info:obj.info, data:obj.data });
		return;
	});
});

//TOGGLE DEVICE [GET]
router.get('/device/toggle/:device_id/:toggle_value', function(req, res, next) {
	device.toggleDevice(req.params.device_id,req.params.toggle_value, function(err,obj){
		if(err){
			res.status(err.code).send({status:false, error:err});
			return;
		}
		res.json({status:true, message:obj.message, info:obj.info, data:obj.data });
		return;
	});
});

//UPDATE EXTERNAL DEVICE [GET]
router.put('/device/external/:device_tag', function(req, res, next) {
	device.updateExternalDeviceByTag(req.params.device_tag, function(err,obj){
		if(err){
			res.status(err.code).send({status:false, error:err});
			return;
		}
		res.json({status:true, message:obj.message, data: obj.data});
		return;
	});
});
//CREATE EXTERNAL DEVICE IN TARGET SERVER [GET]
router.post('/device/external/:device_tag', function(req, res, next) {
	device.createExternalDeviceByTag(req.params.device_tag, function(err,obj){
		if(err){
			res.status(err.code).send({status:false, error:err});
			return;
		}
		res.json({status:true, message:obj.message, data: obj.data});
		return;
	});
});
//DELETE EXTERNAL DEVICE BY TAG [DELETE]
router.delete('/device/external/:device_tag', function(req, res, next) {
	device.deleteExternalDeviceByTag(req.params.device_tag, function(err,obj){
		if(err){
			res.status(err.code).send({status:false, error:err});
			return;
		}
		res.json({status:true, message:obj.message});
		return;
	});
});


////SETTINGS

//GET SETTINGS BY ID [GET]
router.get('/settings/:id', function(req, res, next) {
	settings.getGlobalSettingsByID(req.params.id, function(err,obj){
		if(err){
			res.status(err.code).send({status:false, error:err});
			return;
		}
		res.json({status:true, data: obj.data});
		return;
	});
});
//UPDATE SETTINGS BY ID [PUT]
router.put('/settings/:id', function(req, res, next) {
	settings.updateGlobalSettingsByID(req.params.id,req.body, function(err,obj){
		if(err){
			res.status(err.code).send({status:false, error:err});
			return;
		}
		res.json({status:true, response: obj.data});
		return;
	});
});
//RESET TO DEFAULT SETTINGS BY ID [PUT]
router.put('/settings/default/:id', function(req, res, next) {
	settings.resetGlobalSettingsToDefaultByID(req.params.id, function(err,obj){
		if(err){
			res.status(err.code).send({status:false, error:err});
			return;
		}
		res.json({status:true, response:obj.data});
		return;
	});
});

//TOGGLE MASTER SWITCH [GET]
router.get('/settings/toggle/:id/:toggle_value', function(req, res, next) {
	settings.toggleMasterSwitch(req.params.id,req.params.toggle_value, function(err,obj){
		if(err){
			res.status(err.code).send({status:false, error:err});
			return;
		}
		res.json({status:true, message:obj.message, info:obj.info, data:obj.data });
		return;
	});
});

module.exports = router;
