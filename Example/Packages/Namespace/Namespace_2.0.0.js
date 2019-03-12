/**
 * @name Namespace.js
 * @version 2.0.0
 * @author 天国V5
 * @description 这是一个用于WEB前端代码组织以及动态加载js的框架
 * 详细信息请戳这里https://github.com/fenices/Namespace
 * @email fenices@qq.com
 * 如果有问题发邮件吧，能力有限，看情况改吧....尽力!....尽力!
 *
 * 孩儿啊就要离开老父亲的硬盘了，去帮助（keng）有需要的人吧，你看为父慈祥的脸 _囧_
 */

(function () {
    var mVersion   = '2.0.0';
    var mLogStyles = {
        h1   : 'color:#626262;font-size:16px;font-family:微软雅黑;font-weight:bold',
        suc  : 'color:white;background:#3cae3f',
        load  : 'color:white;background:#28a6d5',
        cache: 'color:white;background:#929292',
        err  : 'color:white;background:#d52828',
        start: 'font-size:12px;font-weight:bold'
    };
    /**
     * 顶级类
     * @extends Window
     */
    if (typeof Namespace !== "undefined" || typeof NS !== "undefined") {
        return console.error("%cNamespace/NS对象不可用", mLogStyles.err);
    } else {
        window.Namespace = {};
        window.NS        = window.Namespace;
        console.log(`%c欢迎使用Namespace ${mVersion}由天国V5发布`, mLogStyles.h1);
    }

    var mStart       = "";
    var mNamespace   = "";
    var mCachedClass = new Map();
    var mScriptTags  = document.getElementsByTagName("script");
    for (var i = 0; i < mScriptTags.length; i++) {
        //获取代码根目录路径
        var script = mScriptTags[i];
        if (script.src.search(/Namespace_/) < 0) {
            continue;
        }
        mNamespace = script.src.replace(/Namespace_.*/g, '');
        mStart     = script.getAttribute("start");
        if (mStart === undefined || mStart === null || mStart.length === 0) {
            console.error(`%c Start参数错误 `, mLogStyles.err);
            console.dirxml(script);
            return;
        }
    }

    function CacheClass(fn) {
        if (fn !== null) {
            //成功
            console.log(`%c 导入：${mSrc} `, mLogStyles.load);
            mCachedClass.set(mSrc, fn);
        }
        else {
            //失败
            console.error(`%c 导入：${mSrc} `, mLogStyles.err);
        }
    }

    var mSrc  = '';
    var mClassName = '';
    var mClassPath = [];
    var mRootPath = window.location.pathname.replace(/[^\/]+$/, '');
    var mSubPath = mRootPath;
    /**
     * 用于导入其他类
     * @return (void) 返回值
     * @param pathname
     */
    Namespace.Import = function NS_Import(pathname) {
        mClassName = pathname.replace(/.*\//, '');
        mSrc  = TrimPath(mSubPath + pathname+'.js');
        if (mCachedClass.has(mSrc)) {
            console.log(`%c 重用：${mSrc} `, mLogStyles.cache);
            return mCachedClass.get(mSrc);
        }
        else {
            mClassPath.unshift(mSrc);
            DownLoadFile(mSrc);
        }
        var returnClass = mClassPath.shift();
        mSubPath = (mClassPath.length>0?mClassPath[0]:returnClass).replace(/[^\/]+$/, '');
        return mCachedClass.get(returnClass);
    };

    /**
     * 调用入口函数
     */
    window.onload = function () {
        console.group('加载引用');
        console.time('加载时间');
        var Start = new Namespace.Import(mStart);
        console.timeEnd('加载时间');
        console.groupEnd();
        console.log(`%c开始运行 ${TrimPath(mRootPath + mStart)}.js`, mLogStyles.start);
        new Start();
    };

    function TrimPath(src){
        var fileds = src.split('/');
        for (i=0;i<fileds.length;i++){
            if(fileds[i]==='..'){
                fileds.splice(i-1, 2);
                i-=2;
            }
        }
        return fileds.join('/');
    }

    /**
     * 下载script代码
     * @param url
     * @constructor
     */
    function DownLoadFile(url) {
        if (!document.getElementById(url)) {
            var ajax                = new XMLHttpRequest();
            ajax.onreadystatechange = function () {
                if (ajax.readyState === 4) {
                    if (ajax.status === 200) {
                        try {
                            mSubPath = url.replace(/[^\/]+$/, '');
                            var sourceMap = `//# sourceURL=http://${window.location.host}${url}`;
                            var cmd = `${sourceMap}\nCacheClass(${mClassName});\n${ajax.responseText}`;
                            new Function('CacheClass', cmd)(CacheClass);
                        }
                        catch (e) {
                            console.error(`%c 运行：${e} \n`, mLogStyles.err, url);
                        }
                    }
                    // else {
                    //     console.error(`%c 下载：${ajax.statusText} \n`, mLogStyles.err, url);
                    // }
                }
            };
            ajax.open('GET', url, false);
            ajax.send(null);
        }
    }

    /**
     * @return {string}
     */
    function GetFnName(func) {
        return String(func).replace(/\n|\s/g, "").replace(/function/, "").replace(/\(.*\).*/, "");
    }
})();
