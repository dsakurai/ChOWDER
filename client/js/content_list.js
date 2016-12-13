/*jslint devel:true*/
(function () {
	"use strict";
	
	var contentBorderColor = "rgba(0,0,0,0)",
		defaultGroup = "default",
		textColor = "white";

	/**
	 * コンテンツタイプから適切なクラス名を取得する.
	 * @parma {String} contentType コンテンツタイプ
	 */
	function getClassName(contentType) {
		var classname;
		if (contentType === 'text') {
			classname = 'textcontent';
		} else {
			classname = 'imagecontent';
		}
		return classname;
	}

	/**
	 * コンテンツタイプから適切なタグ名を取得する.
	 * @parma {String} contentType コンテンツタイプ
	 */
	function getTagName(contentType) {
		var tagName;
		if (contentType === 'text') {
			tagName = 'pre';
		} else {
			tagName = 'img';
		}
		return tagName;
	}

	/**
	 * 受領したメタデータから左側コンテンツエリアに反映する。
	 * doneGetContent時にコールされる。
	 * @method importContentToList
	 * @param {JSON} metaData メタデータ
	 * @param {BLOB} contentData コンテンツデータ
	 */
	function importContentToList(gui, metaDataDict, metaData, contentData) {
		var contentArea = null,
			contentElem,
			id,
			elem,
			w,
			h,
			sourceElem,
			divElem,
			aspect,
			tagName,
			classname,
			blob,
			mime = "image/jpeg",
			onlistID = "onlist:" + metaData.id;

		// メタデータはGetMetaDataで取得済のものを使う.
		// GetContent送信した後にさらにGetMetaDataしてる場合があるため.
		if (metaDataDict.hasOwnProperty(metaData.id)) {
			metaData = metaDataDict[metaData.id];
		}

		if (metaData.hasOwnProperty('group')) {
			contentArea = gui.get_content_area_by_group(metaData.group);
		}
		if (!contentArea) {
			contentArea = gui.get_content_area_by_group(defaultGroup);
		}

		tagName = getTagName(metaData.type);
		classname = getClassName(metaData.type);
		
		if (gui.get_list_elem(metaData.id)) {
			divElem = gui.get_list_elem(metaData.id);
			contentElem = divElem.childNodes[0];
		}
		
		if (!divElem) {
			contentElem = document.createElement(tagName);
			divElem = document.createElement('div');
			divElem.id = onlistID;
			if (window.content_list.on_setup_content) {
				window.content_list.on_setup_content(divElem, onlistID);
			}
			//setupContent(divElem, onlistID);
			divElem.appendChild(contentElem);
			contentArea.appendChild(divElem);
		}
		contentElem.classList.add(classname);

		//console.log("id=" + metaData.id);
		if (contentData) {
			if (metaData.type === 'text') {
				// contentData is text
				contentElem.innerHTML = contentData;
				divElem.style.width = "150px";
				divElem.style.height = "150px";
				divElem.style.color = textColor;
			} else {
				// contentData is blob
				if (metaData.hasOwnProperty('mime')) {
					mime = metaData.mime;
					//console.log("mime:" + mime);
				}

				divElem.style.height = "150px";
				aspect = metaData.orgWidth / metaData.orgHeight;
				w = 150 * aspect;
				divElem.style.width = w + "px";

				blob = new Blob([contentData], {type: mime});
				if (contentElem && blob) {
					URL.revokeObjectURL(contentElem.src);
					contentElem.src = URL.createObjectURL(blob);

					if (w > 200) {
						divElem.style.width = "200px";
						h = 200 / aspect;
						divElem.style.paddingBottom = (150 - h) + "px"; 
						if (150 - h > 140.0) {
							divElem.style.paddingBottom = "140px";
						}
					} else if (w < 50) {
						divElem.style.width = "50px";
						divElem.style.paddingRight = (50 - w) + "px";
						if (50 - w > 40.0) {
							divElem.style.paddingRight = "40px";
						}
					}
				}
			}
		}
		contentElem.style.width = "100%";
		contentElem.style.height = "100%";
		divElem.style.position = "relative";
		divElem.style.top = "5px";
		divElem.style.left = "20px";
		divElem.style.border = "solid";
		divElem.style.borderColor = contentBorderColor;
		divElem.style.margin = "5px";
		divElem.style.color = "white";
		divElem.style.float = "left";
		
		// 同じコンテンツを参照しているメタデータがあれば更新
		if (!contentData && contentElem) {
			if (window.content_list.on_copy_content) {
				window.content_list.on_copy_content(null, contentElem, metaData, true);
			}
			//copyContentData(null, contentElem, metaData, true);
			divElem.style.width = "200px";
			if (contentElem.offsetHeight > 200) {
				aspect = metaDataDict[id].width / metaDataDict[id].height;
				divElem.style.height = "100px";
				divElem.style.width = 100 * aspect;
			}
		} else {
			if (window.content_list.on_copy_content) {
				window.content_list.on_copy_content(contentElem, null, metaData, true);
			}
			//copyContentData(contentElem, null, metaData, true);
		}
	}
	
	window.content_list = {};
	window.content_list.import_content = function (gui, metaDataDict, metaData, contentData) {
		importContentToList(gui, metaDataDict, metaData, contentData);
	};
	window.content_list.on_setup_content = null;
	window.content_list.on_copy_content = null;

}());