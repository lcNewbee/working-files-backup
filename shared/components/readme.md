![Logo](src/assets/images/logo.png)

# Rewarm UI
> Webpack，ES6, React, Immutable.js

App让人温暖的UI组件系统

## Installing / Getting started
使用git下载平台代码

## Developing

### Built With
Gulp, Webpack(V3+), Babel, Sass

### Prerequisites
确保已经安装 node.js.

### Setting up Dev
开发流程
> 创意
> 定义接口，文档
> 书写测试用例
> 实现
> pull request
> code review

#### npm
> 在国内推荐安装 npm 淘宝镜像
```shell
npm config set registry https://registry.npm.taobao.org
npm install
```
> 由于我们使用 gulp，接下来安装 gulp-cli
```shell
npm install gulp-cli -g
```

> 在开发目录文件夹下安装依赖
```shell
npm install
```

#### Yarn
> 安装 Yarn
```shell
npm install yarn -g

> 在国内推荐使用 npm 淘宝镜像
```shell
yarn config set registry  https://registry.npm.taobao.org
``` 

> 由于我们使用 gulp，接下来安装 gulp-cli 
```shell
yarn global add gulp-cli
```

> 在开发目录文件夹下安装依赖
```shell
yarn
```

### Building
打开命令行，跳转到代码文件夹，运行gulp
```shell
cd yourProject
gulp
```
将会自动打开浏览器运行代码

### Deploying / Publishing
发布产品
```shell
gulp pub productName  // productName产品名称如：ac, axc3.0
```

## Versioning
查看![版本修改记录](CHANGELOG.md)

下载![发布版本](/releases)

## Configuration

## Tests
使用Jest进行单元测试
```shell
gulp test
```
[Writing Tests][http://redux.js.org/docs/recipes/WritingTests.html]

## Style guide

### JavaScript Style Guide
使用eslint做静态代码检查，配置使用 eslint-config-airbnb

[Airbnb javascript style Guide][https://github.com/airbnb/javascript]

### CSS Style Guide 
待确认

### 开发原则
在设计与开发过程中我们尽量遵守以下原则

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

## Api Reference
### 代码开发

## Database
none

## Licensing
none

