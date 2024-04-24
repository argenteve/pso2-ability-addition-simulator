/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/*****************************************************************************
 *
 * result.js
 * まさにドゥドゥ(モニカ)本体を現す結果表示パネル
 *
 * 指定された素体、素材A(+素材B)の特殊能力情報を基に、指定できる特殊能力の出力
 * を行い、その中から選択された特殊能力から継承・生成率の表示を行う
 * また、能力追加オプションの選択、ドゥドゥシミュレーションも行う
 *
 * このパネルのみを利用する場合、このファイルより先に同梱の「ability.js」を
 * ロードする必要があります
 *
 *****************************************************************************/
Ext.ns('PSO2');

/* 能力オプション */
PSO2.AbilityOption = {
	support: [
		{name: '指定なし',           sname: '指定なし', value: 'A01', fn: function(v){ return v; }},
		{name: '能力追加成功率+5%',  sname: '+5%',      value: 'A02', fn: function(v){ return Math.min(v +  5, 100); }},
		{name: '能力追加成功率+10%', sname: '+10%',     value: 'A03', fn: function(v){ return Math.min(v + 10, 100); }},
		{name: '能力追加成功率+20%', sname: '+20%',     value: 'A04', fn: function(v){ return Math.min(v + 20, 100); }},
		{name: '能力追加成功率+30%', sname: '+30%',     value: 'A05', fn: function(v){ return Math.min(v + 30, 100); }}
	],
	additional: [
		{name: '指定なし',             value: 'B01'},
		{name: '特殊能力追加（HP）',   value: 'B02', extend: 100, effect: 'HP(+45)'},
		{name: '特殊能力追加（PP）',   value: 'B03', extend: 100, effect: 'PP(+5)'},
		{name: '特殊能力追加（打撃）', value: 'B04', extend: 100, effect: '打撃力(+25)'},
		{name: '特殊能力追加（射撃）', value: 'B05', extend: 100, effect: '射撃力(+25)'},
		{name: '特殊能力追加（法撃）', value: 'B06', extend: 100, effect: '法撃力(+25)'}
	]
};

/* 成功率グラフの色設定 */
Ext.chart.theme.Browser = Ext.extend(Ext.chart.theme.Base, {
	constructor: function(config) {
		Ext.chart.theme.Base.prototype.constructor.call(this, Ext.apply({
			colors: [
				'rgb(0, 0, 255)',
				'rgb(127, 255, 0)',
				'rgb(255, 215, 0)',
				'rgb(255, 165, 0)',
				'rgb(255, 69, 0)',
				'rgb(128, 10, 128)',
				'rgb(128, 0, 0)',
				'rgb(64, 64, 64)',
				'rgb(0, 0, 0)',
				'rgb(32, 0, 0)'
			]
		}, config));
	}
});

/*****************************************************************************
 * PSO2.ResultPanel
 * 結果表示パネル
 *
 * @author 助右衛門@8鯖
 * @since  2012/12/24
 *****************************************************************************/
