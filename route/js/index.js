 SPA_RESOLVE_INIT = function(transition) { 
	document.getElementById("content").innerHTML = '<p style="color:#099fde;">当前异步渲染首页'+ JSON.stringify(transition) +'</p>'
	console.log("首页回调" + JSON.stringify(transition))
}