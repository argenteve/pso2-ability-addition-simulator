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
 * synthesis.js
 * PSO2 能力追加シミュレーター
 *
 * このJavaScriptを利用するには、JSフレームワーク「ExtJS 4.0.7」が必要です。
 * http://www.sencha.com/products/extjs/download/
 *
 * このファイルより先に同梱の「ability.js」「result.js」をロードし、
 * HTML文書bodyタグ内の「<div class="viewport"></div>」を記述、
 * 以下のコードを書くことによりコンポーネントが挿入されます。
 *
 * Ext.onReady(function() {
 *     Ext.create('PSO2.SynthesisComponent', {
 *         outputViewport: 'viewport'
 *     });
 * });
 *
 * [注意事項]
 * 再配布・二次利用などは自由に行って頂いてOKです。
 * 情報が不確定な個所(継承・生成率など)、SEGA(R)公式による仕様変更は随時修正を行ってください。
 * 改変、ロジックの最適化などは自己責任でお願いします。
 *
 * [更新履歴]
 * @version 0.1 2012/12/24
 *     初回版アップしました。
 * @version 0.2 2012/12/26
 *     スマホ（ドラッグ&ドロップ非対応ブラウザ）を仮対応、
 *     合成パネルのURL制限を20から10へ縮小しました。
 * @version 0.2a 2012/12/27
 *     フォトンコレクトでアビリティの継承率があがる不具合を修正しました。
 * @version 0.21 2013/01/11
 *     ミューテーションIとソールによる継承率アップを同時に利用された場合、
 *     ミューテーションIが優先になるように修正しました。
 * @version 0.3 2013/03/04
 *     合成内容の状態をクッキーに保存・復元できるようにしました。
 * @version 0.4 2013/03/05
 *     レシピ例(仮)をメニュー追加しました。
 *     合成確率を常に表示するように変更しました。
 *     能力一覧をグルーピングしました。
 * @version 0.4a 2013/03/08
 *     ウィンクルムを追加しました。
 *     継承・生成確率はスティグマと同じ設定で行いました。
 * @version 0.4b 2013/03/28
 *     クロームソールを追加しました。
 * @version 0.4c 2013/04/11
 *     ゴロンソール、エクスソールを追加しました。
 * @version 0.5 2013/05/16
 *     エクストリーム実装に伴いフリクト・アルター系を追加しました。
 *     フォトンコレクトの属性耐性生成ボーナスを設定しました。
 *     状態異常4系、5系の継承率に誤りがあったのを修正しました。
 * @version 0.6 2013/06/13
 *     ペルソナ・ソール(射撃防御+30,HP+10,PP+2)、
 *     クーガー・ソール(打撃力+15,射撃力+15,法撃力+15,技量+15,HP+10,PP+2)を追加しました。
 *     期間限定「WEB連動パネル報酬」の特殊能力追加成功率+10%が選択できるようにしました。
 * @version 0.61 2013/06/18
 *     モデュレイター(打撃力+30,射撃力+30,法撃力+30)の継承率を2個=30%、3個=80%で追加しました。
 *     ステータスV系の継承率を仮対応しました。
 *     素体または素材の特殊能力を、右クリックを押すことでコピーができるようにしました。
 * @version 0.62 2013/07/10
 *     IE8で動作しない不具合を修正しました。
 * @version 0.7 2013/07/05
 *     コスト算出の作成途中までをアップ
 * @version 0.75 2013/07/18
 *     オルグ・ソール(打撃力+20,射撃力+20,HP+10)、バル・ソール(射撃力+20,法撃力+20,HP+10)を追加しました。
 *     特殊能力追加に打撃（パワーブースト）、射撃（シュートブースト）、法撃（テクニックブースト）を追加しました。
 *     コスト算出機能を追加しました。（PCブラウザ限定）
 * @version 1.0 2013/09/06
 *     リンガ・ソール(打撃力+20,法撃力+20,HP+10)、リーリー・ソール(打撃力+20,打撃防御+20,HP+10)、
 *     ソーマ・ソール(打撃力+20,射撃力+20,PP+2)を追加しました。
 *     タブパネルのコピーができるように追加しました。
 * @version 1.0 2013/09/30
 *     素材を2個使用した場合の、7スロットから8スロットEX拡張時の確率を35%→30%へ修正しました。
 * @version 1.0 2013/10/24
 *     ラタン・フィーバー(法撃力+10,技量+5,PP+2)を追加しました。
 * @version 1.0 2013/11/14
 *     メデューナ・ソール(打撃力+20,射撃力+20,HP+5,PP+1)を追加しました。
 *     マリューダ・ソール(打撃力+20,法撃力+20,PP+2)を追加しました。
 *     一部ソールの能力にて、PPの修正を行いました。
 * @version 1.0 2013/12/20
 *     セント・フィーバー(射撃力+10,技量+5,PP+2)を追加しました。
 *     ビブラス・ソール(射撃力+20,法撃力+20,HP+5,PP+1)を追加しました。
 * @version 1.0 2013/12/25
 *     レシピ例に「EX拡張」を追加、ドゥドゥ運試しができます。
 *     キャンペーン用ブーストをチェックボックスからプルダウンメニューへ変更しました。
 * @version 1.1 2014/02/26
 *     パターン(モニ？)を追加
 * @version 1.2_beta 2014/03/05
 *     同一アイテム時の確率アップを追加
 * @version 1.2 2014/03/05
 *     同一アイテム使用時による成功率上昇を対応しました。
 *     エクステンドスロット使用時の成功率上昇を対応しました。
 * @version 1.21 2014/03/11
 *     リターナーI,II,IIIを追加しました。
 *     完成品のステータス上昇を一覧で見れるようにしました。
 * @version 1.3 2014/04/25
 *     ソールレセプターへの対応
 * @version 1.31 2014/11/20
 *     素材を5個に対応するため以下を変更しました
 *     1) 素材の個数を指定するmaxMaterialを設定(初期値2)
 *     2) URLパラメータを従来のs,a,b,r,oからs,1～5,r,oに変更
 *     3) 同一ボーナスをチェックボックスに変更
 *     4) 生成率・継承率を既存の範囲を超える場合、エラーにならないよう対応
 *     5) レシピ例が長くて邪魔なのでコメントアウト
 * @version 1.32 2014/11/21
 *     データをJSON形式で外部保存しAjaxで取り込むように変更
 *
 *****************************************************************************/
Ext.ns('PSO2');

const HEADER_NAMES = {
	'A': 'ステータス',
	'A+': 'ステータス(特殊)',
	'A++': 'フレイズ・センテンス',
	'AB': 'S級特殊能力(武器)',
	'AB+': 'S級特殊能力(ユニット)',
	'B': 'カタリスト・特殊系',
	'C': 'レセプター',
	'D': 'ソール',
	'D+': 'フィーバー',
	'E': 'レジスト',
	'E+': '状態異常付与',
	'E++': '倍率特効',
	'E+++': 'ブースト'
}

/* グリッドの変更チェックを行わないようオーバーライド */
Ext.override(Ext.data.Record, {
	isModified: function(fieldName) {
		return false;
	}
});

/* 英語表記を日本語にオーバーライド */
Ext.override(Ext.grid.header.Container, {
	sortAscText: '並び替え(昇順)',
	sortDescText: '並び替え(降順)',
	sortClearText: '解除',
	columnsText: '表示カラム'
});
Ext.override(Ext.tab.Tab, {
	closeText: 'タブを閉じる'
});

Ext.define('PSO2.TabCloseMenu', {
	extend: 'Ext.tab.TabCloseMenu',
	closeTabText: 'このタブを閉じる',
	closeText: 'このタブを閉じる',
	closeOthersTabsText: 'これ以外を閉じる',
	closeAllTabsText: '全てのタブを閉じる',
	onAfterLayout: function() {
		var a = {
			scope: this,
			delegate: "div.x-tab"
		};
		a[this.menuTrigger] = function(c, d) {
			var b = this;
			if (b.tabBar.getChildByElement(d)) {
				b.onContextMenu(c, d)
			}
		};
		this.mon(this.tabBar.el, a)
	}
});

/**
 * 能力一覧グリッドのグループヘッダー名を強制出力する
 */
Ext.define('PSO2.GridGrouping', {
	extend: 'Ext.grid.feature.Grouping',
	enableGroupingMenu: false,
	startCollapsed: true,
	groupHeaderTpl: '{[this.getHeaderName(values)]}',
	getFragmentTpl: function() {
		return Ext.apply(this.callParent(arguments) || {}, {
			getHeaderName: this.getHeaderName
		});
	},
	getHeaderName: function(values) {
		const value = values['name']
		if (value && HEADER_NAMES[value]) return HEADER_NAMES[value]
		return 'その他';
	}
});