Ext.define('PSO2.ResultPanel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.resultpanel',
	layout: 'anchor',
	baseCls: Ext.baseCSSPrefix + 'panel-body-default-framed ' + Ext.baseCSSPrefix + 'resultpanel',
	xtype: 'resultpanel',
	padding: '0',
	autoHeight: true,
	suspendCheckChange: 0,

	/** @cfg {String} constViewPanel @hide */
	constViewPanel: '-viewpanel',

	/** @cfg {String} constSelOption1 @hide */
	constSelOption1: '-selopt-1',

	/** @cfg {String} constSelOption2 @hide */
	constSelOption2: '-selopt-2',
	constSelOption3: "-selopt-3",

	/** @cfg {String} constChkOption1 @hide */
	constChkOption1: '-chkopt-1',

	/** @cfg {String} constSuccessPanel @hide */
	constSuccessPanel: '-successpanel',

	/** @cfg {String} emptyText @hide */
	emptyText: '&nbsp;',

	/**
	 * @property {String} dodoButtonText
	 * シミュレーションウィンドウ表示用ボタンのテキスト
	 */
	dodoButtonText: 'ドゥドゥる',

	/**
	 * @property {String} redodoButtonText
	 * リトライ用ボタンのテキスト
	 */
	redodoButtonText: 'リドゥドゥ',

	moreButtonText: "成功 or 10,000回",
	moreDodoLimit: 10000,

	/**
	 * @property {String} monimoniButtonText
	 * モニター表示用ボタンのテキスト
	 */
	monimoniButtonText: 'モニ？',

	ngsButtonText: "レガロ！",

	/**
	 * 以下はモニター用パラメータ算出のためのプロパティです
	 * ability.jsの特殊能力リストの効果(effect)から正規表現で数値を抜き取り
	 * 表出しています
	 */
	/* パラメータリスト(出力順序を配列により指定) */
	abText: [
		'打撃力', '射撃力', '法撃力',
		'打撃防御', '射撃防御', '法撃防御',
		'技量',
		'HP', 'PP',
		'打撃軽減', '射撃軽減', '法撃軽減',
		'炎耐性', '氷耐性', '雷耐性', '風耐性', '光耐性', '闇耐性'
	],

	/* "ALL"(アビ＆ミューテーション)時にアップするパラメータ一覧 */
	allUp: ['打撃力', '射撃力', '法撃力', '打撃防御', '射撃防御', '法撃防御', '技量'],

	/* "全属性耐性"時にアップするパラメータ一覧 */
	resistAll: ['打撃軽減', '射撃軽減', '法撃軽減', '炎耐性', '氷耐性', '雷耐性', '風耐性', '光耐性', '闇耐性'],

	atkAll: ["打撃力", "射撃力", "法撃力"],
	defAll: ["打撃防御", "射撃防御", "法撃防御"],

	/**
	 * @cfg {Ext.data.Store} optionStore1
	 * 能力追加成功率アップのアイテムを定義
	 *  name: オプション名
	 * value: ユニークな値(1文字目がoptionStore2と区別がつくように定義)
	 *    fn: 計算ロジック
	 */
	optionStore1: Ext.create('Ext.data.Store', {
		fields: ['id', 'name', 'value', 'fn'],
		data: {}
	}),

	/**
	 * @cfg {String} initOption1Value
	 * 初期表示オプション番号
	 */
	initOption1Value: 'A01',

	/**
	 * @property {Ext.data.Store} optionStore2
	 * 追加できる特殊能力のアイテムを定義
	 *   name: オプション名
	 * value: ユニークな値(1文字目がoptionStore1と区別がつくように定義)
	 * extend: 継承率
	 */
	optionStore2: Ext.create('Ext.data.Store', {
		fields: ['id', 'name', 'value', 'extend', 'effect'],
		data: {}
	}),

	excludePattern: [],

	/**
	 * @cfg {String} initOption2Value
	 * 初期表示オプション番号
	 */
	initOption2Value: 'B01',

	optionStore3: Ext.create("Ext.data.Store", {
		fields: ["id", "name", "value", "fn"],
		data: {}
	}),
	initOption3Value: "C01",

	/**
	 * @private
	 * @property {Number} totalValue
	 */
	totalValue: 0,

	/**
	 * @property {String} sameBonusText
	 * 同一ボーナス用ボタンのテキスト
	 */
	sameBonusText: "同名",

	/**
	 * @private {Array} sameBonusBoost
	 * 同一数による同一ボーナスのブースト値
	 * 1個 = 1, 2個 = 1.1, 3個以上 = 1.15
	 */
	sameBonusBoost: [1, 1.1, 1.15],

	/**
	 * @private {Function} calcSameBonus
	 * 同一ボーナス算出用関数
	 * @param v
	 * @param s 同一数
	 * @return 100を上限とするブースト後の成功確率
	 */
	calcSameBonus: function(v, s) {
		var me = this;

		return Math.min(parseInt(v.success * me.sameBonusBoost[PSO2.utils.overflow(me.sameBonusBoost.length, s + 1, 1)]), 100)
	},

	/**
	 * @private
	 * コンポーネントの初期化
	 */
	initComponent: function() {
		var me = this;

		/* 能力追加情報を生成 */
		me.abilitySet = Ext.create('PSO2.AbilitySet', {
			abilityComponent: me.abilityComponent,
			abilityStore: me.abilityComponent.getAbilityStore()
		});

		if (me.supportData) {
			me.optionStore1.loadData(me.supportData)
		}
		if (me.additionalData) {
			me.optionStore2.loadData(me.additionalData)
		}
		if (me.potentialData) {
			me.optionStore3.loadData(me.potentialData)
		}

		/* イベントの追加*/
		this.addEvents(
			/**
			 * @event opt1change
			 * @param {PSO2.ResultPanel} this 結果パネル
			 * @param {Ext.form.field.Field} item 選択されたアイテムフィールド
			 * @param {Boolean} init 初期値と同じ場合はTrueがセットされる
			 */
			'opt1change',

			/**
			 * @event opt2change
			 * @param {PSO2.ResultPanel} this 結果パネル
			 * @param {Ext.form.field.Field} item 選択されたアイテムフィールド
			 * @param {Boolean} init 初期値と同じ場合はTrueがセットされる
			 */
			'opt2change',
			'opt3change',

			/**
			 * @event dodochange
			 * @param {PSO2.ResultPanel} this 結果パネル
			 * @param {Boolean} newValue 新しい値
			 * @param {Boolean} oldValue 直前の値
			 */
			'dodochange',

			/**
			 * @event successchange
			 * @param {PSO2.ResultPanel} this 結果パネル
			 * @param {Number} newValue 新しい値
			 * @param {Number} oldValue 直前の値
			 */
			'successchange'
		);

		/* call parent */
		me.callParent(arguments);
	},

	/**
	 * @private
	 * 子ノードの初期化を行う
	 */
	initItems: function() {
		var me = this;

		me.resultItems = [];
		me.optionItems = [];

		/* 表示パネルの生成 */
		me.successStore = Ext.create('Ext.data.ArrayStore', {
			autoDestroy: true,
			storeId: me.id + '-store',
			idIndex: 0,
			fields: [
				{name: 'name', type: 'string'},
				{name: 'success', type: 'numeric'},
				{name: "dom", type: "numeric"}
			]
		});

		/* 表示パネル(iPadだとレイアウトが崩れてしまうためHTMLを記述) */
		me.viewPanel = Ext.create('Ext.view.View', {
			autoWidth: true,
			autoHeight: true,
			store: me.successStore,
			tpl: [
				'<table style="width:100%">',
					'<tpl for=".">',
					'<tr id="success">',
						'<td style="width:50%;padding-bottom:5px">{name}</td>',
						'<td style="width:50%;padding-bottom:5px">{success}%</td>',
					'</tr>',
					'</tpl>',
				'</table>',
				'<div style="clear:both"></div>'
			],
			itemSelector: 'tr#success'
		});

		/* 能力追加オプション1コンボボックスの生成 */
		me.selOpt1 = me.createComboBox(me.constSelOption1, me.optionStore1, me.initOption1Value,
			"opt1change");
		/* 能力追加オプション2コンボボックスの生成 */
		me.selOpt2 = me.createComboBox(me.constSelOption2, me.optionStore2, me.initOption2Value,
			"opt2change",
			function(item) {
				if (item.value == null || item.originalValue == item.value) {
					this.optionItems = []
				} else {
					this.optionItems = [this.getSelectOptionRecord(item)]
				}
			});

		me.selOpt3 = me.createComboBox(me.constSelOption3, me.optionStore3, me.initOption3Value,
			"opt3change");

		/* 同一ボーナス使用時のチェックボックス生成 */
		var gid = me.id + me.constChkOption1;
		me.chkOpt1 = Ext.create('Ext.form.Checkbox', {
			id: gid,
			labelWidth: 38,
			fieldLabel: me.sameBonusText,
			getSameCount: function() {
				if (!this.checked) return 0;

				var as = me.abilitySet,
					len = as.stores.length, i, cnt = 0;

				for (i = 0; i < len; i++) {
					cnt += as.stores[i].exist()? 1: 0;
				}

				/* 0以上 */
				return Math.max(0, cnt - 1);
			},
			listeners: {
				scope: me,
				change: function(parent, newValue, oldValue, eOpts) {
					this.refresh();
				}
			}
		});

		/* トータル能力追加成功率表示パネルの生成 */
		me.successPanel = Ext.create('Ext.panel.Panel', {
			id: me.id + me.constSuccessPanel,
			xtype: 'panel',
			html: me.emptyText,
			style: {
				textAlign: 'right'
			},
			padding: '0 0 5 0',
			anchor: '100%'
		});

		/* ドゥドゥるボタンの生成 */
		me.dodoButton = Ext.create('Ext.button.Button', {
			xtype: 'button',
			text: me.dodoButtonText,
			anchor: '50%',
			disabled: true,
			scope: me,
			handler: me.onClickDoDo
		});

		/* モニ？ボタンの生成 */
		me.patternButton = Ext.create('Ext.button.Button', {
			xtype: 'button',
			text: me.monimoniButtonText,
			anchor: '25%',
			disabled: true,
			scope: me,
			handler: me.onClickPattern
		});
		me.pattern2Button = Ext.create("Ext.button.Button", {
			xtype: "button",
			text: me.ngsButtonText,
			anchor: "25%",
			disabled: true,
			scope: me,
			handler: me.onClickPattern2
		});

		/* 子ノードの設定 */
		me.items = [me.viewPanel, me.selOpt1, me.selOpt2, me.selOpt3, me.chkOpt1, me.successPanel, me.dodoButton, me.patternButton, me.pattern2Button];

		/* コード値の頭1文字目によるアイテムの参照指定 */
		me.prefixOptions = me.prefixOptions || {};
		me.prefixOptions[me.initOption1Value.charAt(0)] = me.selOpt1;
		me.prefixOptions[me.initOption2Value.charAt(0)] = me.selOpt2;
		me.prefixOptions[me.initOption3Value.charAt(0)] = me.selOpt3;

		/* call parent */
		me.callParent(arguments);
	},

	createComboBox: function(f, b, d, a, c) {
		var e = this;
		return Ext.create("Ext.form.field.ComboBox", {
			id: e.id + f,
			store: b,
			displayField: "id",
			forceSelection: true,
			editable: false,
			queryMode: "local",
			valueField: "value",
			value: d,
			typeAhead: true,
			anchor: "100%",
			disabled: true,
			listeners: {
				scope: e,
				change: function(h, g) {
					if (Ext.isFunction(c)) {
						c.call(this, h)
					}
					if (g !== true) {
						this.refresh();
						this.fireEvent(a, this, h, h.originalValue == h.value)
					}
				}
			}
		})
	},

	/**
	 * 能力追加スロット用ストアへのバインド登録を行う
	 *
	 * @param {Ext.data.Store} store バインドするストアデータ
	 * @return {Boolean} 登録に成功した場合Trueを返却する
	 */
	bindStore: function(store) {
		var me = this;

		return me.abilitySet.putStore(store);
	},

	/**
	 * @private
	 * 特殊能力追加セレクトの指定された値を取得する
	 *
	 * @param {Ext.form.field.ComboBox} opt 特殊能力追加セレクト
	 * @return {Ext.data.Model} フィールドの値
	 */
	getSelectOptionRecord: function(opt) {
		return opt.findRecord('value', opt.getValue());
	},

	/**
	 * @private
	 * 特殊能力追加セレクトを選択する
	 *
	 * @param {String} v 選択するオプションの値
	 */
	selectOption: function(v) {
		var me = this,
			opt = me.prefixOptions[v.charAt(0)];

		if (opt) {
			opt.select(v);
		}
	},

	/**
	 * @private
	 * 結果表示パネルを再表示する
	 */
	refresh: function() {
		var me = this, vp = me.viewPanel, sp = me.successPanel,
			boostFn = evalStringToAny(me.getSelectOptionRecord(me.selOpt1).get('fn')),
			a = evalStringToAny(me.getSelectOptionRecord(me.selOpt3).get("fn")),
			sames = me.chkOpt1.getSameCount(), i, success = 100, ss = [], sss;

		/* 結果パネルの更新 */
		me.successStore.loadData(ss);
		me.successItems = me.abilityComponent.getSuccessList(me.abilitySet, me.resultItems,
			me.optionItems);

		/* 成功率の取得 */
		me.successItems = me.abilityComponent.getSuccessList(me.abilitySet, me.resultItems, me.optionItems);
		for (i = 0; i < me.successItems.length; i++) {
			sss = me.calcSameBonus(me.successItems[i], sames);
			sss = boostFn(sss);
			sss = a(sss);
			if (me.boostFunction) {
				/* キャンペーン用ブーストファンクション */
				if (me.successItems[i]["dom"]) {
					sss = me.boostFunction(sss, me.successItems[i]["dom"])
				} else {
					sss = me.boostFunction(sss)
				}
			}
			sss = Math.min(sss + me.abilitySet.isRensei(), 100);
			ss.push([me.successItems[i]['name'], sss]);

			success *= sss;
		}

		if (0 < ss.length) {
			me.successStore.loadData(ss);
		}

		/* トータル合成確立の更新 */
		var before = me.totalValue;
		if (me.successItems.length == 0) {
			me.totalValue = 0;
			sp.update(me.emptyText);
		} else {
			me.totalValue = success / Math.pow(100, i);
			sp.update(me.totalValue + '%');
		}

		/* アイテムの有効チェック */
		me.enableDoDoButton();
		me.enableOptionsSelect();

		if (before != me.totalValue) {
			me.fireEvent('successchange', me, me.totalValue, before);
		}
	},

	/**
	 * ドゥドゥれるかどうかをチェックする
	 *
	 * @return {Boolean}ドゥドゥれる場合はTrue,ドゥドゥれない場合はFalse
	 */
	isDodo: function() {
		var me = this;

/*
		return (0 < me.abilitySet.enableCheckMax && (me.abilitySet.enableCheckMax - 1) <= me.abilityCount());
*/
		return (0 < me.abilitySet.enableMaterialMaxCount() && 1 <= me.abilityCount())
	},

	/**
	 * ドゥドゥるボタンを有効にする
	 *
	 * 1つ以上の有効な能力が選択されていれば有効にする
	 */
	enableDoDoButton: function() {
		var me = this, button = me.dodoButton, b2 = me.patternButton,
			n = me.pattern2Button,
			state = button.isDisabled();

		if (me.isDodo()) {
			button.enable();b2.enable();n.enable();
			if (state) {
				// call event
				me.fireEvent('dodochange', me, true, false);
			}
		} else {
			button.disable();b2.disable();n.disable();
			if (!state) {
				// call event
				me.fireEvent('dodochange', me, false, true);
			}
		}
	},

	/**
	 * 現在選択されている能力(能力追加オプション含む)数を返却する
	 *
	 * @return {Number} 選択されている能力数
	 */
	abilityCount: function() {
		var me = this;

		return me.resultItems.length + me.optionItems.length;
	},

	/**
	 * 能力追加オプションを有効にする
	 */
	enableOptionsSelect: function() {
		var me = this;

		/* 能力追加成功率 */
		if (0 < me.abilityCount()) {
			me.selOpt1.enable();
			me.selOpt3.enable()
		} else {
			me.selOpt1.select(me.optionStore1.getAt(0));
			me.selOpt1.disable();
			me.selOpt3.select(me.optionStore3.getAt(0));
			me.selOpt3.disable()
		}

		/* 特殊能力追加 */
		if (me.resultItems.length < me.abilitySet.enableMaterialMaxCount()) {
			me.selOpt2.enable();
		} else {
			me.selOpt2.disable();
		}
	},

	/**
	 * 結果パネルにあるアイテムを全て削除する
	 */
	removeAll: function() {
		var me = this;

		me.resultItems = [];
		me.abilitySet.resetAbility();
		me.selOpt2.select(me.optionStore2.getAt(0));
	},

	/**
	 * 結果パネルの内容を更新する
	 *
	 * @param {Ext.form.FieldSet} fs チェックボックス群の親パネル
	 */
	updateResults: function(fs) {
		var me = this,
			stack = [], success;

		/* 表示されていない場合は終了 */
		if (!fs.rendered) return false;

		/* フィールドセットの情報をクリア */
		fs.removeAll(true);

		/* 結果パネルの情報をクリア */
		me.removeAll();

		/* 成功率を取得する */
		me.abilitySet.forEach(function(ability, e) {
			if (e !== true) {
				stack.push(ability);
			}
		}, me);
		success = me.abilityComponent.getSuccessList2(me.abilitySet, stack);

		/* チェックボックスを追加していく */
		/* my method */
		me.abilitySet.forEach(function(ability, e) {
			if (e) {
				fs.add({
					fieldStyle: "float:left",
					boxLabel: '<p class="x-factor-icon" style="float:left;margin-left:2px;padding-left:16px">' +
					ability.name + '</p><p style="float:right;padding-right:3px">100%</p>',
					inputValue: "*" + ability.code,
					abilityData: ability,
					resultPanel: me,
					fieldSet: fs
				})
			} else {
				if (success[ability['code']]) {
					fs.add({
						fieldStyle: 'float:left',
						boxLabel: '<p style="float:left;padding-left:3px">' + ability['name'] + '</p><p style="float:right;padding-right:3px">' + success[ability['code']] + '%</p>',
						inputValue: ability['code'],
						abilityData: ability,
						resultPanel: me,
						fieldSet: fs
					});
				}
			}
		}, me);

		/* 情報の更新 */
		me.refresh();
	},

	/**
	 * 有効にできる能力の最大数を返却する
	 *
	 * @return {Number} 有効にできる能力の最大数
	 */
	getEnableCheckMax: function() {
		return this.abilitySet.enableCheckMax;
	},

	getEnableMaxCount: function() {
		return this.abilitySet.enableMaterialMaxCount()
	},

	/**
	 * 結果パネルに表示されている能力コードを全て取得する
	 *
	 * @return {Array} 表示されている能力コード
	 */
	getValues: function() {
		var me = this,
			ret = [];

		Ext.Array.forEach(me.resultItems, function(chk) {
			ret.push(chk.inputValue);
		});

		return ret;
	},

	/**
	 * @private
	 * 排他パターンのチェックを行う
	 *
	 * @param {String} 特殊能力コード1
	 * @param {String} 特殊能力コード2
	 * @return {Boolean} 同時が不可の場合はTrueを返す
	 */
	isExcludePattern: function(code1, code2) {
		var m = this,
			l = Ext.isArray(m.excludePattern) ? m.excludePattern : [m.excludePattern];
		var g = l.length,
			d = code1.substr(0, 1) == "*",
			b = code2.substr(0, 1) == "*",
			h = d ? code1.substr(1, 2) : code1.substr(0, 2),
			f = b ? code2.substr(1, 2) : code2.substr(0, 2),
			r = /([^\*]+)\*$/,
			a, o = function(s, t) {
				if (a = s.match(r)) {
					return s.substr(0, a[1].length) == t.substr(0, a[1].length)
				}
				return s == t
			};
		if (h == f) {
			return true
		}
		for (var e = 0; e < g; e++) {
			var n = l[e],
				k = false,
				c;
			n = Ext.isArray(n) ? n : [n];
			for (c = 0; c < n.length; c++) {
				k = o(n[c], h);
				if (k) {
					break
				}
			}
			if (k) {
				for (c = 0; c < n.length; c++) {
					if (o(n[c], f)) {
						return true
					}
				}
			}
		}
		return false
	},

	/**
	 * 特殊能力を合成結果に追加する
	 *
	 * @param {Ext.form.Checkbox} item 追加する特殊能力追加アイテム
	 * @param {Boolean} silent 結果表示パネルの再描画を行わない場合Trueを指定
	 * @param {Number} 現在選択されている能力追加数
	 */
	addAbility: function(item, silent) {
		var me = this, stack = [],
			len = me.resultItems.length, i;

		for (i = 0; i < len; i++) {
			if (me.isExcludePattern(item.inputValue, me.resultItems[i].inputValue)) {
				/* 同じ系統の能力の場合チェックをオフにする */
				stack.push(me.resultItems[i]);
			}
		}
		for (i = 0; i < stack.length; i++) {
			stack[i].setValue(false);
		}

		/* アイテムを追加 */
		me.resultItems.push(item);
		if (silent !== true) {
			me.refresh();
		}

		return me.abilityCount();
	},

	/**
	 * 特殊能力を合成結果から削除する
	 *
	 * @param {Ext.form.Checkbox} item 削除する特殊能力追加アイテム
	 * @param {Boolean} silent 結果表示パネルの再描画を行わない場合Trueを指定
	 * @param {Number} 現在選択されている能力追加数
	 */
	removeAbility: function(item, silent) {
		var me = this,
			b = Ext.Array.indexOf(me.resultItems, item);

		me.resultItems.splice(b, 1);
		if (silent !== true) {
			me.refresh();
		}

		return me.abilityCount();
	},

	/**
	 * ドゥドゥさんのお導きのままに
	 *
	 * @param {Array} success 能力追加に成功した場合に追加される領域
	 * @param {Array} fail 能力追加に失敗した場合に追加される領域
	 * @return {Boolean} 素晴らしく運が良い場合にTrueが返却される
	 */
	doDo: function(success, fail) {
		var me = this,
			boostFn = evalStringToAny(me.getSelectOptionRecord(me.selOpt1).get('fn')),
			a = evalStringToAny(me.getSelectOptionRecord(me.selOpt3).get("fn")),
			sames = me.chkOpt1.getSameCount(), items = me.successItems,
			len = items.length, i, sss;

		if (0 < len) {
			for (i = 0; i < len; i++) {
				sss = me.calcSameBonus(items[i], sames);
				sss = boostFn(sss);
				sss = a(sss);
				if (me.boostFunction) {
					/* キャンペーン用ブーストファンクション */
					if (me.successItems[i]["dom"]) {
						sss = me.boostFunction(sss, me.successItems[i]["dom"])
					} else {
						sss = me.boostFunction(sss)
					}
				}
				sss = Math.min(sss + me.abilitySet.isRensei(), 100);

				if (100 <= sss || Math.floor(Math.random() * 100) < sss) {
					success.push({fieldLabel: items[i].name, name: (me.id + '-' + i), value: sss + '%'});
				} else {
					fail.push({fieldLabel: items[i].name, name: (me.id + '-' + i), value: sss + '%'});
				}
			}
		}

		return (0 < success.length) && (fail.length == 0);
	},

	/**
	 * トータルの合成成功確率をテキストで返却する
	 *
	 * @return {String} トータルの合成成功確率
	 */
	getTotalSuccess: function(s, f) {
		var html = 'Total: ' + s + ' / ' + (s + f) + ' = ';

		if (s == 0) {
			html += '0%';
		} else {
			html += Ext.util.Format.number((s / (s + f)) * 100, '0.000') + '%';
		}
		return html;
	},

	/**
	 * 選択済みオプションを取得する
	 */
	selectedOptions: function() {
		var me = this;

		return [me.selOpt1.value, me.selOpt2.value, me.selOpt3.value];
	},

	/**
	 * @private
	 * ドゥドゥるボタンクリック時に呼び出されるイベント処理
	 * 特殊能力追加の疑似シミュレーションを実行する
	 */
	onClickDoDo: function() {
		var me = this;

		if (0 < me.items.length) {
			var success = [], fail = [],
				s = me.doDo(success, fail);

			/* ドゥドゥウィンドウを表示 */
			me.win = Ext.create('widget.window', {
				title: '合成結果',
				autoDestroy: true,
				closable: true,
				closeAction: 'destroy',
				width: me.noDD === true ? Ext.getBody().getWidth() : Math.min(Ext.getBody().getWidth(), 600),
				height: 148 + (success.length + fail.length) * 26,
				modal: true,
				successNum: s? 1: 0,
				failNum: s? 0: 1,
				layout: 'anchor',
				bodyStyle: 'padding: 5px;',
				defaults: {
					anchor: '100%'
				},
				items: [{
					xtype: 'fieldset',
					frame: true,
					title: '能力追加成功',
					margins: '0 5 0 5',
					layout: 'anchor',
					autoHeight: true,
					defaultType: 'textfield',
					defaults: {
						readOnly: true,
						labelWidth: me.noDD === true? (Ext.getBody().getWidth() / 2): 140,
						anchor: '100%'
					},
					items: success
				}, {
					xtype: 'fieldset',
					frame: true,
					title: '能力追加失敗',
					margins: '0 5 0 5',
					layout: 'anchor',
					autoHeight: true,
					defaultType: 'textfield',
					defaults: {
						readOnly: true,
						labelWidth: me.noDD === true? (Ext.getBody().getWidth() / 2): 140,
						anchor: '100%'
					},
					items: fail
				}],
				dockedItems: [{
					xtype: 'toolbar',
					ui: 'footer',
					dock: 'bottom',
					items: [{
						xtype: 'label',
						readOnly: true,
						textAlign: 'right',
						html: me.getTotalSuccess(s? 1: 0, s? 0: 1),
						bodyStyle: {
							'float': 'hidden'
						}
					}, '->', Ext.create('Ext.button.Button', {
						text: me.redodoButtonText,
						scope: me,
						handler: function () {
							var success = [], fail = [],
								fs = this.win.query('fieldset'),
								ft = this.win.query('toolbar')[0].query('label');

							if (this.doDo(success, fail)) {
								this.win.successNum++;
							} else {
								this.win.failNum++;
							}
							fs[0].removeAll();
							fs[0].add(success);
							fs[1].removeAll();
							fs[1].add(fail);
							ft[0].update(this.getTotalSuccess(this.win.successNum, this.win.failNum));
						},
						minWidth: 64
					}), Ext.create("Ext.button.Button", {
						text: me.moreButtonText,
						scope: me,
						handler: function() {
							var h = [],
								f = [],
								e = this.win.query("fieldset"),
								k = this.win.query("toolbar")[0].query("label"),
								g = this.moreDodoLimit;
							while (!this.doDo(h, f) && g--) {
								this.win.failNum++;
								h = [];
								f = []
							}
							if (f.length == 0) {
								this.win.successNum++
							}
							e[0].removeAll();
							e[0].add(h);
							e[1].removeAll();
							e[1].add(f);
							k[0].update(this.getTotalSuccess(this.win.successNum, this.win
								.failNum))
						},
						minWidth: 64
					}), Ext.create('Ext.button.Button', {
						text: '閉じる',
						scope: me,
						handler: function() {
							if (this.win)
								this.win.close();
							delete this.win;
							this.win = null;
						},
						minWidth: 64
					})]
				}]
			}).show();
		}
	},

	/**
	 * @private
	 *
	 * 立っているビットの数を返す
	 */
	popCnt: function(n) {
		n >>>= 0;
		for (var i = 0; n; n &= n - 1) {
			i++;
		}
		return i;
	},
	probability: function(s) {
		var len = s.length, ret = 1;
		for (var i = 0; i < len; i++) {
			ret *= s[i];
		}
		return ret / Math.pow(100, len);
	},
	addition: function(s) {
		var len = s.length, sum = 0;
		for (var i = 0; i < len; i++) {
			sum += s[i];
		}
		return sum;
	},
	getSuccessPattern: function(drop, items, boostFn) {
		var me = this, len = items.length,
			p = 0x0001 << len,
			ret = [], i, j;

		for (i = 0; i < p; i++) {
			if (drop == me.popCnt(i)) {
				/* 落ちる数とマッチ */
				var s = [];
				for (j = 0; j < len; j++) {
					if (i & (0x001 << j)) {
						/* フラグが立っているアイテムだけ逆算(落ちる可能性) */
						s.push(100 - boostFn(items[j]));
					} else {
						/* それ以外は通常の確率 */
						s.push(boostFn(items[j]));
					}
				}
				/* 計算した確率をスタック */
				ret.push(me.probability(s));
			}
		}
		return me.addition(ret);
	},

	/**
	 *
	 */
	addAbilityParameter: function(p, name, value) {
		var me = this;
		if (name == "ALL") {
			for (var b = 0; b < me.allUp.length; b++) {
				me.addAbilityParameter(p, me.allUp[b], value)
			}
		} else if (name == "全属性耐性") {
			for (var b = 0; b < me.resistAll.length; b++) {
				me.addAbilityParameter(p, me.resistAll[b], value)
			}
		} else if (name == "打射法撃力") {
			for (var b = 0; b < me.atkAll.length; b++) {
				me.addAbilityParameter(p, me.atkAll[b], value)
			}
		} else if (name == "打射法撃防御") {
			for (var b = 0; b < me.defAll.length; b++) {
				me.addAbilityParameter(p, me.defAll[b], value)
			}
		} else {
			if (!p[name]) {
				p[name] = 0
			}
			p[name] += value
		}
	},

	onClickPattern2: function() {
		var d = this;
		if (0 < d.items.length) {
			var c = d.successItems,
				e = [];
			e.push(d.getSpecInfo2(c));
			e.push(d.changengs(c));
			d.win = Ext.create("widget.window", {
				title: "レガロ",
				autoDestroy: true,
				closable: true,
				closeAction: "destroy",
				width: d.noDD === true ? Ext.getBody().getWidth() : 800,
				autoHeight: true,
				modal: true,
				layout: "fit",
				bodyStyle: "padding: 5px;",
				items: Ext.createWidget("tabpanel", {
					activeTab: 0,
					defaults: {
						bodyPadding: 5
					},
					items: e
				}),
				dockedItems: [{
					xtype: "toolbar",
					ui: "footer",
					dock: "bottom",
					items: ["->", Ext.create("Ext.button.Button", {
						text: "閉じる",
						scope: d,
						handler: function() {
							if (this.win) {
								this.win.close()
							}
							delete this.win;
							this.win = null
						},
						minWidth: 105
					})]
				}]
			}).show()
		}
	},
	getSpecInfo2: function(l) {
		var m = this,
			b = m.abilitySet.abilityStore,
			o, d, h, a = {},
			k = [],
			n = new RegExp("([^\\(]+)\\(([\\+\\-]\\d+)\\)"),
			g = l.length,
			f = "",
			c;
		for (c = 0; c < g; c++) {
			o = b.findRecord("name", l[c].name) || m.optionStore2.findRecord("name",
				l[c].name);
			d = o.get("effectngs").replace(/<br>/g, "").split(",");
			for (j = 0; j < d.length; j++) {
				h = d[j].match(n);
				if (h && h.length == 3) {
					m.addAbilityParameter(a, h[1], parseInt(h[2]))
				} else {
					if (h === null) {
						k.push(d[j])
					}
				}
			}
		}
		for (c = 0; c < m.abText.length; c++) {
			if (a[m.abText[c]]) {
				if (a[m.abText[c]] < 0) {
					f += "<div>" + m.abText[c] +
						'<span style="color:blue;font-weight:bold">&nbsp;&nbsp;(' + a[m.abText[
							c]] + ")</span></div>"
				} else {
					f += "<div>" + m.abText[c] +
						'<span style="color:red;font-weight:bold">&nbsp;&nbsp;(+' + a[m.abText[
							c]] + ")</span></div>"
				}
			}
		}

		for (c = 0; c < k.length; c++) {
			f += "<div>" + k[c] + "</div>"
		}
		return {
			title: "性能",
			html: f
		}
	},


	changengs: function(l) {

		var m = this,
			b = m.abilitySet.abilityStore,
			o, d, d2, h, a, k1 = [],
			k2 = [],
			k3 = [],
			g = l.length,
			c, html;
		for (c = 0; c < g; c++) {
			o = b.findRecord("name", l[c].name) || m.optionStore2.findRecord("name",
				l[c].name);
			d = o.get("effectngs");
			d2 = o.get("namengs");
			k1.push(l[c]["name"])
			k2.push(d2)
			k3.push(d)
		}


		/* ヘッダ */
		html = '<table id="psn"><tr>';
		html += '<td id="psh" style="width:20%">' + "PSO2" + '</td>';
		html += '<td id="psh" style="width:20%">' + "NGS" + '</td>';
		html += '<td id="psh" style="width:60%">' + "効果" + '</td>';
		html += '</tr>';
		/* グラフ用データの作成 */
		for (c = 0; c < g; c++) {
			html += '<tr>';
			html += '<td style="width:20%">' + k1[c] + '</td>';
			html += '<td style="width:20%">' + k2[c] + '</td>';
			html += '<td style="width:60%">' + k3[c] + '</td>';
			html += '</tr>';
		}
		html += '</table>';
		return {
			title: "変換",
			html: html
		}
	},

	/**
	 * @private
	 * パターンボタンクリック時に呼び出されるイベント処理
	 */
	onClickPattern: function() {
		var d = this;
		if (0 < d.items.length) {
			var c = d.successItems,
				e = [],
				b = [],
				a = [];
			e.push(d.getSpecInfo(c));
			e.push(d.getSuccessTable(c, b, a));
			e.push(d.getSuccessGraph(c, b, a));
			e.push(d.getOrderView(c));
			d.win = Ext.create("widget.window", {
				title: "モニタですぅ～",
				autoDestroy: true,
				closable: true,
				closeAction: "destroy",
				width: d.noDD === true ? Ext.getBody().getWidth() : 600,
				autoHeight: true,
				modal: true,
				layout: "fit",
				bodyStyle: "padding: 5px;",
				items: Ext.createWidget("tabpanel", {
					activeTab: 0,
					defaults: {
						bodyPadding: 5
					},
					items: e
				}),
				dockedItems: [{
					xtype: "toolbar",
					ui: "footer",
					dock: "bottom",
					items: ["->", Ext.create("Ext.button.Button", {
						text: "閉じる",
						scope: d,
						handler: function() {
							if (this.win) {
								this.win.close()
							}
							delete this.win;
							this.win = null
						},
						minWidth: 105
					})]
				}]
			}).show()
		}
	},

	getSpecInfo: function(l) {
		var m = this,
			b = m.abilitySet.abilityStore,
			o, d, h, a = {},
			k = [],
			n = new RegExp("([^\\(]+)\\(([\\+\\-]\\d+)\\)"),
			g = l.length,
			f = "",
			c;
		for (c = 0; c < g; c++) {
			o = b.findRecord("name", l[c].name) || m.optionStore2.findRecord("name",
				l[c].name);
			d = o.get("effect").replace(/<br>/g, "").split(",");
			for (j = 0; j < d.length; j++) {
				h = d[j].match(n);
				if (h && h.length == 3) {
					m.addAbilityParameter(a, h[1], parseInt(h[2]))
				} else {
					if (h === null) {
						k.push(d[j])
					}
				}
			}
		}
		for (c = 0; c < m.abText.length; c++) {
			if (a[m.abText[c]]) {
				if (a[m.abText[c]] < 0) {
					f += "<div>" + m.abText[c] +
						'<span style="color:blue;font-weight:bold">&nbsp;&nbsp;(' + a[m.abText[
							c]] + ")</span></div>"
				} else {
					f += "<div>" + m.abText[c] +
						'<span style="color:red;font-weight:bold">&nbsp;&nbsp;(+' + a[m.abText[
							c]] + ")</span></div>"
				}
			}
		}
		for (c = 0; c < k.length; c++) {
			f += "<div>" + k[c] + "</div>"
		}
		return {
			title: "性能",
			html: f
		}
	},
	getSuccessTable: function(h, o, f) {
		var k = this,
			n = [],
			l = evalStringToAny(k.getSelectOptionRecord(k.selOpt3).get("fn")),
			g = h.length,
			b = k.selOpt1.store,
			c = b.count(),
			q, d;
		for (d = 0; d < g; d++) {
			q = k.calcSameBonus(h[d], k.chkOpt1.getSameCount());
			q = Math.min(q + k.abilitySet.isRensei(), 100);
			q = l(q);
			if (k.boostFunction) {
				if (k.successItems[d]["dom"]) {
					q = k.boostFunction(q, k.successItems[d]["dom"])
				} else {
					q = k.boostFunction(q)
				}
			}
			n.push(q)
		}
		var e = '<table id="ps"><tr><td id="psh"></td>';
		for (d = 0; d < c; d++) {
			rec = b.getAt(d);
			e += '<td id="psh" style="width:' + parseInt(88 / c) + '%">' + rec.get(
				"name") + "</td>"
		}
		e += "</tr>";
		var m;
		for (d = 0; d <= g; d++) {
			if (d == 0) {
				m = "成功"
			} else {
				if (d == g) {
					m = "全落ち"
				} else {
					m = d + "スロ落ち"
				}
			}
			e += '<tr><td id="ps">' + m + "</td>";
			f.push(m);
			for (j = 0; j < c; j++) {
				var a = k.getSuccessPattern(d, n, evalStringToAny(b.getAt(j).get("fn")));
				e += "<td";
				if (a == 1) {
					e += ' id="bold"'
				} else {
					if (0.8 < a) {
						e += ' id="high"'
					} else {
						if (a < 0.1) {
							e += ' id="low"'
						}
					}
				}
				e += ">" + Ext.util.Format.number(a * 100, "0.000") + "%</td>";
				o[j] = o[j] || {};
				if (d == 0) {
					o[j]["name"] = b.getAt(j).get("name")
				}
				o[j][m] = a * 100
			}
			e += "</tr>"
		}
		e += "</table>";
		return {
			title: "成功率パターン",
			html: e
		}
	},
	getSuccessGraph: function(d, c, b) {
		var a = d.length;
		return {
			xtype: "chart",
			title: "成功率グラフ",
			height: 160 + 24 * a,
			style: "background:#fff",
			animate: true,
			theme: "Browser:gradients",
			defaultInsets: 30,
			store: Ext.create("Ext.data.JsonStore", {
				fields: b,
				data: c
			}),
			legend: {
				position: "right"
			},
			axes: [{
				type: "Numeric",
				position: "left",
				fields: b,
				title: "Lost %",
				grid: true,
				decimals: 0,
				minimum: 0,
				maximum: 100
			}, {
				type: "Category",
				position: "bottom",
				fields: ["name"],
				title: "Usage"
			}],
			series: [{
				type: "area",
				axis: "left",
				highlight: true,
				tips: {
					trackMouse: true,
					width: 170,
					height: 28,
					renderer: function(f, e) {
						this.setTitle(e.storeField + " - " + Ext.util.Format.number(f.get(
							e.storeField), "0.000") + "%")
					}
				},
				xField: "name",
				yField: b,
				style: {
					lineWidth: 1,
					stroke: "#666",
					opacity: 0.86
				}
			}]
		}
	},
	getOrderView: function(d) {
		var f = this,
			c = d.length,
			b = [],
			a, e;
		for (e = 0; e < c; e++) {
			b.push({
				html: d[e]["name"]
			})
		}
		a = Ext.create("Ext.form.FieldSet", {
			frame: true,
			title: "特殊能力",
			margins: "0",
			width: "100%",
			layout: "column",
			autoHeight: true,
			defaults: {
				columnWidth: 0.5,
				border: 0,
				margin: "5 0 10 0",
				cls: "x-order-ability"
			},
			viewLimit: -1,
			viewAbility: false,
			stackAbility: [],
			capacityOver: false,
			items: b,
			getCount: function() {
				return this.items.length + this.stackAbility.length
			}
		});
		return {
			xtype: "panel",
			title: "並び順",
			layout: "column",
			items: [{
				xtype: "checkbox",
				boxLabel: "潜在／時限",
				fs: a,
				listeners: {
					scope: f,
					change: function(k, h, g, l) {
						a.viewAbility = h;
						f.updateOrderView(a, h != g)
					}
				}
			}, Ext.create("Ext.form.field.ComboBox", {
				fs: a,
				style: "marginLeft: 15px",
				store: Ext.create("Ext.data.ArrayStore", {
					autoDestroy: true,
					fields: [{
						name: "id",
						type: "numeric"
					}, {
						name: "name",
						type: "string"
					}],
					data: [
						[-1, "通常"],
						[6, "6スロ"],
						[8, "8スロ"]
					]
				}),
				displayField: "name",
				forceSelection: true,
				editable: false,
				queryMode: "local",
				valueField: "id",
				value: a.viewLimit,
				typeAhead: true,
				anchor: "100%",
				listeners: {
					scope: f,
					change: function(k, h, g, l) {
						a.viewLimit = h;
						f.updateOrderView(a, false)
					}
				}
			}), a]
		}
	},
	updateOrderView: function(c, e) {
		var b = c.getCount();
		if (e) {
			if (c.viewAbility) {
				c.insert(0, {
					html: "潜在／時限",
					cls: "x-order-with-ability"
				})
			} else {
				c.remove(c.items.getAt(0))
			}
		}
		if (c.capacityOver) {
			c.remove(c.items.getAt(c.items.length - 1));
			for (; 0 < c.stackAbility.length;) {
				c.add(c.stackAbility.pop())
			}
		}
		if (c.viewLimit != -1) {
			if (c.viewLimit < c.getCount()) {
				for (; c.viewLimit <= c.items.length;) {
					var d = c.items.getAt(c.items.length - 1);
					c.stackAbility.push({
						html: d.el.dom.textContent
					});
					c.remove(d)
				}
			} else {
				for (; c.items.length <= c.viewLimit && 0 < c.stackAbility.length;) {
					c.add(c.stackAbility.pop())
				}
			}
		}
		if (0 < c.stackAbility.length) {
			c.add({
				html: "…他" + c.stackAbility.length + "種"
			});
			c.capacityOver = true
		} else {
			c.capacityOver = false
		}
	}
});

/**
 * 指定された文字列表現を JavaScript として評価した結果を返します
 * @param {string} _str 文字列
 * @returns 文字列表現を JavaScript として評価した結果
 */
const evalStringToAny = function(_str) {
	let result
	eval(`result = ${_str}`)
	return result
}
