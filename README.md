# 关于Namespace

&emsp;&emsp;这是一个用于WEB前端代码组织以及动态加载js的框架，加载方式为Ajax同步加载（怕阻塞页面？js都加不进来还搞什么，赶紧关页面，投诉运营商吧），所以采用同步的方式加载。然后通过入口模块逐层调用实现整个程序运行，因为Javascript语言的灵活性导致任意一个js文件都可以成为入口程序，而多个入口很容易会导致逻辑非常混乱，所以采用单一入口的方式执行代码。

&emsp;&emsp;为什么没有采用异步加载？异步加载不可避免会有回调产生，代码还会有层层嵌套，看起来很不爽，所以弃之。在Namespace中如果只在模块中写类的定义，而不是直接执行代码，则只会在文件加载后设定模块间的引用关系（这是正确的写法），所以导入的速度基本上取决于网速和Import动态解析的速度， 因为是同步加载所以不要在模块文件中放入加载后就会运行的代码，加载的时候就会执行代码，卡住找谁？（这是错误的写法），而且加进来就会自己跑的代码还要入口函数干什么?

&emsp;&emsp;入口模块的指定是通过Namespace.js所在的script标签上设置start='Launch'属性确定（名字随意），Namespace首先会自动加载Launch.js文件作为入口模块，并在之后所有引用的模块Import完成后，自动实例化入口模块Launch的实例，所以一切都开始于Lanuch的构造函数。

&emsp;&emsp;另外，现在的2.0其实是很多年前Namespace的重生版，之前的版本其实2009年就诞生了，那会哪有那么多模块加载的框架，例如：Require.js？（所以苦啊）， 那些年写JS还是很艰麻烦的，有很多蛋疼的问题，调试工具也很简陋基本上就是靠alert()，或者二分法alert()，并且随便一个js文件都有可能是入口程序，还有随随便便的一个文件几千行代码，所以就想写个单一入口，模块化加载的工具就像c#那样，只不过那时候不像现在有//# sourceURL能定位匿名代码，而且IE上调试起来也麻烦的一笔，那会项目简单，用起来也不复杂，所以之前的版本也没出现什么严重的Bug（也可能是没发现），当然，之前的版本也就只有我自己再用，不过后来才知道当时有个和我一起做项目的同事后来也用在自己的项目上了，窃喜，所以后来就有了动力（原来这东西还是有点用处的）。然后就有了现在的版本。

&emsp;&emsp;之前的版本在后来使用过程中陆续发现很多问题，比如：模块没有缓存造成重复加载，模块间的循环引用（先有鸡还是先有蛋？），另外模块的引用路径怎么设定规则，还有模块载入完成后的赋值过程也很蛋疼，再加上中间有很长时间转到Unity3D的开发上，所以之前的版本就沉了，这几天又开始做Web项目，所以又找出来重写了一遍，经过几天的挖耳挠腮把之前遇到的几个主要问题都搞定了，主要还是采用了在运行时注入代码的方式先拿到模块的引用缓存起来，再导入之后的模块，之前一直都不想采用往源代码注入的方式，感觉很不优雅，虽然不优雅，不过能解决鸡和蛋的问题，所以，大吉大利喽。

&emsp;&emsp;整个代码反正也没多长我就不搞Namespace.min.js了（主要是怕错 囧rz..）  

## 用法
&emsp;&emsp;Namespace只提供了一个方法，就是用Namespace.Import或简写NS.Import方法从指定的路径加载文件，并返回文件内与文件名同名的function的引用，该function就是构造函数，因为是同步加载，所以立即返回，无需等待，没有中间商回调，需要注意的是，所有Import的路径都是以写下该Import代码所在文件目录为起点，如：Main里面的Import就是以Main.js所在的目录为起点，同级目录就是直接引用，这种相对路径的引用方式，可以避免因为不同项目路径造成的文件引用问题，下面是一个简单的例子程序：  

> Website
>
> > Pages
> >
> > > index.html
> >
> > Starts
> >
> > > Main.js
> >
> > Packages
> >
> > > Namespace
> > >
> > > > Namespace_2.0.1.js
> >
> > Modules
> >
> > >Shapes
> > >
> > >> Circle.js
> > >>
> > >
> > >Structs
> > >
> > >> Vector2.js
> > >>
> > >> Helper.js
> > >

Website/Pages/index.html

```html
<html>
    <script src='../Packages/Namespace/Namespace_2.0.1.js' start='../Starts/Main'></script>
</html>
```

Website/Starts/Main.js

``` javascript
var Circle = NS.Import('../Modules/Shapes/Circle');

function Main()
{
    var c = new Circle({x:0, y:0, radius:20});
    c.Print();
}
```

Website/Modules/Shapes/Circle.js

``` javascript
var Vector2 = NS.Import('../Structs/Vector2');

function Circle(option)
{
    this.position = new Vector2(option.x, option.y);
    this.radius = option.radius;
}
Circle.prototype.Print = function()
{
    console.log('A circle');
}
```

Website/Modules/Structs/Vector2.js

```javascript
var Helper = NS.Import('Helper');

function Vector2(x, y)
{
    this.x = x;
    this.y = y;
    this.h = new Helper();
    
}

Vector2.prototype.Help = function()
{
    this.h.DoSomethings();
}
```

Website/Modules/Structs/Helper.js

```javascript
function Helper(){}
Helper.prototype.DoSomethings = function(){}
```

1. Chrome测试ok
2. Firfox测试ok
3. Edge应该也没问题
4. 遨游测试ok
5. IE帕斯，不知道是不是console写的有问题，有空试试看
6. 其他浏览器没装，不知道怎么样
---
## 2.0.1

优化了Import内部变量，提高可读性。

## v2.0.0

重制版，修改了很多之前为解决的Bug。

## v1.x.x

这是很多年前的版本，只能躺在我硬盘里做纪念了。