/*****************************************************************************
 * PSO2.SynthesisComponent
 * 特殊能力追加コンポーネント
 *
 * noDDにTrueをせっとすることで、ドラッグ&ドロップ非対応の端末でもシミュレート
 * が可能
 *
 * @author 助右衛門@8鯖
 *****************************************************************************/
Ext.define('PSO2.SynthesisComponent', {
	extend: 'Ext.container.Container',

	/**
	 * @property {String} version
	 * 当コンポーネントのバージョン
	 */
	version: '19.2',

	/**
	 * @property {String} title
	 * タイトル
	 */
	title: 'PSO2 能力追加シミュレーター',

	/**
	 * @property {String} constCookieName
	 * クッキー保存名称
	 */
	constCookieName: 'pso2dodo',

	/**
	 * @property {String} outputViewport
	 * 出力先HTMLのクラス名(default 'viewport')
	 */
	outputViewport: false,

	/**
	 * @property {Number} limitUrlSize
	 * URL生成の制限サイズ(default 10)
	 */
	limitUrlSize: 10,

	/**
	 * @property {Number} maxMaterial
	 * 素材の最大数
	 */
	maxMaterial: 5,

	/**
	 * @property {Boolean} noDD
	 * ドラッグ&ドロップが利用できない端末の場合Trueをセット
	 */

	/**
	 * @cfg {Array} locationHash @hide
	 * URLハッシュを保持する
	 */

	/**
	 * @cfg {Ext.panel.Panel} currentTabItem @hide
	 * @private
	 * 選択中のタブパネルがセットされる
	 */
	currentTabItem: null,

	/**
	 * @cfg {Object} selectedGridCell @hide
	 * @private
	 * 選択中のグリッドのセル情報を保存する
	 */
	selectedGridCell: null,

	/**
	 * キャンペーン用テキスト
	 */
	boostCampaign: true,

	/**
	 * お薦めレシピ(仮)のメニュー
	 */
	getRecommendRecipe: true,
	/* 以下はレシピメニューを作成する場合の例 */
/*
	getRecommendRecipe: function() {
		var me = this;

		return [{
			text: '4スロ',
			menu: [{
				text: 'ソール+ステIII+アビIII+ブースト',
				scope: me,
				handler: function() {
					this.selectLoadData(null, {
						s: 'RA11.ZA01.ZB01.ZC01',
						1: 'RA11.AC03.AA03.ZD01',
						2: 'RA11.AC03.AB03.ZE01',
						3: 'RA11.AC03.AB03.ZE01',
						4: '',
						5: '',
						r: 'RA11.AC03.FA03',
						o: 'B02.A04'
					});
				}
			}]
		}];
	},
*/

	getRecommendRecipe: function() {
		var me = this;
		return [{
			text: 'アストラル',
			menu: [{
				text: 'アストラル・ソール',
				scope: me,
				handler: function() {
					this.selectLoadData(null, {
						s: 'RZ01.ZA01.ZB01.ZC01.ZD01',
						1: 'ZA01.ZB01.ZC01.ZD01.ZH01',
						2: 'VJ01.ZA01.ZB01.ZC01.ZD01',
						3: 'VJ01.ZA01.ZB01.ZC01.ZE01',
						4: 'VJ01.ZA01.ZB01.ZC01.ZF01',
						5: 'VJ01.ZA01.ZB01.ZC01.ZG01',
						r: '',
						o: ''
					});
				}
			}, {
				text: 'ソール・カタリスト',
				scope: me,
				handler: function() {
					this.selectLoadData(null, {
						s: 'RC23.ZA01.ZB01.ZC01.ZD01',
						1: 'RP55.ZA01.ZB01.ZC01.ZD01',
						2: 'ROC2.ZA01.ZB01.ZC01.ZE01',
						3: 'RQ01.ZA01.ZB01.ZC01.ZF01',
						4: 'RI22.ZA01.ZB01.ZC01.ZG01',
						5: 'ZA01.ZB01.ZC01.ZD01.ZH01',
						r: '',
						o: ''
					});
				}
			}]
		}, {
			text: 'ファクター',
			menu: [{
				text: 'エーテル・ファクター',
				scope: me,
				handler: function() {
					this.selectLoadData(null, {
						s: 'SB01.ZA01.ZB01.ZC01.ZD01',
						1: 'ZA01.ZB01.ZC01.ZD01.ZH01',
						2: 'VJ02.ZA01.ZB01.ZC01.ZD01',
						3: 'VJ02.ZA01.ZB01.ZC01.ZE01',
						4: 'VJ02.ZA01.ZB01.ZC01.ZF01',
						5: 'VJ02.ZA01.ZB01.ZC01.ZG01',
						r: '',
						o: ''
					});
				}
			}, {
				text: 'ファクター・カタリスト',
				scope: me,
				handler: function() {
					this.selectLoadData(null, {
						s: 'TG01.ZA01.ZB01.ZC01.ZD01',
						1: 'TG02.ZA01.ZB01.ZC01.ZD01',
						2: 'TG03.ZA01.ZB01.ZC01.ZE01',
						3: 'ZA01.ZB01.ZC01.ZD01.ZF01',
						4: 'ZA01.ZB01.ZC01.ZD01.ZG01',
						5: 'ZA01.ZB01.ZC01.ZD01.ZH01',
						r: '',
						o: ''
					});
				}
			}, {
				text: 'エーテル・ソール',
				scope: me,
				handler: function() {
					this.selectLoadData(null, {
						s: 'SC01.ZA01.ZB01.ZC01.ZD01',
						1: 'SC03.ZA01.ZB01.ZC01.ZD01',
						2: 'ZA01.ZB01.ZC01.ZD01.ZE01',
						3: 'ZA01.ZB01.ZC01.ZD01.ZF01',
						4: 'ZA01.ZB01.ZC01.ZD01.ZG01',
						5: 'ZA01.ZB01.ZC01.ZD01.ZH01',
						r: '',
						o: ''
					});
				}
			}]
		}, {
			text: 'レヴリー',
			menu: [{
				text: 'マナ・レヴリー',
				scope: me,
				handler: function() {
					this.selectLoadData(null, {
						s: 'ZA01.ZB01.ZC01.ZD01.ZE01',
						1: 'ZA01.ZB01.ZC01.ZD01.ZH01',
						2: 'VJ03.TL01.ZB01.ZC01.ZD01',
						3: 'VJ03.ZA01.ZB01.ZC01.ZE01',
						4: 'VJ03.ZA01.ZB01.ZC01.ZF01',
						5: 'VJ03.ZA01.ZB01.ZC01.ZG01',
						r: '',
						o: ''
					});
				}
			}, {
				text: 'レヴリー・カタリスト',
				scope: me,
				handler: function() {
					this.selectLoadData(null, {
						s: 'TJ02.ZA01.ZB01.ZC01.ZD01',
						1: 'TJ03.ZA01.ZB01.ZC01.ZD01',
						2: 'TJ04.ZA01.ZB01.ZC01.ZE01',
						3: 'TJ05.ZA01.ZB01.ZC01.ZF01',
						4: 'TJ06.ZA01.ZB01.ZC01.ZG01',
						5: 'ZA01.ZB01.ZC01.ZD01.ZH01',
						r: '',
						o: ''
					});
				}
			}, {
				text: 'オメガ・メモリア',
				scope: me,
				handler: function() {
					this.selectLoadData(null, {
						s: 'TJ01.ZA01.ZB01.ZC01.ZD01',
						1: 'SC04.ZA01.ZB01.ZC01.ZD01',
						2: 'SC05.ZA01.ZB01.ZC01.ZE01',
						3: 'ZA01.ZB01.ZC01.ZD01.ZF01',
						4: 'ZA01.ZB01.ZC01.ZD01.ZG01',
						5: 'ZA01.ZB01.ZC01.ZD01.ZH01',
						r: '',
						o: ''
					});
				}
			}]
		}, {
			text: '複合',
			menu: [{
				text: 'アスエテマナリタ',
				scope: me,
				handler: function() {
					this.selectLoadData(null, {
						s: 'VJ03.TL01.VN01',
						1: 'SA01.TG10.ZA01',
						2: 'VJ03.TE04.ZA01',
						3: 'VJ03.TE04.ZA01',
						4: 'VJ03.TE04.ZA01',
						5: 'XA01.XF01.ZB01',
						r: 'SA01.TG10.TJ10.TE05',
						o: ''
					});
				}
			}, {
				text: 'アスエテマナクラ',
				scope: me,
				handler: function() {
					this.selectLoadData(null, {
						s: 'VJ03.TL01.VN01',
						1: 'SA01.TG10.ZA01',
						2: 'VJ03.TM04.ZA01',
						3: 'VJ03.TM04.ZA01',
						4: 'VJ03.TM04.ZA01',
						5: 'XA01.XF01.ZB01',
						r: 'SA01.TG10.TJ10.TM05',
						o: ''
					});
				}
			}, {
				text: 'アスエテリタクラ',
				scope: me,
				handler: function() {
					this.selectLoadData(null, {
						s: 'VN01.ZA01.ZB01',
						1: 'SA01.TG10.ZA01',
						2: 'TE04.TM04.ZA01',
						3: 'TE04.TM04.ZA01',
						4: 'TE04.TM04.ZA01',
						5: 'XA01.XF01.ZB01',
						r: 'SA01.TG10.TE05.TM05',
						o: ''
					});
				}
			}, {
				text: 'アスエテマナリタクラ',
				scope: me,
				handler: function() {
					this.selectLoadData(null, {
						s: 'VJ03.TL01.VN01.ZA01',
						1: 'SA01.TG10.ZA01.ZB01',
						2: 'VJ03.TE04.TM04.ZA01',
						3: 'VJ03.TE04.TM04.ZA01',
						4: 'VJ03.TE04.TM04.ZA01',
						5: 'XA01.XF01.ZA01.ZB01',
						r: 'SA01.TG10.TJ10.TE05.TM05',
						o: ''
					});
				}
			}]
		}];
	},
	factorMenuText: {
		on: "因子化する",
		off: "因子化を解除する"
	},


	/**
	 * コンストラクタ
	 *
	 * @param {Object} config インスタンス生成時の設定情報
	 */
	constructor : function(config) {
		var me = this, items;

		/* 設定情報を反映 */
		Ext.apply(me, config);

		/* アビリティコンポーネントを生成 */
		var params = {};
		if (me.ajaxData) {
			/* 定義を上書き */
			if (me.ajaxData.abilityList)
				params['constAbility'] = me.ajaxData.abilityList;
			if (me.ajaxData.extraSlot)
				params['constExtra'] = me.ajaxData.extraSlot;
			if (me.ajaxData.boostPoint)
				params['constBoostPoint'] = me.ajaxData.boostPoint;
			if (me.ajaxData.extendAbility)
				params['constExtendAbility'] = me.ajaxData.extendAbility;
		}
		me.ability = Ext.create('PSO2.AbilityComponent', params);

		/* 子ノード領域の作成 */
		if (me.items) {
			if (!Ext.isArray(me.items)) {
				items = [me.items];
			} else {
				items = me.items;
			}
			delete me.items;
		} else {
			items = [];
		}

		/* ヘッダの表出 @@@@@ 自身のブログ宣伝などにご利用下さい @@@@@ */
		items.push({
			cls: 'app-header',
			region: 'north',
			height: 30,
			layout: 'fit',
			hidden: me.noDD,
			html: [
				'<div class="x-top-title">',
					me.title + ' ver ' + me.version + '&nbsp;',
					'<span class="x-top-author">',
					'<a href="http://rxio.blog.fc2.com/?tag=PSO2" style="text-decoration:none">Pulsar@倉庫絆</a>&nbsp;&amp;&nbsp;',
					'copyright &copy; 2014 <a target="_blank" href="http://pso2numao.web.fc2.com/dodo/" style="text-decoration:none">助右衛門@ship8</a>',
					'</span>',
				'</div>'
			].join("")
		});
		/* フッタの表出 @@@@@ 自身のブログ宣伝などにご利用下さい(外しても問題ありません) @@@@@ */
/*
		items.push({
			region: 'south',
			frame: false,
			border: 0,
			html: [
				'<div style="text-align:right">',
				'copyright &copy; 2014 <a target="_blank" href="http://pso2numao.web.fc2.com/dodo/" style="text-decoration:none">助右衛門@ship8</a>&nbsp;',
				'JavaScript framework <a href="http://www.sencha.com/products/extjs/" style="text-decoration:none">ExtJS</a>',
				'</div>'
			].join("")
		});
*/
		/* パネルの名称 */
		me.panelNames = ['素体'];
		for (var i = 1; i <= me.maxMaterial; i++) {
			me.panelNames.push('素材' + i);
		}

		if (me.noDD !== true) {
			/* ドラッグ&ドロップが可能な端末の場合アビリティグリッドを生成 */
			me.abilityGrid = Ext.create('Ext.grid.Panel', {
				title: '特殊能力',
				region: 'west',
				collapsible: true,
				floatable: true,
				split: true,
				forceFit: true,
				sortableColumns: false,
				scroll: false,
				columns: [{
					dataIndex: 'name',
					header: '能力',
					width: 136,
					filterable: true,
					filter: {
						type: 'string'
					}
				}, {
					dataIndex: 'effect',
					header: '効果',
					width: 157,
					filter: {
						type: 'string'
					},
					renderer: function (value, meta, record) {
						if (record.get('extup')) {
							var bonus = [];
							Ext.Array.forEach(record.get('extup'), function(v) {
								var ab = this.ability.findAbilityName(v.length == 2 ? v + "01" : v);
								if (ab) {
									bonus.push(v.length == 2 ? ab.get("name").replace(/[IV]+$/, "") :
									ab.get("name"))
								}
							}, me);
							meta.tdAttr = 'data-qtip="' + bonus.join(",") + 'の継承・生成ボーナス"'
						}
						if (record.get("sopget")) {
							meta.tdAttr = 'data-qtip="' + record.get("sopget") + '"'
						}
						return value
					}
				}],
				features: [{
					ftype: 'filters',
					encode: false,
					local: true,
					menuFilterText: '検索',
					filters: [{
						type: 'string',
						dataIndex: 'name'
					}, {
						type: 'string',
						dataIndex: 'effect'
					}]
				},
					Ext.create('PSO2.GridGrouping')
				],
				viewConfig: {
					altRowCls: 'x-grid-row-group',
					style: {
						overflow: 'auto',
						overflowX: 'hidden'
					},
					listeners: {
						render: me.initializeAbilityDragZone
					},
					doStripeRows: function(startRow, endRow) {
						// ensure stripeRows configuration is turned on
						if (this.stripeRows) {
							var rows   = this.getNodes(startRow, endRow),
								rowsLn = rows.length,
								i      = 0,
								row, rec, beforeCd = '';

							for (; i < rowsLn; i++) {
								row = rows[i];
								rec = this.getRecord(row);

								row.className = row.className.replace(this.rowClsRe, ' ');
								if (rec.get('code').substring(0, 2) !== beforeCd) {
									startRow++;
									beforeCd = rec.get('code').substring(0, 2);
								}

								if (startRow % 2 === 0) {
									row.className += (' ' + this.altRowCls);
								}
								if (rec.get("cls")) {
									row.className += (" " + rec.get("cls"))
								}
							}
						}
					}
				},
				store: me.ability.getAbilityStore()
			});
			items.push(me.abilityGrid);
		} else {
			/* ドラッグ&ドロップが不可能な端末の場合アビリティメニューを生成 */
			me.abilityWindow = Ext.create('widget.window', {
				title: '特殊能力',
				autoDestroy: false,
				closable: true,
				closeAction: 'hide',
				modal: true,
				bodyStyle: 'padding:5px;',
				autoScroll: true,
				items: Ext.create('Ext.grid.Panel', {
					store: me.ability.getAbilityStore(),
					forceFit: true,
					scroll: false,
					columns: [{
						dataIndex: 'name',
						header: '能力',
						filter: {
							type: 'string'
						}
					}, {
						dataIndex: 'effect',
						header: '効果',
						filter: {
							type: 'string'
						}
					}],
					viewConfig: {
						style: {
							overflow: 'auto',
							overflowX: 'hidden'
						},
						listeners: {
							scope: me,

							/* セルクリック時に呼び出されるイベント処理 */
							cellclick: function(view, cell, cellIndex, record, row, rowIndex, e) {
								/* 選択されいるグリッドへ特殊能力をセット */
								if (this.selectedGridCell) {
									this.selectedGridCell.view.getStore().addAbility(record.data);
								}

								/* ウィンドウを閉じる */
								this.selectedGridCell = null;
								this.abilityWindow.hide();
							}
						}
					}
				})
			});
		}

		/* タブパネルを生成 */
		me.tabPanel = Ext.createWidget('tabpanel', {
			resizeTabs: true,
			enableTabScroll: true,
			defaults: {
				autoScroll: true,
				bodyPadding: 1
			},
			plugins: Ext.create('PSO2.TabCloseMenu', {
				menuTrigger: (me.noDD ? "click" : "contextmenu"),
				extraItemsTail: ['-', {
					text: "スロットをゴミで埋める",
					scope: me,
					handler: function() {
						var g = this.tabPanel.plugins[0],
							h = this.findLocationHashBy(g.item);
						if (0 <= h) {
							this.tabPanel.items.getAt(h).fillDuster()
						}
					}
				}, {
					text: 'この内容を別へコピー',
					scope: me,
					handler: function() {
						var me = this,
							closeMenu = this.tabPanel.plugins[0],
							index = this.findLocationHashBy(closeMenu.item);

						if (0 <= index) {
							this.selectLoadData(null, this.locationHash[index]);
						}
					}
				}],
				listeners: {
					scope: me,
					aftermenu: function () {
						this.currentTabItem = null;
					}
				}
			}),
			listeners: {
				scope: me,

				/* タブが閉じるられる直前に呼び出されるイベント処理 */
				beforeremove: function(tab, panel) {
					if (panel.$className != 'PSO2.CostPanel') {
						this.removeLocationHash(panel);
					}
				}
			}
		});

		/* メインパネルを生成(子ノードにタブパネルを設定) */
		var mainPanelItems = [Ext.create('Ext.Action', {
			iconCls: 'x-add-icon',
			text: 'パネル追加',
			scope: me,
			handler: function() {
				/* フォーカスを変更 */
				this.tabPanel.setActiveTab(this.addTab());
			}
		}), Ext.create('Ext.Action', {
			iconCls: 'x-save-icon',
			text: '内容を保存',
			scope: me,
			handler: me.saveData
		}), Ext.create('Ext.Action', {
			iconCls: 'x-load-icon',
			text: '内容を復元',
			scope: me,
			handler: me.loadData
		})];

		if (me.noDD !== true) {
			/* コスト算出(PC限定) */
			mainPanelItems.push(Ext.create('Ext.button.Button', {
				iconCls: 'x-cost-icon',
				text: 'コスト算出',
				pressed: false,
				enableToggle: false,
				scope: me,
				handler: function (item) {
					if (!this.costPanel) {
						this.costPanel = Ext.create('PSO2.CostPanel', {
							title: 'コスト算出',
							autoDestroy: true,
							noDD: this.noDD,
							tabPanel: this.tabPanel,
							maxMaterial: this.maxMaterial,
							supportData: this.ajaxData.optionList.support,
							additionalData: this.ajaxData.optionList.additional
						});
						this.tabPanel.insert(0, this.costPanel);
						this.tabPanel.setActiveTab(0);
					} else {
						this.tabPanel.setActiveTab(this.costPanel);
/* remove
						me.tabPanel.remove(me.costPanel, true);
						delete me.costPanel;
						me.costPanel = undefined;
*/
					}
				}
			}));
		}

		if (me.boostCampaign === true) {
			/* ブーストキャンペーン */
			mainPanelItems.push('-');
			mainPanelItems.push(Ext.create('Ext.form.field.ComboBox', {
				store: Ext.create('Ext.data.JsonStore', {
					autoLoad: false,
					fields: ['T', 'V', 'F'],
					data: [
						{'T': '通常',   'V':  0, 'F': null},
						{'T': '5% UP',  'V':  5, 'F': function(v) { return Math.min(v +  5, 100); }},
						{'T': '10% UP', 'V': 10, 'F': function(v) { return Math.min(v + 10, 100); }},
						{ T: "15% UP",V: 25,F: function(g) { return Math.min(g + 15, 100) } },
						{ T: "20% UP", V: 30, F: function(g) { return Math.min(g + 20, 100) } },
						{ T: "30% UP", V: 40, F: function(g) { return Math.min(g + 30, 100) } },
						{ T: "打撃力系", V: 11, F: function(g, x) { if (x == 1) { g = Math.min(g + 5, 100) } return g } },
						{ T: "射撃力系", V: 12, F: function(g, x) { if (x == 2) { g = Math.min(g + 5, 100) } return g } },
						{ T: "法撃力系", V: 13, F: function(g, x) { if (x == 3) { g = Math.min(g + 5, 100) } return g } },
						{ T: "HP/PP系", V: 14, F: function(g, x) { if (x == 4) { g = Math.min(g + 5, 100) } return g } },
						{ T: "特殊系", V: 15, F: function(g, x) { if (x == 5) { g = Math.min(g + 5, 100) } return g } }
					]
				}),
				displayField: 'T',
				forceSelection: true,
				editable: false,
				queryMode: 'local',
				valueField: 'V',
				value: 0,
				typeAhead: true,
				width: 84,

				listeners: {
					scope: me,
					change: function(item, newValue, oldValue) {
						var panel = me.tabPanel.query('resultpanel'), i;

						this.enableBoost = (0 < newValue);
						this.boostFunction = item.store.findRecord('V', newValue).get('F');
						if (me.enableBoost) {
							item.addCls('x-campaign-up');
						} else {
							item.removeCls('x-campaign-up');
						}
						if (Ext.isArray(panel)) {
							for (i = 0; i < panel.length; i++) {
								panel[i].boostFunction = this.boostFunction;
								if (panel[i].rendered) {
									panel[i].refresh();
								}
							}
						}
					}
				}
			}));
		}

		if (me.noDD !== true && Ext.isFunction(me.getRecommendRecipe)) {
			/* おすすめレシピ(PC限定) */
			mainPanelItems.push('-');
			mainPanelItems.push({
				iconCls: 'x-recommend-menu-icon',
				style: {
					overflow: 'visible'
				},
				text: 'レシピ',
				menu: me.getRecommendRecipe()
			});
		}
		if (me.noDD !== true) {
			mainPanelItems.push("-");
			mainPanelItems.push({
				iconCls: "x-share-icon",
				handler: function() {
					var g = location,
						h = g.protocol + "//" + g.host + g.pathname + "#!" + lzbase62.compress(
							g.hash.substring(3));
					Ext.create("widget.window", {
						title: "シェアする",
						modal: true,
						width: me.noDD === true ? Ext.getBody().getWidth() : 600,
						height: 240,
						layout: "fit",
						autoDestroy: true,
						closable: true,
						items: {
							xtype: "textarea",
							value: h,
							style: {
								margin: "5px"
							}
						},
						dockedItems: [{
							xtype: "toolbar",
							ui: "footer",
							dock: "bottom",
							layout: {
								pack: "center"
							},
							items: Ext.create("Ext.button.Button", {
								text: "閉じる",
								scope: me,
								handler: function() {
									Ext.WindowMgr.getActive().close()
								},
								minWidth: 105
							})
						}]
					}).show()
				}
			})
		}
		me.mainPanel = Ext.create('Ext.panel.Panel', {
			region: 'center',
			layout: 'fit',
			items: me.tabPanel,
			dockedItems: {
				xtype: 'toolbar',
				items: mainPanelItems
			},
			listeners: {
				scope: me,
				afterrender: me.onChangeLocationHash
			}
		});
		items.push(me.mainPanel);

		/* ビューポート(メイン画面)を生成 */
		Ext.create('Ext.Viewport', {
			renderTo: me.outputViewport? Ext.get(me.outputViewport): Ext.getBody(),
			layout: 'border',
			items: items
		});

		/* メニューの作成(能力追加スロット用グリッドの削除メニュー) */
		me.initGridMenuButton();

		/* call parent */
//		me.callParent(config);

		window.onhashchange = function() {
			me.onChangeLocationHash()
		}
	},

	/**
	 *
	 */
	initGridMenuButton: function() {
		var me = this,
			items = [], i;
		items.push({
			iconCls: "x-factor-icon",
			text: me.factorMenuText.on,
			scope: me,
			handler: function(d, h) {
				var f = this.selectedGridCell;
				if (f) {
					var g = f.record.get("slot");
					if (d.text === this.factorMenuText.on) {
						f.view.store.each(function(l, e) {
							var k = l.get("slot");
							if (k != null && k.factor === true) {
								l.set("slot", this.makeFactor(k, false));
								return false
							}
							return true
						}, this);
						f.record.set("slot", this.makeFactor(g, true))
					} else {
						f.record.set("slot", this.makeFactor(g, false))
					}
				}
				this.selectedGridCell = null
			}
		});
		for (i = 0; i < me.maxMaterial; i++) {
			items.push({
				iconCls: 'x-copy-icon',
				text: '',
				scope: me,
				btnIndex: i,
				handler: me.onCopyAbility
			});
		}
		items.push({
			iconCls: 'x-del-icon',
			text: '削除',
			scope: me,
			handler: function() {
				var item = this.selectedGridCell;
				if (item) {
					item.view.getStore().removeAbility(d.record, d.rowIndex);
					item.view.refresh()
				}
				this.selectedGridCell = null;
			}
		});

		me.gridMenu = Ext.create('Ext.menu.Menu', {
			items: items
		});
	},

	/**
	 * @private
	 * タブパネルの内容を消去する
	 */
	clearTabPanel: function() {
		var me = this;

		me.initializedRestoreData = false;
		me.tabPanel.removeAll();
		me.locationHash = [];
		me.initializedRestoreData = true;
		me.updateLocationHash();
	},

	/**
	 * @private
	 * ページロード時のURLハッシュから能力追加データを再構築する
	 *
	 * 以下はURLハッシュのキー名と値の説明
	 * s: 素体にセットされている特殊能力コード(.区切り)
	 * 1～: 素材にセットされている特殊能力コード(.区切り)
	 * r: 選択されている特殊能力コード(.区切り)
	 * o: 選択されている能力追加オプションのコード(.区切り)
	 */
	restoreData: function() {
		var me = this;

		/* 再構築終了のフラグを初期化 */
		me.initializedRestoreData = false;

		/* URLハッシュが存在するかをチェック */
		if (location && location.hash && location.hash.match(/^#!\/([a-zA-Z0-9\.\=&\/]+)/)) {
			var params = RegExp.$1.split("/"),
				len = params.length, p, i;

			/* 値をチェックしながらタブパネルを生成していく */
			for (i = 0; i < len && i < me.limitUrlSize; i++) {
				p = Ext.urlDecode(params[i]);
				if (me.urlHashValidate(p)) {
					var tab = me.addTab(p),
						hash = me.addLocationHash(tab, true);

					/* ハッシュの初期値を設定する */
					hash['s'] = p['s']; hash['r'] = p['r']; hash['o'] = p['o'];
					for (j = 1; j <= me.maxMaterial; j++) hash[j] = p[j];
				} else {
					/* 不正な値が指定されている場合は終了 */
					break;
				}
			}
		}

		/* 再構築終了のフラグを立てる */
		me.initializedRestoreData = true;
	},

	/**
	 * @private
	 * URLハッシュのパラメータをチェックする
	 *
	 * @param {Object} p URLハッシュ
	 * @return {Boolean} 値が正しい場合True、不正な場合はFalseを返却
	 */
	urlHashValidate: function(p) {
		var me = this, arr = me.hasharray(p),
			len = arr.length, i;

		/* 素体、素材のチェック */
		if (!p.s && p.s !== "") {
			return false
		}
		for (i = 1; i < me.maxMaterial; i++) {
			if (!p[i] && p[i] !== "") return false;
		}
		for (i = 0; i < len; i++) {
			if (arr[i]) {
				/* 存在するコードかチェック */
				if (!me.ability.isExistAbilities(arr[i].split('.')))
					return false;
			}
		}

		return true;
	},

	/**
	 * @private
	 * タブパネルに能力追加パネルを生成し追加する
	 *
	 * @param {Object} params 初期値パラメータ(URLハッシュから取得)
	 * @return {Ext.panel.Panel} 生成されたパネルを返却
	 */
	addTab: function(d) {
		var l = this,
			k = [{
				xtype: "panel",
				frame: true,
				items: {
					xtype: "fieldset",
					layout: "anchor",
					title: "追加能力を選択",
					autoHeight: true,
					padding: "0 0 0 4",
					margin: "0 0 0 0",
					defaults: {
						xtype: "checkbox",
						anchor: "100%",
						hideEmptyLabel: true,
						scope: l,
						handler: l.onCheckAbility
					}
				}
			}],
			a = {};
		if (l.ajaxData) {
			/* 定義の上書き */
			if (l.ajaxData.optionList && l.ajaxData.optionList.support) {
				a.supportData = l.ajaxData.optionList.support
			}
			if (l.ajaxData.optionList && l.ajaxData.optionList.additional) {
				a.additionalData = l.ajaxData.optionList.additional
			}
			if (l.ajaxData.optionList && l.ajaxData.optionList.additional) {
				a.potentialData = l.ajaxData.optionList.potential
			}
			if (l.ajaxData.sameBonusBoost) {
				a.sameBonusBoost = l.ajaxData.sameBonusBoost
			}
			/* 排他パターンをオーバーライド */
			if (l.ajaxData.excludePattern && l.ajaxData.excludePattern.select) {
				a.excludePattern = l.ajaxData.excludePattern.select
			}
			if (l.ajaxData.excludePattern && l.ajaxData.excludePattern.addition) {
				l.ability.excludePattern = l.ajaxData.excludePattern.addition
			}
		}
		k.push(Ext.create("PSO2.ResultPanel", Ext.apply({
			frame: true,
			noDD: l.noDD,
			abilityComponent: l.ability,
			boostFunction: l.enableBoost ? l.boostFunction : null,
			listeners: {
				scope: l,
				opt1change: function(m, n, o) {
					if (!m.suspendCheckChange) {
						this.onAbilityOptionChange(m, n, o)
					}
				},
				opt2change: function(m, n, o) {
					if (!m.suspendCheckChange) {
						this.onAbilityOptionChange(m, n, o);
						this.updateCheckbox(m, this.tabPanel.activeTab.query("fieldset")[
							0])
					}
				},
				opt3change: function(m, n, o) {
					if (!m.suspendCheckChange) {
						this.onAbilityOptionChange(m, n, o)
					}
				}
			}
		}, a)));
		/* 結果側のパネル作製 */
		var b = Ext.create("Ext.panel.Panel", {
			flex: 1,
			frame: true,
			border: false,
			autoScroll: true,
			margin: "0 0 0 0",
			padding: "0 0 0 0",
			layout: "column",
			defaults: {
				columnWidth: 1 / 2,
				layout: "anchor",
				autoHeight: true,
				defaults: {
					anchor: "100%"
				}
			},
			items: k,
			/* フィールドセットを取得する(チェックボックスの親コンポーネント) */
			getFieldSet: function() {
				var me = this;

				if (!me.fieldSet) {
					me.fieldSet = me.query('fieldset')[0];
				}

				return me.fieldSet;
			},
			/* 結果パネルを取得する */
			getResultPanel: function() {
				var m = this;
				if (!m.resultPanel) {
					m.resultPanel = m.query("resultpanel")[0]
				}
				return m.resultPanel
			},
			/* 結果パネルの情報を更新する */
			updateResults: function() {
				if (l.initializedRestoreData !== true) {
					var m = this.getFieldSet(),
						n = this.getResultPanel();
					n.updateResults(m)
				}
			}
		});
		/* 再構築終了フラグが初期化されている場合、結果パネルの初期化を行う */
		if (l.initializedRestoreData === true) {
			var g = b.getFieldSet(),
				f = b.getResultPanel();
			/* フィールドセット描画後にチェックボックスを表示する処理を追加 */
			g.on("afterrender", function(p, o) {
				var t = this,
					s = d.r;
				/* 結果パネルの内容を更新する */
				b.updateResults();
				/* チェックボックスの初期化 */
				if (s) {
					var u = s.split("."),
						n = t.query("checkbox"),
						m, q;
					o.myComponent.initializedCheckbox = false;
					if (Ext.isArray(n) && (m = n.length) > 0) {
						for (q = 0; q < m; q++) {
							if (0 <= Ext.Array.indexOf(u, n[q].inputValue)) {
								n[q].setValue(true)
							}
						}
					}
					o.myComponent.initializedCheckbox = true
				}
			}, g, {
				delay: 1000,
				myComponent: l
			});
			/* 結果パネル描画後に能力追加オプションを選択する処理を追加 */
			f.on("afterrender", function(q, p) {
				var s = this,
					t = d.o;
				if (t) {
					var n = t.split("."),
						m = n.length,
						r;
					p.myComponent.initializedSelectOption = false;
					for (r = 0; r < m; r++) {
						s.selectOption(n[r])
					}
					p.myComponent.initializedSelectOption = true
				}
			}, f, {
				delay: 1000,
				myComponent: l
			})
		}
		/* タブパネルに合成パネルを追加 */
		var c = [l.createGridPanel(0, l.ability.createSlotStore(), b, d ? d.s :
			null)];
		for (var e = 1; e <= l.maxMaterial; e++) {
			c.push(l.createGridPanel(e, l.ability.createSlotStore(), b, d ? d[e] :
				null))
		}
		var h = l.tabPanel.add({
			title: "合成パネル",
			autoScroll: true,
			closable: true,
			fillDuster: function() {
				var o = this.query("gridpanel"),
					n, m = 0;
				for (n = 0; n < o.length; n++) {
					m = Math.max(m, o[n].getAbilityCount())
				}
				l.initializedRestoreData = true;
				try {
					for (n = 0; n < o.length; n++) {
						if (n == 0) {
							o[n].fillDuster(m)
						} else {
							if (0 < o[n].getAbilityCount()) {
								o[n].fillDuster(m)
							}
						}
					}
				} finally {
					l.initializedRestoreData = false
				}
				b.updateResults();
				l.onChangeAbility()
			},
			layout: {
				type: "vbox",
				align: "stretch",
				padding: "0 0 5 0"
			},
			items: [{
				layout: "column",
				defaults: {
					columnWidth: 1 / (l.maxMaterial + 1),
					layout: "anchor",
					autoHeight: true,
					defaults: {
						anchor: "100%"
					}
				},
				/* 能力追加スロット用のストアを生成してグリッドを作成 */
				items: c
			}, b],
			getResultPanel: b.getResultPanel
		});
		/* URLハッシュを更新する */
		l.addLocationHash(h);
		if (l.initializedRestoreData !== true) {
			l.updateLocationHash()
		}
		/* 生成された合成パネルを返却 */
		return h
	},

	createSlot: function() {
		return this.ability.createSlotStore();
	},

	/**
	 * @private
	 * 状態をクッキーへ保存する
	 */
	saveData: function() {
		var me = this;

		if (me.tabPanel.activeTab) {
			var index = me.findLocationHashBy(me.tabPanel.activeTab);

			if (0 <= index) {
				var p = me.locationHash[index];

				if (me.urlHashValidate(p)) {
					return Ext.Msg.prompt('状態の保存', '対象のパネル内容をクッキーへ保存します。<br/>保存する名称を入力して下さい。(省略可)', function(btn, text) {
						if (btn == 'ok') {
							var cookie = PSO2.Cookie.get(me.constCookieName) || {},
							f = {};

							if (text == "") text = Ext.Date.format(new Date(), 'Y-m-d H:i:s');
							me.hashcopy(me.locationHash[index], f);

							if (cookie[text]) {
								Ext.Msg.confirm('確認', '同じ名前のデータがあります。上書きしますか？', function(btn) {
									if (btn == 'yes') {
										cookie[text] = f
										PSO2.Cookie.set(me.constCookieName, cookie);
										Ext.Msg.alert('確認', '保存が完了しました。');
									}
								}, me);
							} else {
								cookie[text] = f;
								PSO2.Cookie.set(me.constCookieName, cookie);
								Ext.Msg.alert('確認', '保存が完了しました。');
							}
						}
					}, me);
				}
			}
		}
		return Ext.Msg.alert('状態の保存', '保存可能な内容がありません。');
	},

	/**
	 * @private
	 * 状態をクッキーから読み込む
	 */
	loadData: function() {
		var me = this,
			cond = PSO2.Cookie.get(me.constCookieName);

		if (cond && Ext.isObject(cond)) {
			var list = [], n, listeners;
			for (n in cond) {
				list.unshift({key:n, value: cond[n]});
			}

			if (me.noDD === true) {
				listeners = {scope: me, itemclick: function(arg1, arg2) {
					this.selectLoadData(arg1, arg2);
					Ext.WindowMgr.getActive().close();
				}};
			} else {
				listeners = {scope: me, itemdblclick: function(arg1, arg2) {
					this.selectLoadData(arg1, arg2);
					Ext.WindowMgr.getActive().close();
				}};
			}

			Ext.create('widget.window', {
				title: '状態の復元(保存データ一覧)',
				modal: true,
				width: me.noDD === true? Ext.getBody().getWidth(): 600,
				height: 320,
				layout: 'fit',
				autoDestroy: true,
				closable: true,
				items: Ext.create('Ext.view.View', {
					anchor: '100%',
					autoScroll: true,
					allowBlank: false,
					store: Ext.create('Ext.data.Store', {
						model: 'PSO2.CookieModel',
						data: list
					}),
					tpl: [
						'<tpl for=".">',
							'<div class="cookie-wrap">',
								'<div class="cookie">{key}</div>',
							'</div>',
						'</tpl>',
						'<div class="x-clear"></div>'
					],
					listeners: listeners,
					trackOver: true,
					overItemCls: 'x-item-over',
					itemSelector: 'div.cookie-wrap'
				}),
				dockedItems: [{
					xtype: 'toolbar',
					ui: 'footer',
					dock: 'bottom',
					layout: {
						pack: 'center'
					},
					items: Ext.create('Ext.button.Button', {
						text: '閉じる',
						scope: me,
						handler: function() {
							Ext.WindowMgr.getActive().close();
						},
						minWidth: 105
					})
				}]
			}).show();
		} else {
			Ext.Msg.alert('状態の復元', '条件は保存されていません。');
		}
	},

	/**
	 * @private
	 * 読み取りデータを選択された場合に呼び出される
	 *
	 * @param {Object} comp
	 * @param {Object} params
	 */
	selectLoadData: function(comp, params) {
		var me = this;

		if (params) {
			var v, tab

			if (Ext.isFunction(params.get)) {
				v = params.get('value');
			} else {
				v = params;
			}

			/* パネルを追加する */
			me.initializedRestoreData = true;
			try {
				tab = me.addTab(v)
			} finally {
				me.initializedRestoreData = false
			}
			me.hashcopy(v, me.addLocationHash(tab));

			/* URLハッシュを更新する */
			me.updateLocationHash();

			/* フォーカスを変更 */
			me.tabPanel.setActiveTab(tab);
		}
	},

	// selectLoadData: function(b, f) {
	// 	var e = this;
	// 	if (f) {

	// 	}
	// },
	/**
	 * @private
	 * 能力追加オプションが変更された場合に呼び出されるイベント処理
	 * URLハッシュの更新を行う
	 *
	 * @param rp {PSO2.ResultPanel} 結果パネル
	 * @param item {Ext.form.field.Field} 選択されたアイテムフィールド
	 * @param init {Boolean} 初期値と同じ場合はTrueがセットされる
	 */
	onAbilityOptionChange: function(rp, item, init) {
		var me = this,
			index = me.findLocationHashBy(me.tabPanel.activeTab),
			prefix = item.value.charAt(0);

		if (me.locationHash[index]) {
			var ini = me.locationHash[index]['o'].split('.'),
				opts = [];

			Ext.Array.forEach(ini, function(v) {
				if (0 < v.length && v.charAt(0) != prefix) {
					opts.push(v);
				}
			});

			if (!init) {
				opts.push(item.value);
			}
			me.locationHash[index]['o'] = opts.join('.');
			me.updateLocationHash();
		}
	},

	makeFactor: function(b, a) {
		var c;
		if (a == true) {
			c = Ext.applyIf({
				source: b,
				factor: true,
				extend: null,
				generate: null
			}, b);
			c.code = "*" + b.code
		} else {
			c = b.source;
			delete b
		}
		return c
	},

	/**
	 * @private
	 * 能力追加スロット用のグリッドパネルを生成する
	 *
	 * @param index {Number} インデックス(0=素体,1～=素材)
	 * @param store {Ext.data.Store} スロット用ストア
	 * @param panel {Ext.panel.Panel} 能力追加選択パネル
	 * @param initValue {Object} 初期表示用の値
	 * @return {Ext.grid.Panel} 生成したグリッドパネル
	 */
	createGridPanel: function(index, store, panel, initValue) {
		var me = this, grid, rp = panel.getResultPanel(), listeners, titleIndex = [];

		/* コピーメニュー用の配列を作成 */
		for (i = 0; i <= me.maxMaterial; i++) {
			if (i != index) titleIndex.push(i);
		}

		/* 能力追加スロット用ストアをバインド */
		rp.bindStore(store);

		/* パネルへの更新イベントを追加 */
		store.on({
			scope: panel,
			update: panel.updateResults
		});
		store.on({
			scope: me,
			update: me.onChangeAbility
		});
var f
		/* 能力追加スロット用ストアをベースにグリッドパネルを生成 */
		grid = Ext.create('Ext.grid.Panel', {
			title: me.panelNames[index],
			titleIndex: titleIndex,
			sortableColumns: false,
			dustAbilities: me.ability.abilityStore.getRange(me.ability.abilityStore.find(
				"gid", "F")),
			getAbilityCount: function() {
				var m = this.store;
				return m.getEnableData().length - m.getFactorCount()
			},
			locked: false,
			collapsed: false,
			collapsible: true,
			collapseCls: "-collapse-",
			lockedCls: "slot-grid-locked",
			listeners: {
				scope: me,
				beforecollapse: function(r, q, m, o) {
					if (r.tools[0] && r.tools[0].rendered) {
						var n = r.tools[0];
						if (r.locked === true) {
							n.toolEl.removeCls(n.componentCls + r.collapseCls + n.expandType);
							n.toolEl.addCls(n.componentCls + r.collapseCls + r.collapseDirection);
							r.el.removeCls(r.lockedCls)
						} else {
							n.toolEl.removeCls(n.componentCls + r.collapseCls + r.collapseDirection);
							n.toolEl.addCls(n.componentCls + r.collapseCls + n.expandType);
							r.el.addCls(r.lockedCls)
						}
						r.locked = !r.locked
					}
					return false
				}
			},
			fillDuster: function(n) {
				var p, o, m;
				n = Math.min(n + this.store.getFactorCount(), this.store.getCount());
				if (this.getAbilityCount() <= n) {
					p = 0;
					while (p < n && (m = this.store.getAt(p).get("slot")) != null) {
						if (m.gid == "F") {
							this.store.removeAbility(m, p)
						} else {
							p++
						}
					}
					for (o = p = 0; p < n; p++) {
						m = this.store.getAt(p).get("slot");
						if (m == null) {
							this.store.addAbility(this.dustAbilities[o++].data)
						}
					}
					this.view.refresh()
				}
			},
			columns: [{
				dataIndex: 'name',
				header: 'スロット',
				width: 52,
				hidden: me.noDD || 2 < me.maxMaterial
			}, {
				dataIndex: 'slot',
				header: '能力',
				renderer : function(v, n, m, r, p, o) {
					if (v != null) {
						if (v.factor) {
							n.tdCls = "x-factor-icon"
						}
						return v.name
					}
					return '';
				}
			}],
			forceFit: true,
			store: store,
			viewConfig: {
				listeners: me.initDDListener(me.noDD)
			}
		});

		/* 初期表示用の値が設定されている場合の処理 */
		if (initValue) {
			var abilityStore = me.ability.getAbilityStore();

			Ext.Array.forEach(initValue.split('.'), function(code) {
				var m = (code.substr(0, 1) == "*"),
					rec = abilityStore.findRecord("code", m ? code.substr(1) : code);
				if (rec) {
					grid.store.addAbility(m ? me.makeFactor(rec.data, true) : rec.data)
				}
			});
		}

		/* 生成したグリッドパネルを返却 */
		return grid;
	},

	/**
	 * @private
	 * ドラッグアンドドロップイベントの初期設定
	 *
	 * @param {Object} params
	 */
	initDDListener: function(param) {
		var me = this,
			listeners = {scope: me};

		if (param !== true) {
			/* ドロップゾーンの初期化 */
			listeners['render'] = me.initializeSlotDropZone;

			/* 右クリック時のメニュー表示(PC) */
			listeners['cellcontextmenu'] = function(view, cell, cellIndex, record, row, rowIndex, e) {
				e.stopEvent();
				if (record.get('slot') != null) {
					me.selectedGridCell = {
						view: view,
						record: record,
						rowIndex: rowIndex
					};
					if (record.get("slot").factor !== true) {
						me.gridMenu.items.getAt(0).setText(me.factorMenuText.on)
					} else {
						me.gridMenu.items.getAt(0).setText(me.factorMenuText.off)
					}
					var target = [], i;

					Ext.Array.forEach(this.tabPanel.getActiveTab().query('grid'), function(grid) {
						if (grid.getView() !== view) {
							target.push(grid);
						}
					});

					for (i = 0; i < me.maxMaterial; i++) {
						me.copyButtonUpdate(view, me.gridMenu.items.getAt(i + 1), i, target[i]);
					}
					me.gridMenu.showAt(e.getXY());
				}
			};
		} else {
			/* セルクリック時のメニュー表示(スマホ) */
			listeners['cellclick'] = function(view, cell, cellIndex, record, row, rowIndex, e) {
				e.stopEvent();
				var g
				if (view.panel && view.panel.locked === true) {
					return false
				}
				me.selectedGridCell = {
					view: view,
					record: record,
					rowIndex: rowIndex
				};
				if (record.get('slot') != null) {
					if (record.get("slot").factor !== true) {
						me.gridMenu.items.getAt(0).setText(me.factorMenuText.on)
					} else {
						me.gridMenu.items.getAt(0).setText(me.factorMenuText.off)
					}

					/* アイテムがある場合は削除ボタンの表示 */
					var target = [];

					Ext.Array.forEach(this.tabPanel.getActiveTab().query('grid'), function(grid) {
						if (grid.getView() !== view) {
							target.push(grid);
						}
					});
					for (i = 0; i < me.maxMaterial; i++) {
						me.copyButtonUpdate(view, me.gridMenu.items.getAt(i + 1), i, target[i]);
					}
					me.gridMenu.showAt(e.getXY());
				} else {
					/* アイテムがない場合は追加能力一覧を表示 */
					me.abilityWindow.setWidth(me.mainPanel.getWidth());
					me.abilityWindow.setHeight(Ext.getBody().getHeight());
					me.abilityWindow.showAt(0, 0);
				}
			}
		}

		return listeners
	},

	/**
	 * @private
	 * コピーボタンを更新する
	 *
	 * @param {Object} view
	 * @param {Ext.button.Button} btn
	 * @param {Number} index
	 * @param {Object} targetView
	 * @return
	 */
	copyButtonUpdate: function(view, btn, index, targetView) {
		var me = this,
			panel = view.ownerCt;

		btn.setText(me.panelNames[panel.titleIndex[index]] + 'へコピー');
		btn.targetView = targetView;

		return btn;
	},

	/**
	 * @private
	 * 能力のコピーを実行する
	 *
	 * @param {Ext.button.Button} btn
	 */
	onCopyAbility: function(btn) {
		var me = this,
			item = me.selectedGridCell;

		if (item && btn.targetView) {
			btn.targetView.getStore().addAbility(item.record.get('slot'));
		}

		this.selectedGridCell = null;
	},

	/**
	 * @private
	 * 特殊能力一覧グリッドから能力(セル)をドラッグできるように初期化する
	 *
	 * @param {Ext.panel.Panel} v ドラッグゾーン生成先パネル
	 */
	initializeAbilityDragZone: function(v) {
		v.dragZone = Ext.create('Ext.dd.DragZone', v.getEl(), {
			getDragData: function(e) {
				var sourceEl = e.getTarget(v.itemSelector, 10), d;
				if (sourceEl) {
					d = sourceEl.cloneNode(true);
					d.id = Ext.id();
					return v.dragData = {
						gridId: this.id,
						sourceEl: sourceEl,
						repairXY: Ext.fly(sourceEl).getXY(),
						ddel: d,
						patientData: v.getRecord(sourceEl).data
					};
				}
			},
			getRepairXY: function() {
				return this.dragData.repairXY;
			}
		});
	},

	/**
	 * @private
	 * 能力追加スロット用グリッドパネルへドロップができるよう初期化する
	 *
	 * @param {Ext.panel.Panel} v ドロップゾーン生成先パネル
	 */
	initializeSlotDropZone: function(a) {
		var c = this,
			d = a,
			grid = d.up("gridpanel");

		/* ドラッグゾーンの追加 */
		a.dragZone = Ext.create("Ext.dd.DragZone", a.getEl(), {
			getDragData: function(g) {
				var f = g.getTarget(a.itemSelector, 10),
					h;
				if (f) {
					if (!a.getRecord(f).data.slot) {
						return null
					}
					h = f.cloneNode(true);
					h.id = Ext.id();
					return a.dragData = {
						gridId: this.id,
						sourceEl: f,
						repairXY: Ext.fly(f).getXY(),
						ddel: h,
						patientData: a.getRecord(f).data.slot
					}
				}
			},
			beforeInvalidDrop: function(h, g, l) {
				var f = this.dragData.sourceEl,
					k = a.getRecord(f);
				if (k && !Ext.get(h) && !d.panel.locked) {
					k.store.removeAbility(k, f.viewIndex);
					a.refresh();
					this.proxy.hide()
				}
			},
			getRepairXY: function() {
				return this.dragData.repairXY
			}
		});

		/* ドロップゾーンの追加 */
		grid.dropZone = Ext.create("Ext.dd.DropZone", a.el, {
			getTargetFromEvent: function(f) {
				return f.getTarget(".x-grid-cell-last")
			},
			onNodeDrop: function(k, f, h, g) {
				if (d.panel && d.panel.locked) {
					return true
				}
				if (this.id == g.gridId) {
					d.getStore().swapAbility(g.sourceEl.viewIndex, h.getTarget(d.itemSelector)
						.viewIndex);
					d.refresh();
					c.onChangeAbility()
				} else {
					/* 能力の追加 */
					d.getStore().addAbility(g.patientData)
				}
				return true
			}
		})
	},

	/**
	 * @private
	 * 能力追加スロットの情報が変更された場合にに呼び出されるイベント処理
	 * URLハッシュの更新を行う
	 */
	onChangeAbility: function() {
		var me = this, tab, rp, as, index;

		if (me.initializedRestoreData !== true) {
			tab = this.tabPanel.activeTab;
			rp = tab && tab.query('resultpanel')[0];
			as = rp && rp.abilitySet;
			index = me.findLocationHashBy(tab);

			if (as && me.locationHash[index]) {
				me.locationHash[index]['s'] = as.getLocationHash(0).join('.');

				for (var i = 0; i <= me.maxMaterial; i++) {
					me.locationHash[index][i] = as.getLocationHash(i).join('.');
				}
				me.locationHash[index]['r'] = rp.getValues().join('.');

				/* URLハッシュを更新する */
				me.updateLocationHash();
			}
		}
	},

	/**
	 * @private
	 * 追加する特殊能力を選択した場合に呼び出されるイベント処理
	 * 継承・生成率の計算後、URLハッシュの更新を行う
	 *
	 * @param {Ext.form.Checkbox} item チェックされたアイテム
	 * @param {Boolean} checked チェック状態
	 */
	onCheckAbility: function(item, checked) {
		var me = this,
			rp = item.resultPanel;

		if (rp) {
			if (checked) {
				/* 能力を追加 */
				rp.addAbility(item);
			} else {
				/* 能力を削除 */
				rp.removeAbility(item);
			}

			me.updateCheckbox(rp, item.fieldSet);

			if (me.tabPanel.activeTab) {
				/* URLハッシュの更新 */
				var index = me.findLocationHashBy(me.tabPanel.activeTab);

				if (0 <= index) {
					me.locationHash[index]['r'] = rp.getValues().join('.');
					me.updateLocationHash();
				}
			}
		}
	},

	/**
	 * @private
	 * 追加できる能力数(Ex込み)に達した場合、チェックボックスを選択できない
	 * ように変更する
	 *
	 * @param {PSO2.ResultPanel} rp 結果パネル
	 * @param {Ext.form.FieldSet} fs チェックボックス群の親パネル
	 */
	updateCheckbox: function(rp, fs) {
		var chkbox = fs.query('checkbox');

		if (rp.abilityCount() < rp.getEnableMaxCount()) {
			/* 能力数に達していない場合、チェックボックスを有効にする */
			Ext.Array.forEach(chkbox, function(box) {
				if (box.disabled)
					box.enable();
			});
		} else {
			/* 能力数に達っした場合、チェックボックスを無効にする */
			Ext.Array.forEach(chkbox, function(box) {
				if (!box.checked)
					box.disable();
			});
		}
	},

	/**
	 * @private
	 * 指定された合成パネルのハッシュパラメータを検索し、その位置を返却する
	 * 見つからない場合は-1を返す
	 *
	 * @param {Ext.panel.Panel} panel 検索する合成パネル
	 * @return {Number} ハッシュパラメータの位置
	 */
	findLocationHashBy: function(panel) {
		var me = this,
			len = me.locationHash.length, i;

		for (i = 0; i < len; i++) {
			if (me.locationHash[i]['id'] == panel.id) {
				return i;
			}
		}

		return -1;
	},

	/**
	 * @private
	 * URLに新規のハッシュパラメータを追加する
	 *
	 * @param {Ext.panel.Panel} panel 合成パネル
	 * @param {Boolean} force 強制フラグ
	 * @return {Object} 新規に生成されたハッシュ領域
	 */
	addLocationHash: function(panel, force) {
		var me = this, hash, i;

		if (me.initializedRestoreData === true && force !== true) {
			/* 再構築中は処理をしない */
			return location.hash;
		}

		me.locationHash = me.locationHash || [];

		/* 新しいハッシュ領域を作成し追加 */
		hash = {id: panel.id, s: '', r: '', o: ''};
		for (i = 1; i <= me.maxMaterial; i++) hash[i] = '';
		me.locationHash.push(hash);
		return hash;
	},

	/**
	 * @private
	 * URLのハッシュパラメータを削除する
	 *
	 * @param {Ext.panel.Panel} panel 削除対象となる合成パネル
	 * @return {Object} 削除されたハッシュ領域
	 */
	removeLocationHash: function(panel) {
		var me = this,
			index = me.findLocationHashBy(panel),
			hash;

		if (me.initializedRestoreData === true) {
			/* 再構築中は処理をしない */
			return location.hash;
		}

		if (0 <= index) {
			hash = me.locationHash.splice(index, 1);
		}

		/* URLハッシュを更新する */
		me.updateLocationHash();

		return hash;
	},

	/**
	 * @private
	 * URLハッシュを更新する
	 */
	updateLocationHash: function() {
		var me = this,
			params = '',
			len = me.locationHash.length, i;

		if (me.initializedRestoreData !== false && me.initializedCheckbox !== false && me.initializedSelectOption !== false) {
			if (0 < len) {
				params = '#!';
				for (i = 0; i < len && i < me.limitUrlSize; i++) {
					params += "/";
					params += me.hashmake(me.locationHash[i])
				}
			}

			if (location.hash !== params) {
				/* URLを更新する */
				location.hash = params;
			}
		}
	},

	onChangeLocationHash: function() {
		var o = this,
			k = o.locationHash || [],
			r = o.ability.abilityStore;
		if (location && location.hash) {
			if (location.hash.match(/^#!([a-zA-Z0-9]+)$/)) {
				return location.hash = "!/" + lzbase62.decompress(RegExp.$1)
			} else {
				if (location.hash.match(/^#!\/([a-zA-Z0-9\.\=&\/\*]+)/)) {
					var e = RegExp.$1.split("/"),
						m = e.length,
						g;
					for (g = 0; g < m && g < o.limitUrlSize; g++) {
						if (g < k.length) {
							if (e[g] != o.hashmake(k[g])) {
								var b = Ext.urlDecode(e[g]);
								if (o.urlHashValidate(b)) {
									var c = Ext.getCmp(k[g].id),
										h = c.getResultPanel(),
										l = h.ownerCt.getFieldSet(),
										n = b.r.split("."),
										d = c.query("grid"),
										q = function(v, y) {
											var p = v.store.count(),
												s = y.split("."),
												x, u, w;
											for (var t = 0; t < p; t++) {
												x = s.shift();
												if (x) {
													u = (x.substr(0, 1) == "*");
													w = r.findRecord("code", u ? x.substr(1) : x);
													if (w) {
														v.store.getAt(t).data.slot = (u ? o.makeFactor(w.data, true) :
															w.data)
													}
												} else {
													v.store.getAt(t).data.slot = null
												}
											}
											v.getView().refresh()
										};
									q(d[0], b.s);
									for (var f = 1; f <= o.maxMaterial; f++) {
										q(d[f], b[f])
									}
									h.suspendCheckChange = 1;
									h.ownerCt.updateResults();
									l.items.each(function(p) {
										p.suspendCheckChange = 1;
										if (0 <= n.indexOf(p.inputValue)) {
											p.setValue(true);
											h.addAbility(p, true)
										} else {
											p.setValue(false);
											h.removeAbility(p, true)
										}
										p.suspendCheckChange = 0
									});
									h.refresh();
									o.updateCheckbox(h, l);
									Ext.Array.forEach(b.o.split("."), function(p) {
										h.selectOption(p)
									});
									h.refresh();
									o.updateCheckbox(h, l);
									h.suspendCheckChange = 0;
									o.hashcopy(b, k[g])
								}
							}
						} else {
							var b = Ext.urlDecode(e[g]);
							o.initializedRestoreData = true;
							try {
								o.hashcopy(b, o.addLocationHash(o.addTab(b), true))
							} finally {
								o.initializedRestoreData = false
							}
						}
					}
					if (g < k.length) {
						var a = [];
						while (g != k.length) {
							a.push((k.pop())["id"])
						}
						Ext.Array.forEach(a, function(s) {
							var p = Ext.getCmp(s);
							if (p) {
								p.close()
							}
						})
					}
				}
			}
		}
	},

	hashmake: function(d) {
		var c = this,
			b, a = "";
		a += c.makeHashParameter(d, "s");
		for (b = 1; b <= c.maxMaterial; b++) {
			a += "&" + c.makeHashParameter(d, b)
		}
		a += "&" + c.makeHashParameter(d, "r");
		a += "&" + c.makeHashParameter(d, "o");
		return a
	},

	hashcopy: function(d, a) {
		var c = this,
			b;
		a.s = d.s;
		a.r = d.r;
		a.o = d.o;
		for (b = 1; b <= c.maxMaterial; b++) {
			a[b] = d[b]
		}
	},

	/**
	 * @private
	 * URLハッシュ用のパラメータを作成する
	 * 値が無い場合、undefine、nullになるのを防ぐため空文字をセットする
	 *
	 * @param {Object} hash ハッシュ
	 * @param {String} key キー
	 * @return {String} キーと値を'='で繋いだ文字列
	 */
	makeHashParameter: function(hash, key) {
		return key + '=' + (hash[key]? hash[key]: '');
	}
});
