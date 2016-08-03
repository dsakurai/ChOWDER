/*jslint devel:true*/
/*global io, socket, FileReader, Uint8Array, Blob, URL, event */

/// menu
(function () {
	"use strict";

	var Menu;

	// コンストラクタ
	Menu = function (containerElem, setting) {
/*
		<ul class="menu">
			<li class="menu__multi">
				<a href="#" class="init-bottom">Menu multi level</a>
				<ul class="menu_level1">
					<li>
						<a href="#" class="init-right">Child Menu</a>
						<ul class="menu_level2">
							<li>
								<a href="#" class="init-right">Grandchild Menu</a>
								<ul class="menu_level3">
									<li><a href="#">Great-Grandchild Menu</a></li>
									<li><a href="#">Great-Grandchild Menu</a></li>
									<li><a href="#">Great-Grandchild Menu</a></li>
								</ul>
							</li>
							<li><a href="#">Grandchild Menu</a></li>
							<li><a href="#">Grandchild Menu</a></li>
						</ul>
					</li>
				</ul>
			</li>
			<!-- 他メニュー-->
		</ul>
*/
		var i,
			head,
			link,
			li,
			ul,
			menu;

		ul = document.createElement('ul');
		ul.className = "menu";
		containerElem.appendChild(ul);

		function createMenu(setting, ul, n) {
			var i,
				ul2,
				key,
				value;

			for (i = 0; i < setting.length; i = i + 1) {
				head = setting[i];
				key = Object.keys(setting[i])[0];
				value = setting[i][key];
				
				link = document.createElement('a');
				link.href = "#";
				link.innerHTML = key;

				if (value instanceof Array) {
					// 子有り.
					if (n === 1) {
						link.className = "init-bottom";
					} else {
						link.className = "init-right";
					}
					li = document.createElement('li');
					li.className = "menu__multi";
					li.appendChild(link);
					ul.appendChild(li);
						
					ul2 = document.createElement('ul');
					ul2.className = "menu_level" + n;
					li.appendChild(ul2);
					li = document.createElement('li');
					ul2.appendChild(li);

					var count = value.length;
					createMenu(value, ul2, n + 1);
				} else {
					// 末端.
					if (value.hasOwnProperty('url')) {
						link.href = value.url;
					}
					if (value.hasOwnProperty('func')) {
						link.onclick = value.func;
					}
					link.className = "";
					li = document.createElement('li');
					li.className = "";
					li.appendChild(link);
					ul.appendChild(li);
				}
			}
		}
		createMenu(setting.menu, ul, 1);
	};

	// 初期化
	function init(containerElem) {
		var menuSetting = {
				menu : [{
					SelectMode : [{
							View : {
								url : "view.html"
							},
						}, {
							Controller : {
								url : "controller.html"
							}
						}],
				}, {
					Add : [{
							Image : {
								func : function () { document.getElementById('image_file_input').click() }
							}
						}, {
							Text : {
								func : function () { document.getElementById('text_file_input').click(); }
							},
						}, {
							URL : {
								func : function () { console.log("todo"); }
							}
						}],
				}, {
					Edit : [{
							VirtualDisplaySetting : {
								func : function () { document.getElementById('virtual_display_setting').click(); }
							},
						}, {
							Snap : [{
								Free : {
									func : function () {}
								},
							}, {
								Display : {
									func : function () {}
								},
							}, {
								Grid : {
									func : function () {}
								}
							}],
						}, {
							Scale : [{
								0.1 : {
									func : function () {}
								}
							}, {
								0.2 : {
									func : function () {}
								}
							}, {
								0.3 : {
									func : function () {}
								}
							}, {
								0.4 : {
									func : function () {}
								}
							}, {
								0.5 : {
									func : function () {}
								}
							}, {
								0.6 : {
									func : function () {}
								}
							}, {
								0.7 : {
									func : function () {}
								}
							}, {
								0.8 : {
									func : function () {}
								}
							}, {
								0.9 : {
									func : function () {}
								}
							}, {
								1.0 : {
									func : function () {}
								}
							}],
						}, {
							ReplaceImage : {
								func : function () { document.getElementById('update_image_input').click(); }
							}
						}]
					}]
				};
		var menu = new Menu(containerElem, menuSetting);
	}

	window.menu = {};
	window.menu.init = init;
}());