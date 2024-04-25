import { jsxRenderer } from 'hono/jsx-renderer'
import { PARAMS } from '../constants/params'

// PARAMS の値を変数 PSO2JSON として参照できるようにするため、
// JavaScript の変数宣言の処理を文字列表現で作成し、
// HTML エスケープして script タグに出力する
const paramsDefine = `const PSO2JSON = ${JSON.stringify(PARAMS)}`
export default jsxRenderer(() => {
  return (
    <html lang="jp">
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=0.5, maximum-scale=4" />
      <meta name="keywords" content="PSO2,シミュレーター,特殊能力" />
      <meta name="description" content="PSO2の特殊能力追加シミュレーターです。" />
      <title>PSO2 能力追加シミュレーター</title>
      <link rel="stylesheet" type="text/css" href="static/ext-4.0.7-gpl/resources/css/ext-all.css" />
      <link rel="stylesheet" type="text/css" href="static/default.css" />
      <script type="text/javascript" src="static/ext-4.0.7-gpl/ext-all.js"></script>
      <script type="text/javascript" src="static/ext-4.0.7-gpl/examples/ux/grid/FiltersFeature.js"></script>
      <script type="text/javascript" src="static/ext-4.0.7-gpl/examples/ux/TabCloseMenu.js"></script>
      <script type="text/javascript" src="static/ext-4.0.7-gpl/examples/ux/grid/menu/ListMenu.js"></script>
      <script type="text/javascript" src="static/ext-4.0.7-gpl/examples/ux/grid/menu/RangeMenu.js"></script>
      <script type="text/javascript" src="static/ext-4.0.7-gpl/examples/ux/grid/filter/Filter.js"></script>
      <script type="text/javascript" src="static/ext-4.0.7-gpl/examples/ux/grid/filter/StringFilter.js"></script>
      <script type="text/javascript" src="static/CurrencyField.js"></script>
      <script type="text/javascript" charset="utf-8" src="static/utils.js"></script>
      <script type="text/javascript" charset="utf-8" src="static/cost.js"></script>
      <script type="text/javascript" charset="utf-8" src="static/ability.js"></script>
      <script type="text/javascript" charset="utf-8" src="static/result.js"></script>
      <script type="text/javascript" charset="utf-8" src="static/synthesis.js"></script>
      <script type="text/javascript" charset="utf-8" src="static/init.js"></script>
      <script type="text/javascript" charset="utf-8" dangerouslySetInnerHTML={{ __html: paramsDefine }}></script>
      </head>
    </html>
  )
})
