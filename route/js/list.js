SPA_RESOLVE_INIT = function(transition) { 
	document.getElementById("content").innerHTML = '<p style="color:#F8C545;">当前异步渲染列表页'+ JSON.stringify(transition) +'</p>'
	console.log("首页回调" + JSON.stringify(transition))
}