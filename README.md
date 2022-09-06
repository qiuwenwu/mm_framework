# mm_framework
这是超级美眉服务端框架，用于开发web服务端、分布式服务、连接器和websocket、MQTT通讯服务。

## 指南
### 一、安装与使用
1.创建目录
```
mkdir example
```
2.进入目录
```
cd example
```
3.初始化项目
```
npm init
```
4.安装mm_framework
```
npm i mm_framework
```
5. 创建server.js文件，并加入以下代码：
```javascript
require('mm_expand');
// 修改程序运行目录
$.runPath = __dirname + $.slash;
var os = require("../index.js");

var config = {};

var os = new os(config);

os.init().run().then((res) => {
	console.log("启动完毕".yellow)
});
```
6.在package.json的"scripts"中加入两行代码
```
"dev": "cross-env NODE_ENV=development nodemon server.js"
"start": "node server.js"
```
7.运行开发模式
```
npm run dev
```
8.运行生产模式
```
npm run start
```

备注：启动成功后会在目录下创建APP目录，APP目录下可以新建一个应用，此处以demo为例。

### 一、创建应用
1. 在app目录下添加一个名为demo的目录，然后在demo目录下面添加一个空的名为app.json文件
2. 系统自动补全了app.json，并创建了一个index.js文件, 该index.js用于控制应用的安装、卸载。

### 二、添加事件
1. 在demo目录下添加一个名为event_api的目录，然后在该目录下添加一个名为test_client的目录，并在该目录下添加一个空的event.json文件
2. 系统自动补全了event.json，并且创建了一个名为mian.js的文件，该文件用于编写路由事件。

### 三、请求与响应
通过restful风格发送post、get请求加上json-rpc2.0作为默认响应数据格式来实现通讯过程。  
请求的数据格式支持xml、form-data、json，接收到的数据会在request.query和request.body中。  
响应支持xml、text、json、html，但建议使用json格式，由于mm_framework采用函数式编程，所以可以直接return value来响应请求。  
```javascript
async function main(ctx, db){
	var query = ctx.request.query;
	var body = ctx.request.body;
	return "hello world"
}
module.exports = main;
```

### 四、拓展和规范
mm_framework将一个业务划分成两部分，一部分叫配置，一部分叫服务。  
为了方便区分，保存配置的是json文件，保存服务程序的是js文件，一个业务就由一个json和一个js组成，如果js是常规通用的，那么就可能只有一个配置json，启动后动态继承js。  

### 五、开发和步骤
1.设计数据库  
2.创建应用和插件  
3.使用命令自动生成接口、脚本和开发文档  
4.使用命令生成基本后台页面  
5.修改页面完成后台功能  
6.调整参数校验配置和SQL模板配置  
7.调整API接口配置完成开发  
  
## SDK
### 一、Mysql SQL数据库
1. 使用object对象进行增删改查  
2. 使用sql语句进行增删改查  
3. 使用sql模板语法进行增删改查  
4. 使用共鸣model对数据库进行修改  

### 二、Redis NoSQL数据库缓存
1. 使用增删改查函数  
2. 修改缓存时长  
3. 根据规律删除缓存  
4. 使用消息订阅和通知功能  

### 三、mangodb NoSQL数据库持久存储
1. 使用增删改查函数  
2. 使用object对象增删改查  

### 四、expand.js 拓展原型函数
1. 使用array原型函数  
2. 使用string原型函数  
3. 使用number原型函数  
4. 使用date原型函数  
5. 使用object便捷函数  

### 五、check.js 参数校验
1. 使用check校验入参  
2. 修改check错误提示  

### 六、http.js 网络请求
1. 使用http帮助类做get请求  
2. 使用http帮助类做post请求  
3. 使用http上传文件  
4. 使用http下载文件  

### 七、mathch.js 字符串匹配
1. 使用mathch格式匹配字符串  
2. 使用正则加格式匹配字符串  
3. 使用相似度匹配字符串  

### 八、html.js 网页数据抓取
1. 使用类似jquery方式提取html、text  
2. 使用类似jquery方式网抓取网页中添加数据  

### 九、art-template 视图渲染
1. 使用类似discuz模板语法渲染数据  
2. 使用mvc模式开发网站  

## 愿景
### 应用愿景
期待mm_framework能实现自动化、智能化、可视化开发

### 商业愿景
希望mm_framework能帮助更多企业快速实现应用落地计划，提升中小企业创业成功率，抢占市场先机。

### 开发愿景
希望能帮助开发者提高开发效率，同时也希望更多的开发者能一起打造更出更好的mm_framework来帮助企业成长。
