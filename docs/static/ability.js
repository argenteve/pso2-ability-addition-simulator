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
 * ability.js
 * 特殊能力の生成・継承・合成についてのロジックを主にコーディング
 *
 * @author 助右衛門@8鯖
 *
 *****************************************************************************/
Ext.ns('PSO2');

/**
 * "PSO2.Ability"のデータモデルを登録
 */
Ext.define('PSO2.Ability', {
	extend: 'Ext.data.Model',
	fields: [
		'code', 'gid', 'name', 'lvup', 'extend', 'generate',
		'require', 'extup', 'status', 'effect', "dom", "rensei", "namengs", "effectngs"
	]
});

/**
 * "PSO2.Slot"のデータモデルを登録
 */
Ext.define('PSO2.Slot', {
	extend: 'Ext.data.Model',
	fields: ['id', 'name', 'slot']
});

/*****************************************************************************
 * PSO2.AbilitySet
 * 特殊能力情報
 *
 * @author 助右衛門@8鯖
 * @since  2012/12/24
 *****************************************************************************/
Ext.define('PSO2.AbilitySet', {
	extend: 'Ext.Base',
	renseiCd: "VN01",

	/** ミューテーションIコード */
	mutationCd: 'OA01',
	mutationICd: "OA01",
	mutationIICd: "OA02",

	/** フォトンコレクトコード */
	photonCd: 'WA01',

	/** 有効な能力の最大値 */
	maxEnableAbility: 8,

	/**
	 * コンストラクタ
	 *
	 * @param {Object} config インスタンス生成時の設定情報
	 */
	constructor: function(config) {
		var me = this,
			c;

		/* 設定情報の取り込み */
		Ext.apply(me, config);
		if (me.abilityStore) {
			c = me.abilityStore.findRecord("name", "ミューテーションI");
			if (c) {
				me.mutationICd = c.get("code")
			}
			c = me.abilityStore.findRecord("name", "ミューテーションII");
			if (c) {
				me.mutationIICd = c.get("code")
			}
			c = me.abilityStore.findRecord("name", "フォトンコレクト");
			if (c) {
				me.photonCd = c.get("code")
			}
			c = me.abilityStore.findRecord("name", "錬成の導き");
			if (c) {
				me.renseiCd = c.get("code")
			}
		}

		/* 値の初期化 */
		me.stores = [];
		me.clear();
	},

	/**
	 * 有効な特殊能力レコードを返却する
	 *
	 * @param {Number} index 能力追加スロット用のストア番号
	 */
	getEnableData: function(index) {
		return this.stores[index].getEnableData();
	},

	getFactorCount: function(a) {
		return this.stores[a].getFactorCount()
	},

	/**
	 * 指定されたインデックスのURLハッシュを生成して返却する
	 *
	 * @param {Number} index 能力追加スロット用のストア番号
	 * @return {String} URLハッシュ
	 */
	getLocationHash: function(index) {
		var me = this,
			store = me.stores[index],
			res = '';

		if (store) {
			res = store.getEnableDataCd();
		}

		return res;
	},

	/**
	 * スロット用ストアの登録を行う
	 *
	 * @param {Ext.data.Store} store スロット用ストア
	 * @return {Boolean} 登録に成功した場合はtrueを返却する
	 */
	putStore: function(store) {
		var result = (Ext.Array.indexOf(this.stores, store) < 0);

		if (result) {
			this.stores.push(store);
		}

		return result;
	},

	/**
	 * 特殊能力をスタックする
	 *
	 * @param {Ext.data.Model} ab 特殊能力レコード
	 */
	put: function(ab) {
		var me = this, num;

		if (!me.hashStack[ab.code]) {
			me.hashStack[ab.code] = 0;
		}
		num = ++me.hashStack[ab.code];

		if (Ext.isArray(ab.extend)) {
			/* 継承率の参照 */
			if (0 < ab.extend[me.overflow(ab.extend.length, num, 1)] && Ext.Array.indexOf(me.stack, ab) < 0) {
				/* 継承率が0以上なら追加する */
				me.stack.push(ab);
			}
		}
	},

	/**
	 * ミューテーションIが利用されているかを調べる
	 *
	 * @return {Boolean} ミューテーションIが利用されている場合trueを返却
	 */
	isMutation: function() {
		var me = this;

		return 0 < me.hashStack[me.mutationCd];
	},

	isMutationI: function() {
		var a = this;
		return 0 < a.hashStack[a.mutationICd]
	},
	isMutationII: function() {
		var a = this;
		return 0 < a.hashStack[a.mutationIICd]
	},

	/**
	 * フォトンコレクトが利用されているかを調べる
	 *
	 * @return {Boolean} フォトンコレクトが利用されている場合trueを返却
	 */
	isPhotonCollect: function() {
		var me = this;

		return 0 < me.hashStack[me.photonCd];
	},

	isRensei: function() {
		var a = this,
			b = 0,
			c = a.getLocationHash(0),
			i;
		for (i = 0; i < c.length; i++) {
			if (c[i] == a.renseiCd) {
				b = 5;
			}
		}
		return b
	},

	enableMaterial: function() {
		var d = this,
			a = d.stores.length,
			c = 0,
			b;
		for (b = 1; b < a; b++) {
			if (d.stores[b].exist()) {
				c++
			}
		}
		return c
	},

	enableMaterialMaxCount: function() {
		return Math.min(this.enableCheckMax, this.stores[0].count() - 1)
	},

	/**
	 * 選択可能なアビリティのループ
	 *
	 * @param {Function} fn 選択可能なアビリティ毎にコールされるファンクション
	 * @param {Object} scope 上記ループ時のスコープ
	 */
	forEach: function(fn, scope) {
		var me = this, list = [], n;

		/* キーリストを得る */
		for (n in me.hashStack)
			list.push(n);
		for (n in me.levelupHashStack)
			list.push(n);
		for (n in me.refHashStack)
			list.push(n);

		/* 重複を除く */
		list = list.filter(function (x, i, self) {
			return self.indexOf(x) === i;
		}).sort();

		/* ループ */
		for (i = 0; i < list.length; i++) {
			if (list[i]) {
				if (list[i].substr(0, 1) == "*") {
					fn.call(scope, me.abilityStore.findRecord("code", list[i].substr(1))["data"],
						true)
				} else {
					fn.call(scope, me.abilityStore.findRecord("code", list[i])["data"], false)
				}
			}
		}
	},

	/**
	 * 能力追加の情報をリセットする
	 *
	 * スロット用グリッドに値が入った場合に呼び出され
	 * 追加できる能力一覧を再取得する
	 */
	resetAbility: function() {
		var me = this, len = me.stores.length,
			sLen = me.getEnableData(0).length - me.getFactorCount(0), check;

		/* 素体・素材の個数チェック */
		if (sLen == 0) {
			/* 素体が0スロの場合 */
			check = false;
			for (i = 1; i < len; i++) {
				if (0 < me.getEnableData(i).length) {
					/* 素材に値があればOK */
					check = true; break;
				}
			}
		} else {
			/* 素体が1スロ以上の場合は素材のスロット数が超える */
			check = true;
			for (i = 1; i < len; i++) {
				var e = me.getEnableData(i).length - me.getFactorCount(i);
				if (0 < e && e < sLen) {
					/* 素材に値があればOK */
					check = false; break;
				}
			}
		}

		/* 情報の更新 */
		me.clear();
		if (check == true) {
			/* スタック領域に値をセット */
			for (i = 0; i < len; i++) {
				Ext.Array.forEach(me.getEnableData(i), me.put, me);
			}

			/* 有効にできる能力の最大数の更新 */
			me.enableCheckMax = sLen + 1;

			/* レベルアップアビリティのリセット */
			me.resetLevelupAbility();

			/* 拡張アビリティのリセット */
			me.resetExtendAbility();
		}
	},

	/**
	 * @private
	 * スタック領域を全て消去する
	 */
	clear: function() {
		var me = this;

		/* 追加できる特殊能力数 */
		me.enableCheckMax = 0;

		/* 選択できる特殊能力をスタック */
		me.stack = [];

		/* 特殊能力のコードと個数 */
		me.hashStack = {};
		me.levelupStack = [];
		me.levelupHashStack = {};

		/* 継承率がアップする場合の特殊能力コードを記録 */
		me.exStack = {};

		/* 合成パターンにより新規に追加された特殊能力コードと合成確率 */
		me.refStack = [];
		me.refHashStack = {};
		me.refBonusStack = {}
	},

	/**
	 * @private
	 * 指定されたフィールド名の値が一致する位置を返却する
	 *
	 * @param {Array} arr ストアデータの配列
	 * @param {String} fieldName 取得するフィールド名
	 * @param {String/Object} value 探し出す値
	 * @return {Number} 一致した位置
	 */
	indexOf: function(arr, fieldName, value) {
		var len = arr.length, i;

		for (i = 0; i < len; i++) {
			if (arr[i][fieldName] == value) return i;
		}
		return -1;
	},

	/**
	 * @private
	 * オブジェクトのキーリストを取得する
	 *
	 * @param {Object} hash キーリストを保持するオブジェクト
	 * @return {Array} キーリスト
	 */
	getKeyList: function(hash) {
		var keys = [], k;

		for (k in hash) {
			keys.push(k);
		}

		return keys;
	},

	/**
	 * @private
	 * レベルアップ能力の情報をリセットする
	 */
	resetLevelupAbility: function() {
		var me = this,
			keys = me.getKeyList(me.hashStack),
			len = keys.length, index, lu, i,
			a, g, k;
		for (i = 0; i < len; i++) {
			a = me.hashStack[keys[i]];
			if (1 < a) {
				/* 2個以上でレベルアップ */
				/* my method */
				index = me.indexOf(me.stack, "code", keys[i]);
				if (0 <= index) {
					lu = me.stack[index]["lvup"];
					if (lu && !me.levelupHashStack[lu]) {
						/* レベルアップのキーが存在しない場合 */
						g = me.abilityStore.findRecord("code", lu)["data"];
						if (g.generate && g.generate[Math.min(g.generate.length - 1, a - 2)]) {
							k = me.abilityStore.findRecord("code", keys[i]);
							if (k.get("require")) {
								if (me.hashStack[k.get("require")]) {
									me.levelupStack.push(g);
									me.levelupHashStack[lu] = me.hashStack[keys[i]]
								}
							} else {
								me.levelupStack.push(g);
								me.levelupHashStack[lu] = me.hashStack[keys[i]]
							}
						}
					}
				}
			}
		}
	},

	/**
	 * @private
	 * 拡張能力の情報をリセットする
	 */
	resetExtendAbility: function() {
		var me = this, key, rec;

		/* 継承率アップ系 */
		for (key in me.hashStack) {
			rec = me.abilityStore.findRecord("code", key);
			if (rec && rec.get('extup')) {
				Ext.Array.forEach(rec.get('extup'), function(cd) {
					if (!me.exStack[cd]) {
						me.exStack[cd] = [rec.get("rel")]
					} else {
						me.exStack[cd].push(rec.get("rel"))
					}
				})
			}
		}

		/* パターンによる能力の生成 */
		Ext.Array.forEach(me.abilityComponent.constExtendAbility, function(rec) {
			var me = this,
				ref = me.getAbilityRefferer(rec), i, index;

			if (ref) {
				for (i = 0; i < ref.length; i++) {
					if (rec.success) {
						index = me.indexOf(me.stack, "code", ref[i]);
						if (index < 0) {
							/* 新規で能力を追加 */
							if (me.indexOf(me.levelupStack, "code", ref[i]) < 0) {
								me.refStack.push(me.abilityStore.findRecord("code", ref[i])["data"])
							}
						}
						/* 固定確率を設定 */
						me.refHashStack[ref[i]] = rec.success
					} else {
						if (rec.bonus) {
							me.refBonusStack[ref[i]] = rec.bonus
						}
					}
				}
			}
		}, me);
	},

	/**
	 * @private
	 * 参照設定のある組み合わせを取得する
	 *
	 * @param {Array} rec 参照設定
	 * @return 組み合わせのあるコード
	 */
	getAbilityRefferer: function(rec) {
		var me = this,
			base = rec['base'],
			len = base.length, i, ret = true, regexp = null, stack = Ext.apply({}, me.hashStack);

		for (i = 0; i < len; i++) {
			if (base[i].indexOf('*') < 0) {
				/* コード指定の場合 */
				if (!stack[base[i]]) {
					/* no hit */
					return null;
				} else {
					/* 数を減らす */
					stack[base[i]]--;
				}
			} else {
				/* ワイルドカード指定の場合 */
				var re = new RegExp("(" + base[i].replace('*', '[^,]+') + ")", "g"),
					m = me.getKeyList(stack).join(",").match(re);
				if (m) {
					regexp = m;
				} else {
					/* no hit */
					return null;
				}
			}
		}
		return (rec['ref'] == "$$" && regexp)? m: Ext.isArray(rec['ref'])? rec['ref']: [rec['ref']];
	},

	/**
	 * @private
	 * 配列の要素範囲を超えない値を返却する
	 * 従来3個までだった素材数を超えた場合に最大値を返すための補助
	 *
	 * @param max 要素数
	 * @param value 値
	 * @param opt 要素番号の補正値
	 * @return
	 */
	overflow: function(max, value, opt) {
		if (max < value) return max - 1;
		return Math.max(0, value - opt);
	}
});

