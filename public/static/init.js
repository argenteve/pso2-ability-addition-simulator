Ext.Loader.setConfig({enabled: true});
Ext.require(['*']);
Ext.onReady(function() {
  var noDD = false;

  /* ドラッグ&ドロップが可能かどうかをユーザエージェントからチェックする */
  if (Ext.userAgent) {
    var ua = Ext.userAgent.toLowerCase();
    if (0 < ua.indexOf('iphone') || 0 < ua.indexOf('ipad')
        || 0 < ua.indexOf('ipod') || 0 < ua.indexOf('android')) {
      noDD = true;
    }
  }

  if (noDD === false) {
    Ext.tip.QuickTipManager.init();
  }

  Ext.create('PSO2.SynthesisComponent', {
    ajaxData: PSO2JSON,
    maxMaterial: 5, // 素材に出来る数を増やす場合
    noDD: noDD
  });
});
