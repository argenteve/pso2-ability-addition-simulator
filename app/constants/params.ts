export const PARAMS = {
	/** 最終更新日(プログラムには利用していません) */
	lastModified: '2015-11-04 12:00:00(JST)',

	/**
	 * 特殊能力に用いるオプションリスト
	 *
	 * support: 確率をアップさせるための補助アイテム
	 * additional: 追加要素となる特殊能力の補助アイテム
	 */
	optionList: {
		support: [
			{name: '指定なし',           sname: '指定なし', value: 'A01', fn: 'function(v){ return v; }'},
			{name: '能力追加成功率+5%',  sname: '+5%',      value: 'A02', fn: 'function(v){ return Math.min(v +  5, 100); }'},
			{name: '能力追加成功率+10%', sname: '+10%',     value: 'A03', fn: 'function(v){ return Math.min(v + 10, 100); }'},
			{name: '能力追加成功率+20%', sname: '+20%',     value: 'A04', fn: 'function(v){ return Math.min(v + 20, 100); }'},
			{name: '能力追加成功率+30%', sname: '+30%',     value: 'A05', fn: 'function(v){ return Math.min(v + 30, 100); }'},
			{name: '能力追加成功率+40%', sname: '+40%',     value: 'A06', fn: 'function(v){ return Math.min(v + 40, 100); }'}
		],
		additional: [
			{name: '指定なし',             value: 'B01'},
			{name: '特殊能力追加（HP）',   value: 'B02', extend: 100, effect: 'HP(+45)'},
			{name: '特殊能力追加（PP）',   value: 'B03', extend: 100, effect: 'PP(+5)'},
			{name: '特殊能力追加（打撃）', value: 'B04', extend: 100, effect: '打撃力(+25)'},
			{name: '特殊能力追加（射撃）', value: 'B05', extend: 100, effect: '射撃力(+25)'},
			{name: '特殊能力追加（法撃）', value: 'B06', extend: 100, effect: '法撃力(+25)'},
			{name: '特殊能力追加（HP&PP）',   value: 'B10', extend: 100, effect: 'HP(+50),PP(+3)'},
			{name: '特殊能力追加（打撃&PP）', value: 'B07', extend: 100, effect: '打撃力(+25),PP(+3)'},
			{name: '特殊能力追加（射撃&PP）', value: 'B08', extend: 100, effect: '射撃力(+25),PP(+3)'},
			{name: '特殊能力追加（法撃&PP）', value: 'B09', extend: 100, effect: '法撃力(+25),PP(+3)'}
		]
	},

	/**
	 * 排他パターンの定義
	 */
	excludePattern: {
		/**
		 * 能力追加時にチェックするパターン
		 *
		 * 定義が無い場合は頭2文字をチェック
		 * そのため1文字のみ指定
		 */
		addition: [
			/* 状態異常*/
			'J',
			/* ソール */
			['R', 'S']
		],
		/**
		 * 能力選択時にチェックするパターン
		 *
		 * ワイルドカードの指定可能
		 */
		select: [
			/* 状態異常*/
			'J*',
			/* ソール */
			'R*',
			/* ソール or 特殊ソール */
			['S*','R*'],
			/* スティグマ or アルター・フリクト */
			['TA*', 'UA*', 'UB*'],
			/* ウィンクルム or モデュレイター */
			['TB*', 'TC*'],
			/* ラッキーライズ or EXPブースト */
			['VA*', 'VC*'],
			/* メセタフィーバーI or ラッキーライズ */
			['VB01', 'VA*'],
			/* メセタフィーバーIII or ラッキーライズ */
			['VB03', 'VA*'],
			/* メセタフィーバーI or EXPブースト */
			['VB01', 'VC*'],
			/* メセタフィーバーIII or EXPブースト */
			['VB03', 'VC*']
		]
	},

	/**
	 * 特殊能力の生成パターンの定義
	 *
	 *    base: 基本となる特殊能力コード
	 *          ソール・カタリストの登場により、個数分の表記を可能に
	 *          ワイルドカードを指定することで、パターンマッチが可能
	 *          その場合、参照先を'$$'とすることで、マッチした値が返却される
	 *     ref: 生成される参照先特殊能力コード(複数指定可)
	 * success: マッチした場合の成功率
	 */
	extendAbility: [
		/* パワー、シュート、テクニックの組み合わせ */
		{base: ['AA01', 'AB01', 'AC01'], ref: 'FA01', success:  80},
		{base: ['AA02', 'AB02', 'AC02'], ref: 'FA02', success:  70},
		{base: ['AA03', 'AB03', 'AC03'], ref: 'FA03', success:  60},
		/* ボディ、リアクト、マインドの組み合わせ */
		{base: ['BA01', 'BB01', 'BC01'], ref: 'FA01', success:  80},
		{base: ['BA02', 'BB02', 'BC02'], ref: 'FA02', success:  70},
		{base: ['BA03', 'BB03', 'BC03'], ref: 'FA03', success:  60},
		/* ブロウレジスト、ショットレジスト、マインドレジストの組み合わせ */
		{base: ['HA01', 'HB01', 'HC01'], ref: 'HZ01', success:  80},
		{base: ['HA02', 'HB02', 'HC02'], ref: 'HZ02', success:  70},
		{base: ['HA03', 'HB03', 'HC03'], ref: 'HZ03', success:  60},
		/* フレイムレジスト、アイスレジスト、ショックレジストの組み合わせ */
		{base: ['HI01', 'HJ01', 'HK01'], ref: 'HZ01', success:  80},
		{base: ['HI02', 'HJ02', 'HK02'], ref: 'HZ02', success:  70},
		{base: ['HI03', 'HJ03', 'HK03'], ref: 'HZ03', success:  60},
		/* ウィンドレジスト、ライトレジスト、グルームレジストの組み合わせ */
		{base: ['HL01', 'HM01', 'HN01'], ref: 'HZ01', success:  80},
		{base: ['HL02', 'HM02', 'HN02'], ref: 'HZ02', success:  70},
		{base: ['HL03', 'HM03', 'HN03'], ref: 'HZ03', success:  60},
		/* ソールレセプター、ソールの組み合わせを100%とする場合 */
		{base: ['XA01', 'R*'],           ref: '$$',   success: 100},
		/* ソールレセプター、特殊ソールの組み合わせを10%とする場合 */
		{base: ['XA01', 'S*'],           ref: '$$',   success:  10},
		/* アプレンティス,エルダー,ルーサー,x4,ダークネスソールの組み合わせ */
		{base: ['RP55', 'RC23', 'ROC2', 'RQ01','RI22'], ref: 'VJ01', success:  10},
		/* ソール・カタリストx4,ダークネス・ソールの組み合わせ */
		{base: ['VJ01', 'VJ01', 'VJ01', 'VJ01','RZ01'], ref: 'SA01', success:  60}
	],

	/**
	 * エクストラスロット確立定義
	 * false: 素材が1つの場合の確立補正(%)
	 *  true: 素材が2つの場合の確立補正(%)
	 */
	extraSlot: [
		{'false': 100, 'true': 100},
		{'false': 85,  'true': 90},
		{'false': 75,  'true': 85},
		{'false': 60,  'true': 70},
		{'false': 50,  'true': 60},
		{'false': 45,  'true': 55},
		{'false': 35,  'true': 40},
		{'false': 30,  'true': 30},
		{'false': 25,  'true': 25}
	],

	/**
	 * 継承・生成率のブーストポイントの定義
	 *   create: 生成時のパターン
	 *   extend: 継承時のパターン
	 * ステータスの種類、要素番号はレベル(0～5)を示す
	 *   1: ステータス系,
	 *   2: レジスト系(一部1と同じ)
	 *   3: 状態異常系
	 * それ以外のブースト値はstatusを設定せずにexboostを用いる
	 */
	boostPoint: {
		/* フォトンコレクト利用時 */
		'photon': {
			/* 生成時のブースト値 */
			'create': {
				'2': [  0,  0,  0, 70, 50, 40], /* レジスト上昇系 */
				'3': [  0,  0,  0, 80, 50, 40]  /* 状態異常系 */
			}
		},
		/* ミューテーション利用時 */
		'mutation': {
			/* 生成時のブースト値 */
			'create': {
				'1': [  0,  0,  0, 30,  0,  0], /* ステータス上昇系 */
				'2': [  0,  0,  0, 30,  0,  0], /* レジスト上昇系 */
				'3': [  0,  0,  0, 40,  0,  0]  /* 状態異常系 */
			}
		},
		/* ソール利用時 */
		'soul': {
			/* 生成時のブースト値 */
			'create': {
				'1': [  0,  0,  0, 20, 20,  0], /* ステータス上昇系 */
				'2': [  0,  0,  0, 20, 20,  0], /* レジスト上昇系 */
				'3': [  0,  0,  0, 30, 20,  0]  /* 状態異常系 */
			},
			/* 継承時のブースト値 */
			'extend': {
				'1': [  0,  0,  0, 20,  0,  0], /* ステータス上昇系 */
				'2': [  0,  0,  0, 20,  0,  0], /* レジスト上昇系 */
				'3': [  0,  0,  0, 60,  0,  0]  /* 状態異常系 */
			}
		}
	},

	/**
	 * 同一数による同一ボーナスのブースト値
	 * 1個 = 1, 2個 = 1.1, 3個以上 = 1.15
	 */
	sameBonusBoost: [1.0, 1.1, 1.15],

	/**
	 * 特殊能力の定義
	 *     code: アビリティコード（勝手に作成。頭二文字で同系統かを判断）
	 *      gid: グループID（勝手に作成。一覧表のグルーピングに利用）
	 *     name: 特殊能力名
	 *     lvup: レベルアップ時に生成される特殊能力コード
	 *   extend: 継承時の成功確率。配列の要素は能力の数[1個,2個,3個～]
	 * generate: 生成時の成功確率。配列の要素は能力の数[2個,3個～]
	 *  require: 継承時に必要な特殊能力を要する時のコード値
	 *    extup: 継承率がアップする特殊能力コードの定義(配列により複数の指定が可能)
	 *   status: 上記「boostPoint」に利用される番号
	 *           1=ステータス上昇系、2=レジスト上昇系、3=状態異常系、4=特殊能力(スティグマ、ウィンクルム)
	 *   effect: 効果の説明
	 */
	abilityList: [
		/* ステータス・パワー上昇系(A) */
		{code: 'AA01', gid: 'A', name: 'パワーI',             lvup: 'AA02', extend: [100, 100, 100],                          status: 1, effect: '打撃力(+10)'},
		{code: 'AA02', gid: 'A', name: 'パワーII',            lvup: 'AA03', extend: [ 60,  80, 100], generate: [60, 80],      status: 1, effect: '打撃力(+20)'},
		{code: 'AA03', gid: 'A', name: 'パワーIII',           lvup: 'AA04', extend: [ 60,  80, 100], generate: [30, 50],      status: 1, effect: '打撃力(+30)'},
		{code: 'AA04', gid: 'A', name: 'パワーIV',            lvup: 'AA05', extend: [ 40,  60,  80], generate: [20, 40],      status: 1, effect: '打撃力(+35)'},
		{code: 'AA05', gid: 'A', name: 'パワーV',                           extend: [ 20,  40,  60], generate: [10, 30],      status: 1, effect: '打撃力(+40)'},
		{code: 'AB01', gid: 'A', name: 'シュートI',           lvup: 'AB02', extend: [100, 100, 100],                          status: 1, effect: '射撃力(+10)'},
		{code: 'AB02', gid: 'A', name: 'シュートII',          lvup: 'AB03', extend: [ 60,  80, 100], generate: [60, 80],      status: 1, effect: '射撃力(+20)'},
		{code: 'AB03', gid: 'A', name: 'シュートIII',         lvup: 'AB04', extend: [ 60,  80, 100], generate: [30, 50],      status: 1, effect: '射撃力(+30)'},
		{code: 'AB04', gid: 'A', name: 'シュートIV',          lvup: 'AB05', extend: [ 40,  60,  80], generate: [20, 40],      status: 1, effect: '射撃力(+35)'},
		{code: 'AB05', gid: 'A', name: 'シュートV',                         extend: [ 20,  40,  60], generate: [10, 30],      status: 1, effect: '射撃力(+40)'},
		{code: 'AC01', gid: 'A', name: 'テクニックI',         lvup: 'AC02', extend: [100, 100, 100],                          status: 1, effect: '法撃力(+10)'},
		{code: 'AC02', gid: 'A', name: 'テクニックII',        lvup: 'AC03', extend: [ 60,  80, 100], generate: [60, 80],      status: 1, effect: '法撃力(+20)'},
		{code: 'AC03', gid: 'A', name: 'テクニックIII',       lvup: 'AC04', extend: [ 60,  80, 100], generate: [30, 50],      status: 1, effect: '法撃力(+30)'},
		{code: 'AC04', gid: 'A', name: 'テクニックIV',        lvup: 'AC05', extend: [ 40,  60,  80], generate: [20, 40],      status: 1, effect: '法撃力(+35)'},
		{code: 'AC05', gid: 'A', name: 'テクニックV',                       extend: [ 20,  40,  60], generate: [10, 30],      status: 1, effect: '法撃力(+40)'},
		{code: 'AD01', gid: 'A', name: 'アームI',             lvup: 'AD02', extend: [100, 100, 100],                          status: 1, effect: '技量(+10)'},
		{code: 'AD02', gid: 'A', name: 'アームII',            lvup: 'AD03', extend: [ 60,  80, 100], generate: [60, 80],      status: 1, effect: '技量(+20)'},
		{code: 'AD03', gid: 'A', name: 'アームIII',           lvup: 'AD04', extend: [ 60,  80, 100], generate: [30, 50],      status: 1, effect: '技量(+30)'},
		{code: 'AD04', gid: 'A', name: 'アームIV',            lvup: 'AD05', extend: [ 40,  60,  80], generate: [20, 40],      status: 1, effect: '技量(+35)'},
		{code: 'AD05', gid: 'A', name: 'アームV',                           extend: [ 20,  40,  60], generate: [10, 30],      status: 1, effect: '技量(+40)'},
		/* ステータス・ボディ上昇系(B) */
		{code: 'BA01', gid: 'A', name: 'ボディI',             lvup: 'BA02', extend: [100, 100, 100],                          status: 1, effect: '打撃防御(+10)'},
		{code: 'BA02', gid: 'A', name: 'ボディII',            lvup: 'BA03', extend: [ 60,  80, 100], generate: [60, 80],      status: 1, effect: '打撃防御(+20)'},
		{code: 'BA03', gid: 'A', name: 'ボディIII',           lvup: 'BA04', extend: [ 60,  80, 100], generate: [30, 50],      status: 1, effect: '打撃防御(+30)'},
		{code: 'BA04', gid: 'A', name: 'ボディIV',            lvup: 'BA05', extend: [ 40,  60,  80], generate: [20, 40],      status: 1, effect: '打撃防御(+35)'},
		{code: 'BA05', gid: 'A', name: 'ボディV',                           extend: [ 20,  40,  60], generate: [10, 30],      status: 1, effect: '打撃防御(+40)'},
		{code: 'BB01', gid: 'A', name: 'リアクトI',           lvup: 'BB02', extend: [100, 100, 100],                          status: 1, effect: '射撃防御(+10)'},
		{code: 'BB02', gid: 'A', name: 'リアクトII',          lvup: 'BB03', extend: [ 60,  80, 100], generate: [60, 80],      status: 1, effect: '射撃防御(+20)'},
		{code: 'BB03', gid: 'A', name: 'リアクトIII',         lvup: 'BB04', extend: [ 60,  80, 100], generate: [30, 50],      status: 1, effect: '射撃防御(+30)'},
		{code: 'BB04', gid: 'A', name: 'リアクトIV',          lvup: 'BB05', extend: [ 40,  60,  80], generate: [20, 40],      status: 1, effect: '射撃防御(+35)'},
		{code: 'BB05', gid: 'A', name: 'リアクトV',                         extend: [ 20,  40,  60], generate: [10, 30],      status: 1, effect: '射撃防御(+40)'},
		{code: 'BC01', gid: 'A', name: 'マインドI',           lvup: 'BC02', extend: [100, 100, 100],                          status: 1, effect: '法撃防御(+10)'},
		{code: 'BC02', gid: 'A', name: 'マインドII',          lvup: 'BC03', extend: [ 60,  80, 100], generate: [60, 80],      status: 1, effect: '法撃防御(+20)'},
		{code: 'BC03', gid: 'A', name: 'マインドIII',         lvup: 'BC04', extend: [ 60,  80, 100], generate: [30, 50],      status: 1, effect: '法撃防御(+30)'},
		{code: 'BC04', gid: 'A', name: 'マインドIV',          lvup: 'BC05', extend: [ 40,  60,  80], generate: [20, 40],      status: 1, effect: '法撃防御(+35)'},
		{code: 'BC05', gid: 'A', name: 'マインドV',                         extend: [ 20,  40,  60], generate: [10, 30],      status: 1, effect: '法撃防御(+40)'},
		/* ステータス・体力上昇系(E) */
		{code: 'EA01', gid: 'A', name: 'スタミナI',           lvup: 'EA02', extend: [100, 100, 100],                          status: 1, effect: 'HP(+20)'},
		{code: 'EA02', gid: 'A', name: 'スタミナII',          lvup: 'EA03', extend: [ 60,  80, 100], generate: [60, 80],      status: 1, effect: 'HP(+40)'},
		{code: 'EA03', gid: 'A', name: 'スタミナIII',         lvup: 'EA04', extend: [ 60,  80, 100], generate: [30, 50],      status: 1, effect: 'HP(+50)'},
		{code: 'EA04', gid: 'A', name: 'スタミナIV',          lvup: 'EA05', extend: [ 40,  60,  80], generate: [20, 40],      status: 1, effect: 'HP(+60)'},
		{code: 'EA05', gid: 'A', name: 'スタミナV',                         extend: [ 20,  40,  60], generate: [10, 30],      status: 1, effect: 'HP(+70)'},
		{code: 'EB01', gid: 'A', name: 'スピリタI',           lvup: 'EB02', extend: [100, 100, 100],                          status: 1, effect: 'PP(+2)'},
		{code: 'EB02', gid: 'A', name: 'スピリタII',          lvup: 'EB03', extend: [ 60,  80, 100], generate: [60, 80],      status: 1, effect: 'PP(+3)'},
		{code: 'EB03', gid: 'A', name: 'スピリタIII',         lvup: 'EB04', extend: [ 60,  80, 100], generate: [30, 50],      status: 1, effect: 'PP(+4)'},
		{code: 'EB04', gid: 'A', name: 'スピリタIV',          lvup: 'EB05', extend: [ 40,  60,  80], generate: [20, 40],      status: 1, effect: 'PP(+5)'},
		{code: 'EB05', gid: 'A', name: 'スピリタV',                         extend: [ 20,  40,  60], generate: [10, 30],      status: 1, effect: 'PP(+6)'},
		/* アビリティ(F) */
		{code: 'FA01', gid: 'A+',name: 'アビリティI',                       extend: [100, 100, 100],                                     effect: 'ALL(+5)'},
		{code: 'FA02', gid: 'A+',name: 'アビリティII',                      extend: [ 20,  40,  60],                                     effect: 'ALL(+10)'},
		{code: 'FA03', gid: 'A+',name: 'アビリティIII',                     extend: [ 10,  30,  50],                                     effect: 'ALL(+15)'},
		/* レジスト上昇系(H) */
		{code: 'HA01', gid: 'B', name: 'ブロウレジストI',     lvup: 'HA02', extend: [100, 100, 100],                          status: 1, effect: '打撃軽減(+3)'},
		{code: 'HA02', gid: 'B', name: 'ブロウレジストII',    lvup: 'HA03', extend: [ 60,  80, 100], generate: [60, 80],      status: 1, effect: '打撃軽減(+4)'},
		{code: 'HA03', gid: 'B', name: 'ブロウレジストIII',   lvup: 'HA04', extend: [ 60,  80, 100], generate: [30, 50],      status: 1, effect: '打撃軽減(+5)'},
		{code: 'HA04', gid: 'B', name: 'ブロウレジストIV',    lvup: 'HA05', extend: [ 40,  60,  80], generate: [20, 40],      status: 1, effect: '打撃軽減(+6)'},
		{code: 'HA05', gid: 'B', name: 'ブロウレジストV',                   extend: [ 20,  40,  60], generate: [10, 30],      status: 1, effect: '打撃軽減(+7)'},
		{code: 'HB01', gid: 'B', name: 'ショットレジストI',   lvup: 'HB02', extend: [100, 100, 100],                          status: 1, effect: '射撃軽減(+3)'},
		{code: 'HB02', gid: 'B', name: 'ショットレジストII',  lvup: 'HB03', extend: [ 60,  80, 100], generate: [60, 80],      status: 1, effect: '射撃軽減(+4)'},
		{code: 'HB03', gid: 'B', name: 'ショットレジストIII', lvup: 'HB04', extend: [ 60,  80, 100], generate: [30, 50],      status: 1, effect: '射撃軽減(+5)'},
		{code: 'HB04', gid: 'B', name: 'ショットレジストIV',  lvup: 'HB05', extend: [ 40,  60,  80], generate: [20, 40],      status: 1, effect: '射撃軽減(+6)'},
		{code: 'HB05', gid: 'B', name: 'ショットレジストV',                 extend: [ 20,  40,  60], generate: [10, 30],      status: 1, effect: '射撃軽減(+7)'},
		{code: 'HC01', gid: 'B', name: 'マインドレジストI',   lvup: 'HC02', extend: [100, 100, 100],                          status: 1, effect: '法撃軽減(+3)'},
		{code: 'HC02', gid: 'B', name: 'マインドレジストII',  lvup: 'HC03', extend: [ 60,  80, 100], generate: [60, 80],      status: 1, effect: '法撃軽減(+4)'},
		{code: 'HC03', gid: 'B', name: 'マインドレジストIII', lvup: 'HC04', extend: [ 60,  80, 100], generate: [30, 50],      status: 1, effect: '法撃軽減(+5)'},
		{code: 'HC04', gid: 'B', name: 'マインドレジストIV',  lvup: 'HC05', extend: [ 40,  60,  80], generate: [20, 40],      status: 1, effect: '法撃軽減(+6)'},
		{code: 'HC05', gid: 'B', name: 'マインドレジストV',                 extend: [ 20,  40,  60], generate: [10, 30],      status: 1, effect: '法撃軽減(+7)'},
		{code: 'HI01', gid: 'B', name: 'フレイムレジストI',   lvup: 'HI02', extend: [100, 100, 100],                          status: 2, effect: '炎耐性(+3)'},
		{code: 'HI02', gid: 'B', name: 'フレイムレジストII',  lvup: 'HI03', extend: [ 60,  80, 100], generate: [60, 80],      status: 2, effect: '炎耐性(+4)'},
		{code: 'HI03', gid: 'B', name: 'フレイムレジストIII', lvup: 'HI04', extend: [ 60,  80, 100], generate: [30, 50],      status: 2, effect: '炎耐性(+5)'},
		{code: 'HI04', gid: 'B', name: 'フレイムレジストIV',  lvup: 'HI05', extend: [ 40,  60,  80], generate: [20, 40],      status: 2, effect: '炎耐性(+6)'},
		{code: 'HI05', gid: 'B', name: 'フレイムレジストV',                 extend: [ 20,  40,  60], generate: [10, 30],      status: 2, effect: '炎耐性(+7)'},
		{code: 'HJ01', gid: 'B', name: 'アイスレジストI',     lvup: 'HJ02', extend: [100, 100, 100],                          status: 2, effect: '氷耐性(+3)'},
		{code: 'HJ02', gid: 'B', name: 'アイスレジストII',    lvup: 'HJ03', extend: [ 60,  80, 100], generate: [60, 80],      status: 2, effect: '氷耐性(+4)'},
		{code: 'HJ03', gid: 'B', name: 'アイスレジストIII',   lvup: 'HJ04', extend: [ 60,  80, 100], generate: [30, 50],      status: 2, effect: '氷耐性(+5)'},
		{code: 'HJ04', gid: 'B', name: 'アイスレジストIV',    lvup: 'HJ05', extend: [ 40,  60,  80], generate: [20, 40],      status: 2, effect: '氷耐性(+6)'},
		{code: 'HJ05', gid: 'B', name: 'アイスレジストV',                   extend: [ 20,  40,  60], generate: [10, 30],      status: 2, effect: '氷耐性(+7)'},
		{code: 'HK01', gid: 'B', name: 'ショックレジストI',   lvup: 'HK02', extend: [100, 100, 100],                          status: 2, effect: '雷耐性(+3)'},
		{code: 'HK02', gid: 'B', name: 'ショックレジストII',  lvup: 'HK03', extend: [ 60,  80, 100], generate: [60, 80],      status: 2, effect: '雷耐性(+4)'},
		{code: 'HK03', gid: 'B', name: 'ショックレジストIII', lvup: 'HK04', extend: [ 60,  80, 100], generate: [30, 50],      status: 2, effect: '雷耐性(+5)'},
		{code: 'HK04', gid: 'B', name: 'ショックレジストIV',  lvup: 'HK05', extend: [ 40,  60,  80], generate: [20, 40],      status: 2, effect: '雷耐性(+6)'},
		{code: 'HK05', gid: 'B', name: 'ショックレジストV',                 extend: [ 20,  40,  60], generate: [10, 30],      status: 2, effect: '雷耐性(+7)'},
		{code: 'HL01', gid: 'B', name: 'ウィンドレジストI',   lvup: 'HL02', extend: [100, 100, 100],                          status: 2, effect: '風耐性(+3)'},
		{code: 'HL02', gid: 'B', name: 'ウィンドレジストII',  lvup: 'HL03', extend: [ 60,  80, 100], generate: [60, 80],      status: 2, effect: '風耐性(+4)'},
		{code: 'HL03', gid: 'B', name: 'ウィンドレジストIII', lvup: 'HL04', extend: [ 60,  80, 100], generate: [30, 50],      status: 2, effect: '風耐性(+5)'},
		{code: 'HL04', gid: 'B', name: 'ウィンドレジストIV',  lvup: 'HL05', extend: [ 40,  60,  80], generate: [20, 40],      status: 2, effect: '風耐性(+6)'},
		{code: 'HL05', gid: 'B', name: 'ウィンドレジストV',                 extend: [ 20,  40,  60], generate: [10, 30],      status: 2, effect: '風耐性(+7)'},
		{code: 'HM01', gid: 'B', name: 'ライトレジストI',     lvup: 'HM02', extend: [100, 100, 100],                          status: 2, effect: '光耐性(+3)'},
		{code: 'HM02', gid: 'B', name: 'ライトレジストII',    lvup: 'HM03', extend: [ 60,  80, 100], generate: [60, 80],      status: 2, effect: '光耐性(+4)'},
		{code: 'HM03', gid: 'B', name: 'ライトレジストIII',   lvup: 'HM04', extend: [ 60,  80, 100], generate: [30, 50],      status: 2, effect: '光耐性(+5)'},
		{code: 'HM04', gid: 'B', name: 'ライトレジストIV',    lvup: 'HM05', extend: [ 40,  60,  80], generate: [20, 40],      status: 2, effect: '光耐性(+6)'},
		{code: 'HM05', gid: 'B', name: 'ライトレジストV',                   extend: [ 20,  40,  60], generate: [10, 30],      status: 2, effect: '光耐性(+7)'},
		{code: 'HN01', gid: 'B', name: 'グルームレジストI',   lvup: 'HN02', extend: [100, 100, 100],                          status: 2, effect: '闇耐性(+3)'},
		{code: 'HN02', gid: 'B', name: 'グルームレジストII',  lvup: 'HN03', extend: [ 60,  80, 100], generate: [60, 80],      status: 2, effect: '闇耐性(+4)'},
		{code: 'HN03', gid: 'B', name: 'グルームレジストIII', lvup: 'HN04', extend: [ 60,  80, 100], generate: [30, 50],      status: 2, effect: '闇耐性(+5)'},
		{code: 'HN04', gid: 'B', name: 'グルームレジストIV',  lvup: 'HN05', extend: [ 40,  60,  80], generate: [20, 40],      status: 2, effect: '闇耐性(+6)'},
		{code: 'HN05', gid: 'B', name: 'グルームレジストV',                 extend: [ 20,  40,  60], generate: [10, 30],      status: 2, effect: '闇耐性(+7)'},
		{code: 'HZ01', gid: 'B', name: 'オールレジストI',                   extend: [ 30,  50,  70],                          status: 2, effect: '全属性耐性(+1)'},
		{code: 'HZ02', gid: 'B', name: 'オールレジストII',                  extend: [ 20,  40,  60],                          status: 2, effect: '全属性耐性(+2)'},
		{code: 'HZ03', gid: 'B', name: 'オールレジストIII',                 extend: [ 10,  30,  50],                          status: 2, effect: '全属性耐性(+3)'},
		{code: 'HZ04', gid: 'B', name: 'オールレジストIV',                                                                    status: 2, effect: '全属性耐性(+4)'},
		{code: 'HZ05', gid: 'B', name: 'オールレジストV',                                                                     status: 2, effect: '全属性耐性(+5)'},
		/* 状態異常系(J) */
		{code: 'JA01', gid: 'C', name: 'バーンI',             lvup: 'JA02', extend: [ 60,  80, 100],                          status: 3, effect: 'バーンLv1を付与する'},
		{code: 'JA02', gid: 'C', name: 'バーンII',            lvup: 'JA03', extend: [ 40,  60,  80], generate: [60, 80],      status: 3, effect: 'バーンLv2を付与する'},
		{code: 'JA03', gid: 'C', name: 'バーンIII',           lvup: 'JA04', extend: [ 20,  40,  60], generate: [20, 40],      status: 3, effect: 'バーンLv3を付与する'},
		{code: 'JA04', gid: 'C', name: 'バーンIV',            lvup: 'JA05', extend: [ 20,  30,  50], generate: [20, 40],      status: 3, effect: 'バーンLv4を付与する'},
		{code: 'JA05', gid: 'C', name: 'バーンV',                           extend: [ 10,  20,  40], generate: [10, 30],      status: 3, effect: 'バーンLv5を付与する'},
		{code: 'JB01', gid: 'C', name: 'フリーズI',           lvup: 'JB02', extend: [ 60,  80, 100],                          status: 3, effect: 'フリーズLv1を付与する'},
		{code: 'JB02', gid: 'C', name: 'フリーズII',          lvup: 'JB03', extend: [ 40,  60,  80], generate: [60, 80],      status: 3, effect: 'フリーズLv2を付与する'},
		{code: 'JB03', gid: 'C', name: 'フリーズIII',         lvup: 'JB04', extend: [ 20,  40,  60], generate: [20, 40],      status: 3, effect: 'フリーズLv3を付与する'},
		{code: 'JB04', gid: 'C', name: 'フリーズIV',          lvup: 'JB05', extend: [ 20,  30,  50], generate: [20, 40],      status: 3, effect: 'フリーズLv4を付与する'},
		{code: 'JB05', gid: 'C', name: 'フリーズV',                         extend: [ 10,  20,  40], generate: [10, 30],      status: 3, effect: 'フリーズLv5を付与する'},
		{code: 'JC01', gid: 'C', name: 'ショックI',           lvup: 'JC02', extend: [ 60,  80, 100],                          status: 3, effect: 'ショックLv1を付与する'},
		{code: 'JC02', gid: 'C', name: 'ショックII',          lvup: 'JC03', extend: [ 40,  60,  80], generate: [60, 80],      status: 3, effect: 'ショックLv2を付与する'},
		{code: 'JC03', gid: 'C', name: 'ショックIII',         lvup: 'JC04', extend: [ 20,  40,  60], generate: [20, 40],      status: 3, effect: 'ショックLv3を付与する'},
		{code: 'JC04', gid: 'C', name: 'ショックIV',          lvup: 'JC05', extend: [ 20,  30,  50], generate: [20, 40],      status: 3, effect: 'ショックLv4を付与する'},
		{code: 'JC05', gid: 'C', name: 'ショックV',                         extend: [ 10,  20,  40], generate: [10, 30],      status: 3, effect: 'ショックLv5を付与する'},
		{code: 'JD01', gid: 'C', name: 'ミラージュI',         lvup: 'JD02', extend: [ 60,  80, 100],                          status: 3, effect: 'ミラージュLv1を付与する'},
		{code: 'JD02', gid: 'C', name: 'ミラージュII',        lvup: 'JD03', extend: [ 40,  60,  80], generate: [60, 80],      status: 3, effect: 'ミラージュLv2を付与する'},
		{code: 'JD03', gid: 'C', name: 'ミラージュIII',       lvup: 'JD04', extend: [ 20,  40,  60], generate: [20, 40],      status: 3, effect: 'ミラージュLv3を付与する'},
		{code: 'JD04', gid: 'C', name: 'ミラージュIV',        lvup: 'JD05', extend: [ 20,  30,  50], generate: [20, 40],      status: 3, effect: 'ミラージュLv4を付与する'},
		{code: 'JD05', gid: 'C', name: 'ミラージュV',                       extend: [ 10,  20,  40], generate: [10, 30],      status: 3, effect: 'ミラージュLv5を付与する'},
		{code: 'JE01', gid: 'C', name: 'パニックI',           lvup: 'JE02', extend: [ 60,  80, 100],                          status: 3, effect: 'パニックLv1を付与する'},
		{code: 'JE02', gid: 'C', name: 'パニックII',          lvup: 'JE03', extend: [ 40,  60,  80], generate: [60, 80],      status: 3, effect: 'パニックLv2を付与する'},
		{code: 'JE03', gid: 'C', name: 'パニックIII',         lvup: 'JE04', extend: [ 20,  40,  60], generate: [20, 40],      status: 3, effect: 'パニックLv3を付与する'},
		{code: 'JE04', gid: 'C', name: 'パニックIV',          lvup: 'JE05', extend: [ 20,  30,  50], generate: [20, 40],      status: 3, effect: 'パニックLv4を付与する'},
		{code: 'JE05', gid: 'C', name: 'パニックV',                         extend: [ 10,  20,  40], generate: [10, 30],      status: 3, effect: 'パニックLv5を付与する'},
		{code: 'JF01', gid: 'C', name: 'ポイズンI',           lvup: 'JF02', extend: [ 60,  80, 100],                          status: 3, effect: 'ポイズンLv1を付与する'},
		{code: 'JF02', gid: 'C', name: 'ポイズンII',          lvup: 'JF03', extend: [ 40,  60,  80], generate: [60, 80],      status: 3, effect: 'ポイズンLv2を付与する'},
		{code: 'JF03', gid: 'C', name: 'ポイズンIII',         lvup: 'JF04', extend: [ 20,  40,  60], generate: [20, 40],      status: 3, effect: 'ポイズンLv3を付与する'},
		{code: 'JF04', gid: 'C', name: 'ポイズンIV',          lvup: 'JF05', extend: [ 20,  30,  50], generate: [20, 40],      status: 3, effect: 'ポイズンLv4を付与する'},
		{code: 'JF05', gid: 'C', name: 'ポイズンV',                         extend: [ 10,  20,  40], generate: [10, 30],      status: 3, effect: 'ポイズンLv5を付与する'},
		/* ミューテーション(O) */
		{code: 'OA01', gid: 'A+',name: 'ミューテーションI',                 extend: [  0,  50,  80],                                     effect: '打撃力(+10),<br>射撃力(+10),<br>法撃力(+10),<br>HP(+10)'},
		/* ソール・打撃系(RA) */
		{code: 'RA11', gid: 'D', name: 'グンネ・ソール',                    extend: [  0,  50,  80], extup: ['AA','BA','EA'],            effect: '打撃力(+15),<br>HP(+45)'},
		{code: 'RA15', gid: 'D', name: 'ジグモル・ソール',                  extend: [  0,  50,  80], extup: ['AA','EB','HC','JF'],       effect: '打撃力(+15),<br>PP(+4)'},
		{code: 'RA21', gid: 'D', name: 'ヴォル・ソール',                    extend: [  0,  50,  80], extup: ['AA','BA','EA','JA'],       effect: '打撃力(+30),<br>HP(+20)'},
		{code: 'RA22', gid: 'D', name: 'グワナ・ソール',                    extend: [  0,  50,  80], extup: ['AA','BA','JF'],            effect: '打撃力(+30),<br>HP(+10),<br>PP(+2)'},
		{code: 'RA23', gid: 'D', name: 'クォーツ・ソール',                  extend: [  0,  50,  80], extup: ['AA','BA','EB','JE'],       effect: '打撃力(+30),<br>PP(+3)'},
		{code: 'RA32', gid: 'D', name: 'レオーネ・ソール',                  extend: [  0,  50,  80], extup: ['TA'],                      effect: '打撃力(+35),<br>技量(+5),<br>HP(+20),<br>PP(+3)'},
		{code: 'RA33', gid: 'D', name: 'ベーアリ・ソール',                  extend: [  0,  50,  80], extup: ['TA'],                      effect: '打撃力(+35),<br>技量(+5),<br>PP(+3)'},
		/* ソール・打撃系(RB) */
		{code: 'RB11', gid: 'D', name: 'イーデッタ・ソール',                extend: [  0,  50,  80], extup: ['AB','EA','HA','JB'],       effect: '射撃力(+15),<br>HP(+45)'},
		{code: 'RB15', gid: 'D', name: 'マドゥ・ソール',                    extend: [  0,  50,  80], extup: ['AB','EB'],                 effect: '射撃力(+15),<br>PP(+4)'},
		{code: 'RB21', gid: 'D', name: 'ランサ・ソール',                    extend: [  0,  50,  80], extup: ['AB','BB','EA','HM'],       effect: '射撃力(+30),<br>HP(+20)'},
		{code: 'RB22', gid: 'D', name: 'ファング・ソール',                  extend: [  0,  50,  80], extup: ['AB','BB','JC'],            effect: '射撃力(+30),<br>HP(+10),<br>PP(+2)'},
		{code: 'RB23', gid: 'D', name: 'マイザー・ソール',                  extend: [  0,  50,  80], extup: ['AB','BB','EB','HB'],       effect: '射撃力(+30),<br>PP(+3)'},
		{code: 'RB31', gid: 'D', name: 'レオパード・ソール',                extend: [  0,  50,  80], extup: ['TA'],                      effect: '射撃力(+35),<br>技量(+5),<br>HP(+30)'},
		{code: 'RB32', gid: 'D', name: 'ジオーグ・ソール',                  extend: [  0,  50,  80], extup: ['TA'],                      effect: '射撃力(+35),<br>技量(+5),<br>HP(+20),<br>PP(+1)'},
		/* ソール・法撃系(RC) */
		{code: 'RC11', gid: 'D', name: 'ジャドゥ・ソール',                  extend: [  0,  50,  80], extup: ['AC','BC','EA'], 	         effect: '法撃力(+15),<br>HP(+45)'},
		{code: 'RC13', gid: 'D', name: 'ネプト・ソール',                    extend: [  0,  50,  80], extup: ['AC','EB','HC'],            effect: '法撃力(+15),<br>PP(+4)'},
		{code: 'RC21', gid: 'D', name: 'ラグネ・ソール',                    extend: [  0,  50,  80], extup: ['AC','BC','EA','HN'],       effect: '法撃力(+30),<br>HP(+20)'},
		{code: 'RC22', gid: 'D', name: 'ウォルガ・ソール',                  extend: [  0,  50,  80], extup: ['AC','BC','HK'],            effect: '法撃力(+30),<br>HP(+10),<br>PP(+2)'},
		{code: 'RC23', gid: 'D', name: 'エルダー・ソール',                  extend: [  0,  50,  80], extup: ['AC','BC','EB'],            effect: '法撃力(+30),<br>PP(+3)'},
		{code: 'RC31', gid: 'D', name: 'ディアボ・ソール',                  extend: [  0,  50,  80], extup: ['TA'],                      effect: '法撃力(+35),<br>技量(+5),<br>HP(+30)'},
		{code: 'RC33', gid: 'D', name: 'グランゾ・ソール',                  extend: [  0,  50,  80], extup: ['TA'],                      effect: '法撃力(+35),<br>技量(+5),<br>PP(+3)'},
		/* ソール・技量系(RE) */
		{code: 'RE13', gid: 'D', name: 'ニャウ・ソール',                    extend: [  0,  50,  80], extup: ['AD','EB','HA'],            effect: '技量(+15),<br>PP(+4)'},
		{code: 'RE21', gid: 'D', name: 'シグノ・ソール',                    extend: [  0,  50,  80], extup: ['AD','EA','JD'],            effect: '技量(+30),<br>HP(+20),<br>PP(+1)'},
		{code: 'RE22', gid: 'D', name: 'クローム・ソール',                  extend: [  0,  50,  80], extup: ['AD','EA','EB','JE'],       effect: '技量(+30),<br>HP(+10),<br>PP(+3)'},
		{code: 'RE23', gid: 'D', name: 'ラッピー・ソール',                  extend: [  0,  50,  80], extup: ['AD','EB','HM'],            effect: '技量(+30),<br>PP(+4)'},
		{code: 'RE51', gid: 'D', name: 'シノワ・ソール',                    extend: [  0,  50,  80], extup: ['AD','EA','JD'],            effect: '打撃(+5),<br>技量(+30),<br>HP(+25)<br>PP(+2)'},
		/* ソール・打撃防御系(RH) */
		{code: 'RH21', gid: 'D', name: 'スノウ・ソール',                    extend: [  0,  50,  80], extup: ['AA','BA','EA','HJ'],       effect: '打撃防御(+30),<br>HP(+20),<br>PP(+1)'},
		{code: 'RH22', gid: 'D', name: 'ロックベア・ソール',                extend: [  0,  50,  80], extup: ['AA','BA','HA'],            effect: '打撃防御(+30),<br>HP(+10),<br>PP(+3)'},
		{code: 'RH23', gid: 'D', name: 'エクス・ソール',                    extend: [  0,  50,  80], extup: ['AA','BA','EB','HA'],       effect: '打撃防御(+30),<br>PP(+4)'},
		/* ソール射撃防御系(RI) */
		{code: 'RI21', gid: 'D', name: 'マルモ・ソール',                    extend: [  0,  50,  80], extup: ['AB','BB','EA','JB'],       effect: '射撃防御(+30),<br>HP(+20),<br>PP(+1)'},
		{code: 'RI22', gid: 'D', name: 'ペルソナ・ソール',                  extend: [  0,  50,  80], extup: ['AB','BB','JD'],            effect: '射撃防御(+30),<br>HP(+10),<br>PP(+3)'},
		{code: 'RI23', gid: 'D', name: 'ヴァーダー・ソール',                extend: [  0,  50,  80], extup: ['AB','BB','EB','HL'],       effect: '射撃防御(+30),<br>PP(+4)'},
		/* ソール法撃防御系(RJ) */
		{code: 'RJ21', gid: 'D', name: 'キャタ・ソール',                    extend: [  0,  50,  80], extup: ['AC','BC','EA','HC','HI'],  effect: '法撃防御(+30),<br>HP(+20),<br>PP(+1)'},
		{code: 'RJ22', gid: 'D', name: 'シュレイダ・ソール',                extend: [  0,  50,  80], extup: ['AC','BC','HC','JA'],       effect: '法撃防御(+30),<br>HP(+10),<br>PP(+3)'},
		{code: 'RJ23', gid: 'D', name: 'ゴロン・ソール',                    extend: [  0,  50,  80], extup: ['AC','BC','EB','HB','HC'],  effect: '法撃防御(+30),<br>PP(+4)'},
		/* ソール複合2種(RO) */
		{code: 'ROA1', gid: 'D', name: 'オルグ・ソール',                    extend: [  0,  50,  80], extup: ['AA','BA','EA'],            effect: '打撃力(+20),<br>射撃力(+20),<br>HP(+10)'},
		{code: 'ROA2', gid: 'D', name: 'メデューナ・ソール',                extend: [  0,  50,  80], extup: ['AA','BA','HJ'],            effect: '打撃力(+20),<br>射撃力(+20),<br>HP(+5),<br>PP(+1)'},
		{code: 'ROA3', gid: 'D', name: 'ソーマ・ソール',                    extend: [  0,  50,  80], extup: ['AA','BA','EB','HI'],       effect: '打撃力(+20),<br>射撃力(+20),<br>PP(+2)'},
		{code: 'ROC1', gid: 'D', name: 'リンガ・ソール',                    extend: [  0,  50,  80], extup: ['AC','BC','EA','HL'],       effect: '打撃力(+20),<br>法撃力(+20),<br>HP(+10)'},
		{code: 'ROC2', gid: 'D', name: 'ルーサー・ソール',                  extend: [  0,  50,  80], extup: ['AC','BC'],                 effect: '打撃力(+20),<br>法撃力(+20),<br>HP(+5),<br>PP(+1)'},
		{code: 'ROC3', gid: 'D', name: 'マリューダ・ソール',                extend: [  0,  50,  80], extup: ['AC','BC','EB','JF'],       effect: '打撃力(+20),<br>法撃力(+20),<br>PP(+2)'},
		{code: 'ROE1', gid: 'D', name: 'バル・ソール',                      extend: [  0,  50,  80], extup: ['AB','BB','EA','JB'],       effect: '射撃力(+20),<br>法撃力(+20),<br>HP(+10)'},
		{code: 'ROE2', gid: 'D', name: 'ビブラス・ソール',                  extend: [  0,  50,  80], extup: ['AB','BB','HN'],            effect: '射撃力(+20),<br>法撃力(+20),<br>HP(+5),<br>PP(+1)'},
		{code: 'ROE3', gid: 'D', name: 'タガミカヅチ・ソール',              extend: [  0,  50,  80], extup: ['AB','BB','EB','JC'],       effect: '射撃力(+20),<br>法撃力(+20),<br>PP(+2)'},
		{code: 'ROG5', gid: 'D', name: 'リーリー・ソール',                  extend: [  0,  50,  80], extup: ['AA','BA','EA','HK'],       effect: '打撃力(+20),<br>打撃防御(+20),<br>HP(+20)'},
		/* ソール複合3種(RP) */
		{code: 'RP05', gid: 'D', name: 'クーガー・ソール',                  extend: [  0,  50,  80], extup: ['AD'],                      effect: '打撃力(+15),<br>射撃力(+15),<br>法撃力(+15),<br>技量(+15),<br>HP(+10),<br>PP(+2)'},
		{code: 'RP10', gid: 'D', name: 'グリフォン・ソール',                extend: [  0,  50,  80], extup: ['AA','AB','AC','HZ'],       effect: '打撃力(+15),<br>射撃力(+15),<br>法撃力(+15),<br>技量(+15),<br>HP(+5),<br>PP(+3)'},
		{code: 'RP15', gid: 'D', name: 'ナイトギア・ソール',                extend: [  0,  50,  80], extup: ['AD'],                      effect: '打撃力(+15),<br>射撃力(+15),<br>法撃力(+15),<br>技量(+15),<br>PP(+4)'},
		{code: 'RP25', gid: 'D', name: 'アンガ・ソール',                    extend: [  0,  50,  80], extup: ['TB'],                      effect: '打撃力(+20),<br>射撃力(+20),<br>法撃力(+20),<br>PP(+4)'},
		{code: 'RP55', gid: 'D', name: 'アプレンティス・ソール',            extend: [  0,  50,  80], extup: ['TC'],                      effect: '打撃力(+40),<br>射撃力(+40),<br>法撃力(+40)'},
		{code: 'RPA5', gid: 'D', name: 'マガツ・ソール',                    extend: [  0,  50,  80], extup: ['EA', 'EB'],                effect: '打撃防御(+15),<br>射撃防御(+15),<br>法撃防御(+15),<br>HP(+30),<br>PP(+3)'},
		{code: 'RQ01', gid: 'D', name: 'ダブル・ソール',                    extend: [  0,  50,  80], extup: ['J','TC'],                  effect: 'HP(+40),<br>PP(+3)'},
		{code: 'RZ01', gid: 'D', name: 'ダークネス・ソール',                extend: [  0,  50,  80], extup: ['TE'],                      effect: 'ALL(+15),<br>HP(+15),<br>PP(+2)'},
		/* 特殊ソール・レセプター不可(S) */
		{code: 'SA01', gid: 'D', name: 'アストラル・ソール',                                                                             effect: 'ALL(+35),<br>HP(+35),<br>PP(+5)'},
		/* 特殊能力系(T) */
		{code: 'TA01', gid: 'A+',name: 'スティグマ',                        extend: [  0,  30,  50],                        exboost: 20, effect: '技量(+20),<br>PP(+5)'},
		{code: 'TF01', gid: 'A+',name: 'スピリタ・アルファ',                extend: [30,50,60,80,100],                                   effect: '技量(+30),<br>PP(+3)'},
		{code: 'TB01', gid: 'A+',name: 'ウィンクルム',                      extend: [  0,  30,  50],                        exboost: 20, effect: '打撃力(+20),<br>射撃力(+20),<br>法撃力(+20)'},
		{code: 'TC01', gid: 'A+',name: 'モデュレイター',                    extend: [  0,  30,  80],                        exboost: 10, effect: '打撃力(+30),<br>射撃力(+30),<br>法撃力(+30)'},
		{code: 'TE41', gid: 'A+',name: 'リターナーI',         lvup: 'TE42', extend: [  0,  80, 100],                                     effect: 'ALL(+3),<br>HP(+3),<br>PP(+1)'},
		{code: 'TE42', gid: 'A+',name: 'リターナーII',        lvup: 'TE43', extend: [  0,  70, 100], generate: [70, 70],                 effect: 'ALL(+5),<br>HP(+5),<br>PP(+2)'},
		{code: 'TE43', gid: 'A+',name: 'リターナーIII',       lvup: 'TE44', extend: [  0,  50, 100], generate: [50, 50],                 effect: 'ALL(+10),<br>HP(+10),<br>PP(+3)'},
		{code: 'TE44', gid: 'A+',name: 'リターナーIV',        lvup: 'TE45', extend: [  0,  40, 100], generate: [ 0, 30],                 effect: 'ALL(+15),<br>HP(+15),<br>PP(+4)'},
		{code: 'TE45', gid: 'A+',name: 'リターナーV',                       extend: [  0,   0,   0], generate: [ 0, 20],                 effect: 'ALL(+30),<br>HP(+30),<br>PP(+5)'},
		/* 特殊能力・フィーバー系(T) */
		{code: 'TD01', gid: 'D+',name: 'ラヴィ・フィーバー',                extend: [100, 100, 100],                                     effect: '打撃力(+10),<br>技量(+5),<br>HP(+10)'},
		{code: 'TD02', gid: 'D+',name: 'エグ・フィーバー',                  extend: [100, 100, 100],                                     effect: '射撃力(+10),<br>技量(+5),<br>HP(+10)'},
		{code: 'TD03', gid: 'D+',name: 'フログ・フィーバー',                extend: [100, 100, 100],                                     effect: '法撃力(+10),<br>技量(+5),<br>HP(+10)'},
		{code: 'TD04', gid: 'D+',name: 'ラブ・フィーバー',                  extend: [100, 100, 100],                                     effect: '打撃力(+10),<br>技量(+5),<br>PP(+2)'},
		{code: 'TD05', gid: 'D+',name: 'セント・フィーバー',                extend: [100, 100, 100],                                     effect: '射撃力(+10),<br>技量(+5),<br>PP(+2)'},
		{code: 'TD06', gid: 'D+',name: 'ラタン・フィーバー',                extend: [100, 100, 100],                                     effect: '法撃力(+10),<br>技量(+5),<br>PP(+2)'},
		{code: 'TD07', gid: 'D+',name: 'サマー・フィーバー',                extend: [100, 100, 100],                                     effect: '法撃力(+10),<br>技量(+5),<br>HP(+5),<br>PP(+1)'},
		{code: 'TD08', gid: 'D+',name: 'セレモ・フィーバー',                extend: [100, 100, 100],                                     effect: '打撃力(+10),<br>技量(+5),<br>HP(+5),<br>PP(+1)'},
		{code: 'TD09', gid: 'D+',name: 'ノイヤ・フィーバー',                extend: [100, 100, 100],                                     effect: '射撃力(+10),<br>技量(+5),<br>HP(+5),<br>PP(+1)'},
		{code: 'TD0A', gid: 'D+',name: 'トロクロ・フィーバー',              extend: [100, 100, 100],                                     effect: '技量(+15),<br>HP(+5),<br>PP(+1)'},
		{code: 'TD0B', gid: 'D+',name: 'サクラ・フィーバー',                extend: [100, 100, 100],                                     effect: '打撃防御(+10),<br>技量(+5),<br>HP(+5),<br>PP(+1)'},
		{code: 'TD0C', gid: 'D+',name: 'ソニック・フィーバー',              extend: [100, 100, 100],                                     effect: '打撃力(+10),<br>射撃防御(+10),<br>HP(+5),<br>PP(+1)'},
		{code: 'TD0D', gid: 'D+',name: 'サンサン・フィーバー',              extend: [100, 100, 100],                                     effect: '打撃力(+5),<br>射撃力(+5),<br>法撃力(+5),<br>HP(+5),<br>PP(+1)'},
		{code: 'TD0E', gid: 'D+',name: 'ルーナ・フィーバー',                extend: [100, 100, 100],                                     effect: '法撃力(+10),<br>HP(+10),<br>PP(+1)'},
		/* 特殊能力・フリクト/アルター系(U) */
		{code: 'UA01', gid: 'A+',name: 'フリクト・アルマ',                  extend: [  0,   0,  80],                                     effect: '打撃力(+20),<br>PP(+3)'},
		{code: 'UA11', gid: 'A+',name: 'フリクト・ティロ',                  extend: [  0,   0,  80],                                     effect: '射撃力(+20),<br>PP(+3)'},
		{code: 'UA21', gid: 'A+',name: 'フリクト・マギア',                  extend: [  0,   0,  80],                                     effect: '法撃力(+20),<br>PP(+3)'},
		{code: 'UB01', gid: 'A+',name: 'アルター・アルマ',                  extend: [  0,   0,  80],                                     effect: '打撃力(+20),<br>HP(+30)'},
		{code: 'UB11', gid: 'A+',name: 'アルター・ティロ',                  extend: [  0,   0,  80],                                     effect: '射撃力(+20),<br>HP(+30)'},
		{code: 'UB21', gid: 'A+',name: 'アルター・マギア',                  extend: [  0,   0,  80],                                     effect: '法撃力(+20),<br>HP(+30)'},
		{code: 'UC01', gid: 'A+',name: 'マーク・ジョイオ',                                                                               effect: '打撃力(+40),<br>射撃力(+40),<br>法撃力(+40),<br>HP(+50)'},
		{code: 'UC11', gid: 'A+',name: 'マーク・カレジナ',                                                                               effect: '打撃力(+40),<br>射撃力(+40),<br>法撃力(+40),<br>PP(+5)'},
		{code: 'UC21', gid: 'A+',name: 'マーク・アンガル',                                                                               effect: '打撃力(+50),<br>射撃力(+50),<br>法撃力(+50),<br>技量(+40)'},
		{code: 'UC31', gid: 'A+',name: 'マーク・グリフ',                                                                                 effect: '打撃防御(+50),<br>射撃防御(+50),<br>法撃防御(+50),<br>HP(+80)'},
		/* ギフト系(V) */
		{code: 'VA01', gid: 'E', name: 'ラッキーライズI',     lvup: 'VA02', extend: [  0,  75, 100],                    require: 'XB01', effect: 'アイテムドロップ率+5%'},
		{code: 'VA02', gid: 'E', name: 'ラッキーライズII',    lvup: 'VA03', extend: [  0,  50,  75], generate: [0, 60], require: 'XB01', effect: 'アイテムドロップ率+7%'},
		{code: 'VA03', gid: 'E', name: 'ラッキーライズIII',                 extend: [  0,  30,  50], generate: [0, 40], require: 'XB01', effect: 'アイテムドロップ率+10%'},
		{code: 'VB01', gid: 'E', name: 'メセタフィーバーI',   lvup: 'VZ02', extend: [  0,  75, 100],                    require: 'XB01', effect: 'フィールドメセタ+5%'},
		{code: 'VZ02', gid: 'E', name: 'メセタフィーバーII',  lvup: 'VB03', extend: [  0,  50,  75], generate: [0, 60], require: 'XB01', effect: 'フィールドメセタ+10%'},
		{code: 'VB03', gid: 'E', name: 'メセタフィーバーIII',               extend: [  0,  30,  50], generate: [0, 40], require: 'XB01', effect: 'フィールドメセタ+15%'},
		{code: 'VC01', gid: 'E', name: 'EXPブーストI',        lvup: 'VC02', extend: [  0,  75, 100],                    require: 'XB01', effect: '取得経験値+5%'},
		{code: 'VC02', gid: 'E', name: 'EXPブーストII',       lvup: 'VC03', extend: [  0,  50,  75], generate: [0, 60], require: 'XB01', effect: '取得経験値+7%'},
		{code: 'VC03', gid: 'E', name: 'EXPブーストIII',                    extend: [  0,  30,  50], generate: [0, 40], require: 'XB01', effect: '取得経験値+10%'},
		{code: 'VD01', gid: 'E', name: 'テンプテーション',                                                                               effect: 'アイテムドロップ率+10%'},
		{code: 'VE01', gid: 'E', name: 'アナザーヒストリー',                                                                             effect: '取得経験値+10%'},
		{code: 'VF01', gid: 'E', name: 'フレッシュ・サイン',                                                                             effect: 'Lv30まで取得経験値アップ'},
		/* 特殊系(V) */
		{code: 'VH01', gid: 'E', name: 'アルティメットバスター',            extend: [ 0,0,0,0, 100],                                     effect: '世壊種に与える<br>ダメージ+10%'},
		{code: 'VJ01', gid: 'E', name: 'ソール・カタリスト',                extend: [  0,  10,  30],                                     effect: 'HP(+10),<br>PP(+1)'},
		/* 触媒系(W～X) */
		{code: 'WA01', gid: 'E', name: 'フォトンコレクト',                                                                               effect: '状態異常の合成成功率上昇'},
		{code: 'XA01', gid: 'E', name: 'ソールレセプター',                                                                               effect: 'ソール系の合成成功率上昇'},
		{code: 'XB01', gid: 'E', name: 'ギフトレセプター',                                                                               effect: 'ギフト系を合成可能にする'},
		/* ジャンク(Z) */
		{code: 'ZA01', gid: 'F', name: 'ゴミA',                             extend: [100, 100, 100],                                     effect: '素材A(継承率100%)'},
		{code: 'ZB01', gid: 'F', name: 'ゴミB',                             extend: [100, 100, 100],                                     effect: '素材B(継承率100%)'},
		{code: 'ZC01', gid: 'F', name: 'ゴミC',                             extend: [100, 100, 100],                                     effect: '素材C(継承率100%)'},
		{code: 'ZD01', gid: 'F', name: 'ゴミD',                             extend: [100, 100, 100],                                     effect: '素材D(継承率100%)'},
		{code: 'ZE01', gid: 'F', name: 'ゴミE',                             extend: [100, 100, 100],                                     effect: '素材E(継承率100%)'},
		{code: 'ZF01', gid: 'F', name: 'ゴミF',                             extend: [100, 100, 100],                                     effect: '素材F(継承率100%)'},
		{code: 'ZG01', gid: 'F', name: 'ゴミG',                             extend: [100, 100, 100],                                     effect: '素材G(継承率100%)'},
		{code: 'ZH01', gid: 'F', name: 'ゴミH',                             extend: [100, 100, 100],                                     effect: '素材H(継承率100%)'},
		{code: 'ZI01', gid: 'F', name: 'ゴミI',                             extend: [100, 100, 100],                                     effect: '素材I(継承率100%)'}
	]
}