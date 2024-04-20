import { jsxRenderer } from 'hono/jsx-renderer'

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="jp">
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=0.5, maximum-scale=4" />
      <title>PSO2 能力追加シミュレーター</title>
      <link rel="stylesheet" type="text/css" href="ext-4.0.7-gpl/resources/css/ext-all.css" />
      <link rel="stylesheet" type="text/css" href="default.css" />
      <script type="text/javascript" src="ext-4.0.7-gpl/ext-all.js"></script>
      <script type="text/javascript" src="ext-4.0.7-gpl/examples/ux/grid/FiltersFeature.js"></script>
      <script type="text/javascript" src="ext-4.0.7-gpl/examples/ux/TabCloseMenu.js"></script>
      <script type="text/javascript" src="ext-4.0.7-gpl/examples/ux/grid/menu/ListMenu.js"></script>
      <script type="text/javascript" src="ext-4.0.7-gpl/examples/ux/grid/menu/RangeMenu.js"></script>
      <script type="text/javascript" src="ext-4.0.7-gpl/examples/ux/grid/filter/Filter.js"></script>
      <script type="text/javascript" src="ext-4.0.7-gpl/examples/ux/grid/filter/StringFilter.js"></script>
      <script type="text/javascript" src="CurrencyField.js"></script>
      <script type="text/javascript" charset="utf-8" src="params.json"></script>
      <script type="text/javascript" charset="utf-8" src="utils.js"></script>
      <script type="text/javascript" charset="utf-8" src="cost.js"></script>
      <script type="text/javascript" charset="utf-8" src="ability.js"></script>
      <script type="text/javascript" charset="utf-8" src="result.js"></script>
      <script type="text/javascript" charset="utf-8" src="synthesis.js"></script>
      <script type="text/javascript" charset="utf-8" src="init.js"></script>
      </head>
    </html>
  )
})