Ext.define("PSO2.AbilityStore", {
	extend: "Ext.data.Store",
	model: "PSO2.Ability",
	groupField: "gid",
	findRecord: function() {
		var a = this.callParent(arguments);
		if (a || !this.snapshot) {
			return a
		}
		return this.findRecord2.apply(this, arguments)
	},
	find2: function(e, d, g, f, a, c) {
		var b = this.createFilterFn(e, d, f, a, c);
		return b ? this.snapshot.findIndexBy(b, null, g) : -1
	},
	findRecord2: function() {
		var b = this,
			a = b.find2.apply(b, arguments);
		return a !== -1 ? b.getAt2(a) : null
	},
	getAt2: function(a) {
		return this.snapshot.getAt(a)
	}
});

/**
 * 特殊能力コンポーネント
 *
 * @author 助右衛門@8鯖
 * @since  2012/12/24
 */
Ext.define('PSO2.AbilityComponent', {
	extend: 'Ext.Base',

	/**
	 * @private {Array} constAbility
	 * 外部ファイルへ移動
	 */
	constAbility: [],

	/**
	 * @private {Array} constExtra
	 * 外部ファイルへ移動
	 */
	constExtra: [],

	/**
	 * @private {Object} constBoostPoint
	 * 外部ファイルへ移動
	 */
	constBoostPoint: {},

	/**
	 * @private {Array} constExtendAbility
	 * 外部ファイルへ移動
	 */
	constExtendAbility: [],

	/**
	 * スロット定義
	 * 最大8スロットまでを用意した素体、素材A/B用の定義
	 */
	constBaseSlot: [
		{id: 'slot01', name: 'スロット1', slot: null},
		{id: 'slot02', name: 'スロット2', slot: null},
		{id: 'slot03', name: 'スロット3', slot: null},
		{id: 'slot04', name: 'スロット4', slot: null},
		{id: 'slot05', name: 'スロット5', slot: null},
		{id: 'slot06', name: 'スロット6', slot: null},
		{id: 'slot07', name: 'スロット7', slot: null},
		{id: 'slot08', name: 'スロット8', slot: null},
		{id: "slot09", name: "スロット9", slot: null}
	],

	excludePattern: [],

	/**
	 * コンストラクタ
	 *
	 * @param {Object} config インスタンス生成時の設定情報
	 */
	constructor: function(config) {
		Ext.apply(this, config);

		/* inherited */
		this.callParent(config);
	},

	/**
	 * 特殊能力のストア情報を得る
	 *
	 * @param {Boolean} isNew 新規に生成したストアを取得する場合はtrue
	 * @return {Ext.data.Store} 特殊能力のストア情報
	 */
	getAbilityStore: function(isNew) {
		var me = this;

		if (isNew === true) {
			return Ext.create("PSO2.AbilityStore", {
				data: this.constAbility
			})
		} else if (!me.abilityStore) {
			/* 自インスタンス内に無い場合は、生成する */
			me.abilityStore = me.getAbilityStore(true);
		}
		return me.abilityStore;
	},

	/**
	 * 与えられた特殊能力のコードが存在するか、チェックを行う
	 *
	 * @param {String/Array} codes 特殊能力コード
	 * @return {Boolean} 全て存在する場合はtrue、一つでも存在しない場合はfalseを返す
	 */
	isExistAbilities: function(codes) {
		var me = this, store = me.getAbilityStore(),
			len, i;

		if (!Ext.isArray(codes)) {
			codes = [codes];
		}
		len = codes.length;

		for (i = 0; i < len; i++) {
			var ab = codes[i];
			if (ab.substr(0, 1) == "*") {
				ab = ab.substr(1)
			}
			if (0 > store.findBy(function(rec) {
					if (rec.data.code == ab) {
						return true
					}
				})) {
				/* no hit */
				return false
			}
		}

		return true;
	},

	/**
	 * 特殊能力追加スロットのストアを生成する
	 *
	 * @return {Ext.data.Store} 特殊能力追加スロット用のストアオブジェクト
	 */
	createSlotStore: function(fn) {
		var me = this,
			store = Ext.create('Ext.data.Store', Ext.apply({
			model: 'PSO2.Slot',
			data: this.constBaseSlot,
			chkFn: function(h, m) {
				var g = me.excludePattern,
					f, e, l, d, k;
				for (f = 0; f < g.length; f++) {
					l = Ext.isArray(g[f]) ? g[f] : [g[f]];
					d = k = false;
					for (e = 0; e < l.length; e++) {
						if (l[e] == m.substr(0, l[e].length)) {
							d = true
						}
						if (l[e] == h.substr(0, l[e].length)) {
							k = true
						}
					}
					if (d && k) {
						return true
					}
				}
				return false
			},

			/**
			 * スロットへ特殊能力を追加する
			 *
			 * @param data Object 追加する特殊能力データ
			 */
			addAbility: function(data) {
				var cd = data.code.substr(0, 2), slot,
					len = this.getCount(), i;
				var e = data.code.substr(0, 1) == "*",
					f = e ? data.code.substr(1) : data.code;

				/* 上書きできる同系統の能力があるかチェック */
				for (i = 0; i < len; i++) {
					slot = this.getAt(i).get('slot');

					if (slot == null) break;

					/* 全く同じ能力の場合は無視 */
					if ((slot.source && slot.source.code == f) || (slot.code == f)) {
						return true
					}
					if ((slot.source && slot.source.code.substr(0, 2) == cd) || (slot.code.substr(
							0, 2) == cd)) {
						break
					}

					/* 同系統の場合は上書き可能 */
					if (this.chkFn(data.code, slot.code)) {
						break
					}
				}
				/* 8スロ以上は却下 */
				if (len <= i) return false;

				return this.getAt(i).set('slot', data);
			},

			/**
			 * スロット内に有効な特殊能力情報が存在するかをチェックする
			 *
			 * @return {Boolean} 有効な特殊能力情報が存在する場合はtrueを返却
			 */
			exist: function() {
				return this.getEnableData().length != 0;
			},

			swapAbility: function(e, f) {
				var d = this.getCount(),
					c, g = 0;
				if (e == f) {
					return false
				}
				while (g < d && (c = this.getAt(g).get("slot")) != null) {
					g++
				}
				if (g <= f) {
					f = g - 1
				}
				c = this.getAt(e).get("slot");
				this.getAt(e).data.slot = this.getAt(f).get("slot");
				this.getAt(f).data.slot = c;
				return true
			},

			/**
			 * スロットから特殊能力を削除する
			 *
			 * @param {Ext.data.Model} record 削除する特殊能力データ
			 * @param {Numeric} rowIndex 削除するインデックス番号
			 */
			removeAbility: function(record, rowIndex) {
				var me = this,
					len = this.getCount(), i;

				/* 削除した場所からデータを上へ詰めていく */
				if ((len - 1) == rowIndex) {
					this.getAt(rowIndex).data.slot = null
				} else {
					for (i = rowIndex; i < len - 1; i++) {
						this.getAt(i).data.slot = this.getAt(i + 1).get("slot");
						this.getAt(i + 1).data.slot = null
					}
				}

				/* 更新イベントの発行 */
				me.fireEvent('update', me, record, 'delete', undefined);
			},

			/**
			 * 有効な特殊能力レコードを返却する
			 *
			 * @return {Array} 有効な特殊能力データ
			 */
			getEnableData: function() {
				var i, len = this.getCount(), records = [], slot;

				for (i = 0; i < len; i++) {
					slot = this.getAt(i).get('slot');
					if (slot == null) break;
					records.push(slot);
				}
				return records;
			},

			/**
			 * 有効な追加能力のコード値のみを返却する
			 *
			 * @return {Array} 有効な特殊能力データのコード値
			 */
			getEnableDataCd: function() {
				var me = this,
					recs = me.getEnableData(),
					ret = [];

				Ext.Array.forEach(recs, function(rec) {
					ret.push(rec.code)
				});
				return ret;
			},
			getFactorCount: function() {
				var d = this.getEnableData(),
					c = 0;
				Ext.Array.forEach(d, function(e) {
					if (e.factor) {
						c++
					}
				});
				return c
			}
		}, fn));

		return store;
	},

	/**
	 * @private
	 * 特殊能力追加時の成功率の計算を行う
	 *
	 * @param {PSO2.AbilitySet} as 特殊能力情報
	 * @param {Ext.data.Model} rec 能力レコード
	 * @return {Number} 成功確率
	 */
	calcSuccess: function(as, rec) {
		var me = this,
			ext = rec.get('extend'),
			gen = rec.get('generate'),
			status = rec.get('status'),
			exboost = rec.get('exboost'),
			cd = rec.get('code'),
			useM1 = as.isMutationI(),
			useM2 = as.isMutationII(),
			useP = as.isPhotonCollect(),
			level = me.getLevel(rec.get('name')),
			s1 = 0,
			s2 = 0,
			s3 = 0,
			s4 = 0,
			a = 0, 
			boostFn = function(type, x) {
				var ss = 0, sm1 = 0, sm2 = 0, E;

				/* ミューテーションI利用時のブースト値 */
				if (me.constBoostPoint.mutation1[type] && me.constBoostPoint.mutation1[type][status]) {
					sm1 = useM1 ? me.constBoostPoint.mutation1[type][status][level] : 0
				}
				if (me.constBoostPoint.mutation2[type] && me.constBoostPoint.mutation2[type][status]) {
					sm2 = useM2 ? me.constBoostPoint.mutation2[type][status][level] : 0
				}
				E = me.indexOf(as.exStack, cd);

				if (E) {
					/* 生成 or 継承率ブースト系が存在する場合の加算(非ミューテーション時) */
					var z = 0;
					for (var y = 0; y < as.exStack[E].length; y++) {
						if (me.constBoostPoint[as.exStack[E][y]][type] && me.constBoostPoint[as.exStack[
								E][y]][type][status]) {
							if (Ext.isObject(me.constBoostPoint[as.exStack[E][y]][type][status][level])) {
								var A = me.constBoostPoint[as.exStack[E][y]][type][status][level]["boost"],
									w = me.constBoostPoint[as.exStack[E][y]][type][status][level]["max"];
								z = (x + A) <= w ? A : Math.abs(w - x)
							} else {
								z = me.constBoostPoint[as.exStack[E][y]][type][status][level]
							}
						}
						ss = Math.max(ss, z)
					}
				}
				return Math.max(sm1, sm2, ss)
			};


		if (as.refHashStack[cd]) {
			/* 参照パターンの成功率 */
			s1 = as.refHashStack[cd];
		}
		if (ext && as.hashStack[cd]) {
			/* 継承率が設定されている場合の成功率の取得 */
			if (rec.get('require')) {
				/* 必須アイテムが設定されている場合チェック */
				if (as.hashStack[rec.get('require')]) {
					s2 = ext[me.overflow(ext.length, as.hashStack[cd], 1)];
				}
			} else {
				/* 通常 */
				s2 = ext[me.overflow(ext.length, as.hashStack[cd], 1)];
			}
		}
		if (gen && as.levelupHashStack[cd]) {
			var u = 0;
			s3 = gen[this.overflow(gen.length, as.levelupHashStack[cd], 2)] + boostFn("create", 0);
			if (this.constBoostPoint.photon["create"] && this.constBoostPoint.photon[
					"create"][status]) {
				u = useP ? this.constBoostPoint.photon["create"][status][level] : 0
			}
			s3 = Math.max(s3, u)
		}
		if (status) {
			if (s1 || s2) {
				s4 = Math.max(s1 + boostFn("extend", s1), s2 + boostFn("extend", s2))
			}
		}

		a = Math.max(Math.max(Math.max(s1, s2), s3), s4);
		if (a && as.refBonusStack[cd]) {
			a += as.refBonusStack[cd]
		}
		return Math.min(100, a)
	},

	/**
	 * @private
	 * 配列の中から該当するコード種別、またはコードそのものの位置を返却する
	 * 従来コード種別(頭2桁)だけだったものを、グリフォン・ソールのオルレジ3に対する仕様変更
	 *
	 * @param arr 対象の配列
	 * @param cd 探すコード値
	 * @return 発見した位置、なければ-1を返す
	 */
	indexOf: function(arr, str) {
		if (str && arr) {
			if (Ext.isArray(arr)) {
				for (i = 0; i < arr.length; i++) {
					if (arr[i] && arr[i] == str.substr(0, arr[i].length)) {
						return i
					}
				}
			} else {
				if (Ext.isObject(arr)) {
					for (var b in arr) {
						if (b == str.substr(0, b.length)) {
							return b
						}
					}
					return null
				}
			}
		}
		return -1
	},

	/**
	 * @private
	 * 配列の要素範囲を超えない値を返却する
	 * 従来3個までだった素材数を超えた場合に最大値を返すための補助
	 *
	 * @param max 要素数
	 * @param value 値
	 * @param opt 要素番号の補正値
	 * @return
	 */
	overflow: function(max, value, opt) {
		if (max < value) return max - 1;
		return Math.max(0, value - opt);
	},

	/**
	 * 特殊能力を検索し結果を返却する
	 *
	 * @param {String} code 特殊能力コード
	 * @return {String} 能力名
	 */
	findAbilityName: function(code) {
		var me = this,
			store = me.getAbilityStore();

		return store.findRecord('code', code);
	},

	/**
	 * @private
	 * 能力名にあるギリシャ数字から数値を得る
	 *
	 * @param name {String} 能力名
	 * @return レベル数値
	 */
	getLevel: function(name) {
		var v = 0;

		if (0 < name.indexOf('IV')) {
			v =  4;
		} else if (0 < name.indexOf('VI')) {
			v =  6
		} else if (0 < name.indexOf('V')) {
			v =  5;
		} else if (0 < name.indexOf('III')) {
			v =  3;
		} else if (0 < name.indexOf('II')) {
			v =  2;
		} else if (0 < name.indexOf('I')) {
			v =  1;
		}

		return v;
	},

	/**
	 * 特殊能力追加成功率のリストを取得する
	 *
	 * @param {PSO2.AbilitySet} as 能力追加情報
	 * @param {Array} list 現在選択されいる追加能力コード
	 * @param {Array} opt
	 * @return {Array} 能力追加成功率のリスト
	 */
	getSuccessList: function(as, list, opt) {
		var me = this,
			nums = (list.length + opt.length),
			useEx = as.enableCheckMax == nums,
			useDouble = as.stores[1].exist() && as.stores[2].exist(),
			store = me.getAbilityStore(),
			len = list.length, rec, i, success, res = [];

			var xaaa= function(b, g, a) {}
			var b,	//as
			g,			//list
			a;			//opt
			// getSuccessList: function(b, g, a) {
				var l = this,
					n = (list.length + opt.length),	//nums
					f = as.enableCheckMax == nums,	//useEx
					m = (2 <= as.enableMaterial()),	//useDouble
					o = this.getAbilityStore(),			//store
					e = list.length,								//len
					c,			//rec
					d,			//i
					p,			//success
					h = [];	//res

		/* 現在選択されている追加能力コードを元に確立を計算 */
		for (i = 0; i < len; i++) {
			/* レコードを探す */
			var k = (list[i].inputValue.substr(0, 1) == "*");
			rec = store.findRecord("code", k ? list[i].inputValue.substr(1) : list[i].inputValue);
			if (rec) {
				/* 確率の取得 */
				success = k ? 100 : this.calcSuccess(as, rec);
				if (useEx && rec.get("notex") !== true) {
					/* エクストラスロット使用時 */
					success = parseInt(success = (success * this.constExtra[nums - 1][useDouble]) / 100)
				}
				res.push({
					name: rec.get("name"),
					success: success,
					dom: rec.get("dom")
				})
			}
		}

		/* 特殊能力の確率計算 */
		len = opt.length;
		for (i = 0; i < len; i++) {
			success = opt[i].get('extend');
			if (useEx) {
				/* エクストラスロット使用時 */
				success = parseInt((success * me.constExtra[nums - 1][useDouble]) / 100);
			}
			res.push({
				name: opt[i].get('name'),
				success: success,
				dom: opt[i].get("dom")
			});
		}
		return res;
	},

	/**
	 * 特殊能力追加成功率のリストを取得する
	 *
	 * @param {PSO2.AbilitySet} as 能力追加情報
	 * @param {Array} list 現在選択されいる追加能力コード
	 * @return {Array} 能力追加成功率のリスト
	 */
	getSuccessList2: function(as, list) {
		var me = this,
			useDouble = (2 <= as.enableMaterial()),
			store = me.getAbilityStore(),
			len = list.length, rec, i, success, res = {};

		/* 現在選択されている追加能力コードを元に確立を計算 */
		for (i = 0; i < len; i++) {
			/* レコードを探す */
			var g = (list[i]["code"].substr(0, 1) == "*");
			rec = store.findRecord("code", g ? list[i]["code"].substr(1) : list[i]["code"]);
			if (rec) {
				/* 確率の取得 */
				success = g ? 100 : this.calcSuccess(as, rec);
				res[rec.get("code")] = success
			}
		}
		return res;
	}
});
