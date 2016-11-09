## 前端路由实现之 #hash ##
**先上github项目地址：** [spa-routers][1]
**运行效果图**
![运行效果图][2]

## 背景介绍 ##
用了许多前端框架来做`spa`应用，比如说`backbone，angular，vue`他们都有各自的路由系统，管理着前端的每一个页面切换，想要理解其中路由的实现，最好的方法就是手动实现一个。
前端路由有2种实现方式，一种是html5推出的`historyapi`，我们这里说的是另一种`hash`路由，就是常见的 `#` 号，这种方式兼容性更好。
## 需求分析 ##
我们这里只是简单的实现一个路由轮子，基本的功能包含以下：

 1. 切换页面
 2. 异步加载js
 3. 异步传参

## 实现步骤 ##

 1. 切换页面：路由的最大作用就是切换页面，以往后台的路由是直接改变了页面的url方式促使页面刷新。但是前端路由通过 # 号不能刷新页面，只能通过  window 的监听事件  hashchange 来监听hash的变化，然后捕获到具体的hash值进行操作

    ```
    //路由切换
	window.addEventListener('hashchange',function(){
		//do something 
        this.hashChange()
	})
    ```

 2. 注册路由：我们需要把路由规则注册到页面，这样页面在切换的时候才会有不同的效果。

    ```
    //注册函数
     map:function(path,callback){
       path = path.replace(/\s*/g,"");//过滤空格
       //在有回调，且回调是一个正确的函数的情况下进行存储 以 /name 为key的对象 {callback:xx}
       if(callback && Object.prototype.toString.call(callback) === '[object Function]' ){
    	   this.routers[path] ={
    			callback:callback,//回调
    			fn:null //存储异步文件状态，用来记录异步的js文件是否下载，下文有提及
    		} 
    	}else{
    	//打印出错的堆栈信息
    		console.trace('注册'+path+'地址需要提供正确的的注册回调')
    	}
     }
     
     //调用方式
     map('/detail',function(transition){
      ...
  	})
    ```

 3. 异步加载js：一般单页面应用为了性能优化，都会把各个页面的文件拆分开，按需加载，所以路由里面要加入异步加载js文件的功能。异步加载我们就采用最简单的原生方法，创建script标签，动态引入js。

    ```
    var _body= document.getElementsByTagName('body')[0],
	    scriptEle= document.createElement('script'); 
	scriptEle.type= 'text/javascript'; 
	scriptEle.src= xxx.js; 
	scriptEle.async = true;
	scriptEle.onload= function(callback){ 
        //为了避免重复引入js，我们需要在这里记录一下已经加载过的文件，对应的 fn需要赋值处理
        callback()
	} 
	_body.appendChild(scriptEle); 	
    ```

 4. 参数传递：在我们动态引入单独模块的js之后，我们可能需要给这个模块传递一些单独的参数。这里借鉴了一下jsonp的处理方式，我们把单独模块的js包装成一个函数，提供一个全局的回调方法，加载完成时候再调用回调函数。

    ```
    SPA_RESOLVE_INIT = function(transition) { 
    	document.getElementById("content").innerHTML = '<p style="color:#F8C545;">当前异步渲染列表页'+ JSON.stringify(transition) +'</p>'
    	console.log("首页回调" + JSON.stringify(transition))
    }
    ```
**扩展：**以上我们已经完成了基本功能，我们再对齐进行扩展，在页面切换之前`beforeEach`和切换完成`afterEach`的时候增加2个方法进行处理。思路是，注册了这2个方法之后，在切换之前就调用`beforeEach`，切换之后，需要等待下载js完成，在`onload`里面进行调用 `afterEach`

```
        //切换之前一些处理
		beforeEach:function(callback){
			if(Object.prototype.toString.call(callback) === '[object Function]'){
				this.beforeFun = callback;
			}else{
				console.trace('路由切换前钩子函数不正确')
			}
		},
		//切换成功之后
		afterEach:function(callback){
			if(Object.prototype.toString.call(callback) === '[object Function]'){
				this.afterFun = callback;
			}else{
				console.trace('路由切换后回调函数不正确')
			}
		},
```
通过以上的思路分析，再加以整合，我们就完成了一个简单的前端路由，并且可以加到页面进行实际的SPA开发，不过还是非常简陋。

完整的demo
 [spa-routers][3]
   
以上仅是我个人的一些看法，如有疑问，感谢指导    


  [1]: https://github.com/kliuj/spa-routers
  [2]: https://sfault-image.b0.upaiyun.com/141/103/1411034344-5821e08e5c623_articlex
  [3]: https://github.com/kliuj/spa-routers
