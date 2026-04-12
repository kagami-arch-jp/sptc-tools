<?js

define('__APP__', __dirname+'/application')
define('__CONF__', __dirname+'/conf')

define('__IS_DEV__', process.env.ENV!=='PROD')
define('__DEV_WWW_DIR__', __dirname+'/..')
define('__WWW_DIR__', __dirname+'/public')

define('__FE_DOC__', __dirname+'/docs/frontend')

setDebug(__IS_DEV__)

define('__DISABLE_SSR__', true)

__autoload(classname=>{
  if(classname.endsWith('Controller')) {
    return __APP__+'/controllers/'+classname.substr(0, classname.length-10).replace(/_/g, '/')+'.s'
  }
  return __APP__+'/library/'+classname.replace(/_/g, '/')+'.s'
})
define('__ROUTER_SETTING__', __dirname+'/conf/router.s')
define('__ROUTER__', __dirname+'/router.s')

const {resolve, execute}=include(__ROUTER__)
const pathname=resolve($_REQUEST_FILE['pathname'])
execute(pathname)
