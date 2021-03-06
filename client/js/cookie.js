/*jslint devel:true*/
/*global require, socket, module, Buffer */

(function () {
	"use strict";

	var Cookie = function() {
		this.snapType = "free";
		this.displayScale = 1;
		this.updateCursorEnable = false;// マウスカーソル送信が有効かどうか 
		this.loginkey = ""
	};


	/**
	 * cookie取得
	 * @method getCookie
	 * @param {String} key cookieIDキー
	 * @return {String} cookie
	 */
	function getCookie (key) {
		var i,
			pos,
			cookies;
		if (document.cookie.length > 0) {
			console.log("all cookie", document.cookie);
			cookies = [document.cookie];
			if (document.cookie.indexOf(';') >= 0) {
				cookies = document.cookie.split(';');
			}
			for (i = 0; i < cookies.length; i = i + 1) {
				pos = cookies[i].indexOf(key + "=");
				if (pos >= 0) {
					return unescape(cookies[i].substring(pos + key.length + 1));
				}
			}
		}
		return "";
	}

	Cookie.prototype.load = function () {
		this.getDisplayScale();
		this.getSnapType();
		this.isUpdateCursorEnable();
		this.getLoginKey();
	};

	/**
	 * cookie保存
	 * @method save
	 */
	Cookie.prototype.save = function () {
		var displayScale = vscreen.getWholeScale();
		console.log("save_cookie");
		document.cookie = 'display_scale=' + String(this.displayScale);
		document.cookie = 'snap_setting=' + this.snapType; //gui.get_snap_type();
		document.cookie = 'update_cursor_enable=' + String(this.updateCursorEnable);
		document.cookie = 'loginkey='+String(this.loginkey);
	};

	Cookie.prototype.setDisplayScale = function (scale) {
		this.load(); // 最初に全部読み込んでから対象のものだけ上書きする
		console.log("setDisplayScale", scale)
		this.displayScale = scale;
		this.save();
	};
	Cookie.prototype.getDisplayScale = function (withoutLoad) {
		if (!withoutLoad) {
			var scale = getCookie("display_scale");
			scale = parseFloat(scale);
			if (!isNaN(scale) && scale > 0) {
				this.displayScale = scale;
			}
		}
		console.log("cookie - display_scale:" + this.displayScale);
		return this.displayScale;
	};
	
	Cookie.prototype.setSnapType = function (type) {
		this.load(); // 最初に全部読み込んでから対象のものだけ上書きする
		this.snapType = type;
		this.save();
	};
	Cookie.prototype.getSnapType = function (withoutLoad) {
		if (!withoutLoad) {
			this.snapType = getCookie("snap_setting");
		}
		console.log("cookie - snap_setting:" + this.snapType);
		return this.snapType;
	};

	Cookie.prototype.setUpdateCursorEnable = function (enable) {
		this.load(); // 最初に全部読み込んでから対象のものだけ上書きする
		this.updateCursorEnable = enable;
		this.save();
	};
	Cookie.prototype.isUpdateCursorEnable = function (withoutLoad) {
		if (!withoutLoad) {
			var enable = getCookie("update_cursor_enable");
			this.updateCursorEnable = (enable && enable === "true");
		}
		return this.updateCursorEnable;
	};

	Cookie.prototype.setLoginKey = function (key) {
		this.load(); // 最初に全部読み込んでから対象のものだけ上書きする
		this.loginkey = key;
		this.save();
	};
	Cookie.prototype.getLoginKey = function (withoutLoad) {
		if (!withoutLoad) {
			this.loginkey = getCookie("loginkey");
		}
		return this.loginkey;
	};

	window.Cookie = new Cookie;

}());