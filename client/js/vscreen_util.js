/*jslint devel:true*/
/*global io, socket, FileReader, Uint8Array, Blob, URL, event */

/// content, display assignment util
(function (vscreen) {
	"use strict";
	
	/**
	 * 仮想スクリーンユーティリティ
	 * @method VscreenUtil
	 */
	var VscreenUtil = function () {};
	
	/**
	 * Floatの矩形を作成
	 * @method toFloatRect
	 * @param {Object} metaData メタデータ
	 * @return 浮動小数の矩形
	 */
	function toFloatRect(metaData) {
		return vscreen.makeRect(
			parseFloat(metaData.posx),
			parseFloat(metaData.posy),
			parseFloat(metaData.width),
			parseFloat(metaData.height)
		);
	}
	
	/**
	 * Intの矩形を作成
	 * @method toIntRect
	 * @param {Object} metaData メタデータ
	 * @return Intの矩形
	 */
	function toIntRect(metaData) {
		return vscreen.makeRect(
			Math.round(parseFloat(metaData.posx)),
			Math.round(parseFloat(metaData.posy)),
			Math.round(parseFloat(metaData.width)),
			Math.round(parseFloat(metaData.height))
		);
	}
	
	/**
	 * テキストのリサイズ
	 * @method resizeText
	 * @param {Element} elem 対象エレメント
	 * @param {Rect} rect 矩形
	 */
	function resizeText(elem, rect) {
		var lineCount = 1,
			fsize;
		if (elem && rect) {
			lineCount = elem.innerHTML.split("\n").length;
			fsize = parseInt((parseInt(rect.h, 10) - 1) / lineCount, 10);
			elem.style.fontSize = fsize + "px";
			if (fsize < 9) {
				elem.style.fontSize = "9px";
				elem.style.overflow = "auto";
			}
			elem.style.width = rect.w + 'px';
			elem.style.height = rect.h + 'px';
		}
	}

	/**
	 * 動画のリサイズ
	 */
	function resizeVideo(elem, rect) {
		if (elem && rect) {
			elem.setAttribute("width", String(rect.w));
			elem.setAttribute("height", String(rect.w));
		}
	}
	
	/**
	 * 矩形を割り当て
	 * @method assignRect
	 * @param {Element} elem 対象エレメント
	 * @param {Rect} rect 矩形
	 * @param {Number} withoutWidth trueの場合幅を割り当てない
	 * @param {Number} withoutHeight trueの場合高さを割り当てない
	 */
	function assignRect(elem, rect, withoutWidth, withoutHeight) {
		if (elem && rect) {
			elem.style.position = 'absolute';
			elem.style.left = parseInt(rect.x, 10) + 'px';
			elem.style.top = parseInt(rect.y, 10) + 'px';
			if (!withoutWidth && rect.w) {
				elem.style.width = parseInt(rect.w, 10) + 'px';
			}
			if (!withoutHeight && rect.h) {
				elem.style.height = parseInt(rect.h, 10) + 'px';
			}
		}
		//console.log("assignRect:" + JSON.stringify(rect));
	}
	
	/**
	 * Zインデックスを割り当て
	 * @method assignZIndex
	 * @param {Element} elem エレメント
	 * @param {Object} metaData メタデータ
	 */
	function assignZIndex(elem, metaData) {
		var index;
		if (metaData.hasOwnProperty('zIndex')) {
			index = parseInt(metaData.zIndex, 10);
			if (!isNaN(index)) {
				elem.style.zIndex = index;
			}
		}
	}
	
	/**
	 * メタデータが表示中であるかを判別する
	 * @method isVisible
	 * @param {JSON} metaData 判別対象メタデータ
	 * @return LogicalExpression
	 */
	function isVisible(metaData) {
		return (metaData.hasOwnProperty('visible') && (metaData.visible === "true" || metaData.visible === true));
	}
	
	/**
	 * メタデータを割り当て
	 * @method assignMetaData
	 * @param {Element} elem エレメント
	 * @param {Object} metaData メタデータ
	 * @param {Object} useOrg 初期座標系を使うかどうか
	 * @param {Object} groupDict グループ辞書
	 */
	function assignMetaData(elem, metaData, useOrg, groupDict) {
		var rect;
		if (useOrg) {
			rect = vscreen.transformOrg(toIntRect(metaData));
		} else {
			rect = vscreen.transform(toIntRect(metaData));
		}
		if (elem && metaData) {
			assignRect(elem, rect, (metaData.width < 10), (metaData.height < 10));
			assignZIndex(elem, metaData);
			if (Validator.isTextType(metaData)) {
				resizeText(elem, rect);
			} else if (metaData.type === "video") {
				resizeVideo(elem, rect);
			}
			
			if (isVisible(metaData)) {
				//console.log("isvisible");
				elem.style.display = "block";
				if (!Validator.isWindowType(metaData)) {
					if (metaData.mark && groupDict.hasOwnProperty(metaData.group)) {
						if (metaData.group === Constants.DefaultGroup) {
							elem.style.borderColor = "rgb(54,187,68)";
						} else {
							elem.style.borderColor = groupDict[metaData.group].color;
						}
					} else if (!useOrg) {
						elem.style.borderColor = "rgb(54,187,68)";
					}
				}
			} else {
				console.log("not isvisible");
				elem.style.display = "none";
			}
		}
	}
	
	/**
	 * 指定されたelementを矩形情報でstyleを割り当て
	 * @method assignScreenRect
	 * @param {Element} elem エレメント
	 * @param {Object} rect 矩形領域
	 */
	function assignScreenRect(elem, rect) {
		if (elem && rect) {
			elem.style.position = 'absolute';
			elem.style.left = String(rect.x) + 'px';
			elem.style.top = String(rect.y) + 'px';
			elem.style.width = String(rect.w) + 'px';
			elem.style.height = String(rect.h) + 'px';
			console.log("assignScreenRect:" + JSON.stringify(rect));
		}
	}
	
	/**
	 * 指定されたメタデータの情報を座標逆変換
	 * @method transInv
	 * @param {Object} metaData メタデータ
	 * @return metaData
	 */
	function transInv(metaData) {
		var rect = vscreen.transformOrgInv(toFloatRect(metaData));
		metaData.posx = rect.x;
		metaData.posy = rect.y;
		metaData.width = rect.w;
		metaData.height = rect.h;
		return metaData;
	}
	
	/**
	 * 指定されたメタデータの矩形情報を初期仮想スクリーンに変換
	 * @method trans
	 * @param {Object} metaData メタデータ
	 * @return metaData メタデータ
	 */
	function trans(metaData) {
		var rect = vscreen.transformOrg(toFloatRect(metaData));
		metaData.posx = rect.x;
		metaData.posy = rect.y;
		metaData.width = rect.w;
		metaData.height = rect.h;
		return metaData;
	}
	
	
	/**
	 * 指定されたメタデータの位置を初期仮想スクリーンに変換
	 * @method trans
	 * @param {Object} metaData メタデータ
	 * @return metaData メタデータ
	 */
	function transPos(metaData) {
		var rect = vscreen.transformOrg(
			vscreen.makeRect(parseFloat(metaData.posx, 10), parseFloat(metaData.posy, 10), 0, 0)
		);
		metaData.posx = rect.x;
		metaData.posy = rect.y;
		return metaData;
	}
	
	/**
	 * 指定されたメタデータの位置を逆変換
	 * @method transPosInv
	 * @param {Object} metaData メタデータ
	 */
	function transPosInv(metaData) {
		var rect = vscreen.transformOrgInv(
			vscreen.makeRect(parseFloat(metaData.posx, 10), parseFloat(metaData.posy, 10), 0, 0)
		);
		metaData.posx = rect.x;
		metaData.posy = rect.y;
	}
	
	/**
	 * metaDataが完全にwindowの内側かどうか返す
	 * @param {Object} metaData メタデータ
	 * @param {Object} window ウィンドウレクト
	 */
	function isInsideWindow(metaData, window) {
		// コンテンツのメタデータは, 仮想スクリーン全体を基準としたrect
		var rect = toFloatRect(metaData);
		
		// viewのwindowRectは、divの移動量。
		// コントローラで, 仮想スクリーン全体に対して, +x, +yだけdisplayを動かした場合、
		// divを-x, -yだけ動かして、動いたように見せている.

		return (-window.x < rect.x) && // window左端よりコンテンツが右か
			(-window.y < rect.y) &&    // 上
			((window.w - window.x) > (rect.w + rect.x)) && // 右
			((window.h - window.y) > (rect.h + rect.y));   // 下
	}
	
	/**
	 * metaDataが完全にwindowの外側かどうか返す
	 * @method isOutsideWindow
	 * @param {Object} metaData メタデータ
	 * @param {Object} window ウィンドウレクト
	 */
	function isOutsideWindow(metaData, window) {
		// コンテンツのメタデータは, 仮想スクリーン全体を基準としたrect
		var rect = toFloatRect(metaData);
		
		/*
		console.log("isOutsideWindow", window, rect,
				   (-window.x > (rect.x + rect.w)),
				   (-window.y > (rect.y + rect.h)),
				   ((window.w - window.x + rect.w) < (rect.w + rect.x)),
				   ((window.h - window.y + rect.h) < (rect.h + rect.y)));
				   */
		
		return (-window.x > (rect.x + rect.w)) || // window左端よりコンテンツが左か
			(-window.y > (rect.y + rect.h)) ||    // 上
			((window.w - window.x + rect.w) < (rect.w + rect.x)) || // 右
			((window.h - window.y + rect.h) < (rect.h + rect.y));   // 下
	}
	
	window.vscreen_util = new VscreenUtil();
	window.vscreen_util.assignMetaData = assignMetaData;
	window.vscreen_util.assignScreenRect = assignScreenRect;
	window.vscreen_util.isVisible = isVisible;
	window.vscreen_util.trans = trans;
	window.vscreen_util.transInv = transInv;
	window.vscreen_util.transPos = transPos;
	window.vscreen_util.transPosInv = transPosInv;
	window.vscreen_util.isInsideWindow = isInsideWindow;
	window.vscreen_util.isOutsideWindow = isOutsideWindow;
}(window.vscreen));
