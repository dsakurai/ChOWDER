/*jslint devel:true*/
/*global require, socket, module, Buffer */

(function () {
	"use strict";
	
	var Command = {
		// request command
		AddContent : "AddContent",
		AddMetaData : "AddMetaData",
		AddWindowMetaData : "AddWindowMetaData",
		AddGroup : "AddGroup",
		DeleteGroup : "DeleteGroup",
		GetContent : "GetContent",
		GetMetaData : "GetMetaData",
		GetWindowMetaData : "GetWindowMetaData",
		GetVirtualDisplay : "GetVirtualDisplay",
		GetGroupList : "GetGroupList",
		
		// using both server and client
		Update : "Update",
		UpdateContent : "UpdateContent",
		UpdateMetaData : "UpdateMetaData",
		UpdateVirtualDisplay : "UpdateVirtualDisplay",
		UpdateWindowMetaData : "UpdateWindowMetaData",
		UpdateMouseCursor : "UpdateMouseCursor",
		UpdateGroup : "UpdateGroup",
		ChangeGroupIndex : "ChangeGroupIndex",
		DeleteContent : "DeleteContent",
		DeleteWindowMetaData : "DeleteWindowMetaData",
		ShowWindowID : "ShowWindowID",
		
		// to client
		Disconnect : "Disconnect"
	};
	
	module.exports = Command;
}());
