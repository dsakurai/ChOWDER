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
		SendMessage: "SendMessage",
		
		// to client
		Disconnect : "Disconnect",

		// DB管理コマンド
		NewDB : "NewDB",
		InitDB : "InitDB",
		DeleteDB : "DeleteDB",
		RenameDB : "RenameDB",
		ChangeDB : "ChangeDB",
		GetDBList : "GetDBList",

		// 各種設定変更
		ChangeGlobalSetting : "ChangeGlobalSetting",
		GetGlobalSetting : "GetGlobalSetting",
		UpdateSetting : "UpdateSetting",

		// ユーザー管理
		Login : "Login",
		Logout : "Logout",
		ChangePassword : "ChangePassword",
		ChangeAuthority : "ChangeAuthority",
		GetUserList :  "GetUserList",

		// WebRTC
		RTCRequest : "RTCRequest",
		RTCOffer : "RTCOffer",
		RTCAnswer : "RTCAnswer",
		RTCIceCandidate : "RTCIceCandidate",
		RTCClose : "RTCClose",
	};
	
	module.exports = Command;
}());
