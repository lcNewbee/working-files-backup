# 科蓝前端开发平台
简单，跨平台，复用，持续优化的前端开发平台。

## 简介
本平台支持es6语法

## 快速上手
首先确保安装node.js环境.

### 依赖包安装
安装依赖包
#### npm
> 接下来安装 npm 依赖,在国内推荐安装 npm淘宝镜像
    npm config set registry https://registry.npm.taobao.org  
    npm install
> 由于我们使用 gulp，接下来安装 gulp-cli
> ``npm install gulp-cli -g``

#### Yarn
> 在国内推荐使用 npm 淘宝镜像
> ``yarn config set registry https://registry.npm.taobao.org``    
> ``yarn install``     

> 由于我们使用gulp，接下来安装 gulp-cli 
>``yarn install gulp-cli -g``

#### 在浏览器中查看效果
``gulp``

## 原则
在Comlanos前端平台设计与开发过程中我们尽量遵守以下原则

* 与其重新发明轮子，不如改进现在的轮子。
* 较少的代码是较好的
* 越少的组建越好，问问自己是否真的需要添加一个类
* 50行简单，易读的代码好于10行不容易读只懂得炫技代码
* 今天能做多好就多好。千万不要用“以后再改善”的借口来掩盖你的懒惰。
* 当在两方案间犹豫不决时，选择一个更容易返工的方案
* 说“不”是临时的，说“是”是永久的。如果你不能确定是否要做一个新功能，你就先说“不”，以后再改成是。
* 如果没有写好文档，就不要merge一个新功能
* 如果要写文档就确保文档能及时更新
* 如果没有做好测试，就不要merge一个新功能
* 每个人的问题都有些许不同，专注哪每个人都相同的部分，然后解决掉它。

参考文档：[Docker libcontainer 原则][https://github.com/docker/libcontainer/blob/master/PRINCIPLES.md]

## 修改记录
查看 CHANGLOG.md 文件
