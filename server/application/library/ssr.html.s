<?js setResponseHeaders({'content-type': 'text/html; charset=utf8'}) ?>
<!doctype html>
<html>
<head>
<?js if(__IS_DEV__) { ?>
<base href='http://127.0.0.1:3000' />
<?js } ?>
  <link rel="icon" href="data:,">
  <base target='_blank' />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no,maximum-scale=1.0,viewport-fit=cover" />
  <meta charset=utf8 />
  <?js for(let css_link of css) { ?>
    <link href='<?js echo(css_link) ?>' crossorigin='anonymous' rel='stylesheet' type='text/css' />
  <?js } ?>
</head>
<body>
  <div class='app'>$${{ssrHTML}}</div>
  <script type='text/javascript'>
    window.__ssrData__=<?js echo(ssrData) ?>;
  </script>
  <?js for(let js_link of js) { ?>
    <script type='text/javascript' src='<?js echo(js_link) ?>'></script>
  <?js } ?>
</body>
</html>

<?js
echo(readEchoed().replace(/\s*[\n\r]+\s*|^\s*/g, '').replace('$${{ssrHTML}}', ssrHTML))
