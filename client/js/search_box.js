/*jslint devel:true*/
/*global Float32Array */
(function (gui) {
	"use strict";
	var SearchBox,
		defaultGroup = "default";

	SearchBox = function (containerElem, setting) {
		this.container = containerElem;
		this.setting = setting;
		this.init();
	};

    SearchBox.prototype.gen_search_tab_box = function (){
        var d, e, f, g, h, i, j;
        var box = this.container;
        // 既に該当 ID が存在する場合は一度 DOM を削除して再生成する
        e = document.getElementById('search_tab_box_wrapper');
        if(e){
            e.parentNode.removeChild(e);
            e = null;
        }
        // タブの中の要素全体を包むラッパー
        e = document.createElement('div');
        e.id = 'search_tab_box_wrapper';
        e.style.height = '100%';
        e.style.display = 'flex';
        e.style.overflow = 'hidden';
        e.style.flexDirection = 'row';
        box.appendChild(e);
        // 検索窓とチェックボックスの入る左側のカラム
        f = document.createElement('div');
        f.className = "search_area";
        e.appendChild(f);
        // アイテムが並ぶ右側のカラム
        g = document.createElement('div');
        g.className = "search_item_wrapper"
        e.appendChild(g);
        // 左カラム内、上段に検索ボックス
        d = document.createElement('div');
        d.className = "search_text_input_wrapper";
        h = document.createElement('input');
        h.type = 'text';
		h.className = "search_text_input";
        h.setAttribute('placeholder', '🔍  search');
        d.appendChild(h);
        f.appendChild(d);
        // 左カラム内、下段にチェックボックスが入るエリア
        h = document.createElement('div');
		h.className = "search_check_wrapper";
        f.appendChild(h);

        // temp そのいち
        for(i = 0; i < this.setting.groups.length; i++){
            j = document.createElement('div');
            e = document.createElement('input');
            e.id = 'search_check_' + i;
			e.className = "search_group_checkbox";
            e.type = 'checkbox';
            j.appendChild(e);
            f = document.createElement('label');
            f.setAttribute('for', 'search_check_' + i);
            f.textContent = this.setting.groups[i];
			f.className = "search_group_label";
            j.appendChild(f);
            h.appendChild(j);
        }

        // temp そのに
        for(i = 0; i < 10; i++){
            e = document.createElement('div');
            e.style.display = 'inline-block';
            e.style.margin = '15px';
            e.style.width = '120px';
            e.style.height = '120px';
            e.style.backgroundColor = 'skyblue';
            g.appendChild(e);
        }
    };

	SearchBox.prototype.init = function () {
		// search tab generate
		this.gen_search_tab_box();
	};

	function init(containerElem, setting) {
		return new SearchBox(containerElem, setting);
	}

	window.search_box = {};
	window.search_box.init = init;

}(window.controller_gui));