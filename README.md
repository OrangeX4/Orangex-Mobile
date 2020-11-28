# Orangex
A useful tool chain for mobile coding with termux.  
You also can use it as a remote file manager and editor in your mobile phone to control your PC or server with a correct ip address and port.   

PS: Click title in editor to save the file.

## Install
```bash
npm install -g orangex
```

## Run
```bash
orangex
```

Open the url "http://127.0.0.1:8080/" in browser.

## Deploy UI

**The thing you should do is copying the files in `build` folder of [Finux-React](https://github.com/OrangeX4/finux-react) to `public` folder.**

# Orangex (中文说明)
为移动端的Linux系统或模拟器(如 Termux)设计的文件管理器和编辑器等一系列工具链.  
你也可以把它当作你的电脑或服务器的手机操控的远程文件管理器和编辑器, 只要你有正确的IP地址(如公网ip)和端口.

注意: 在编辑器中点击标题可以保存正在编辑的文件.

## 安装
```bash
npm install -g orangex
```

## 运行
```bash
orangex
```

在手机中的浏览器打开"http://127.0.0.1:8080/"

# 详细介绍（转自[我的博客](https://orangex4.cool/2020/10/11/%E5%9C%A8%E6%89%8B%E6%9C%BA%E4%B8%AD%E7%BC%96%E7%A8%8B-Orangex%E5%92%8CTermux%E9%85%8D%E7%BD%AE%E6%95%99%E7%A8%8B/)）

# 开始Orangex项目的起因（可忽略）

在19年的时候，偶然了解到Termux这个安卓手机上终端模拟器，惊叹于它的麻雀虽小五脏俱全，却也对它没有图形界面而感到遗憾。

没有图形界面，就难以流畅地在手机上写代码。

因此我去网上找了找相关的图形解决方案，发现无一不是巨大的，有的方案甚至接近一G多，并且对手机端屏幕的适配都不是很好。

于是我开始思考起了手机中的终端中再内置一个图形界面的必要性，发现这种想法完全是多余的--手机本身就有图形界面啊！

于是就下定决心通过浏览器，采取前后端传输数据的方案来实现对termux的操控，进而实现一个用户友好的图形界面。

**经过三周的秃头肝代码，我终于完成了Orangex。**

**Orangex中内置：文件管理器，编辑器，简易的终端控制器。**

**足够用来开发简单的cpp，python，web程序。**

## Github地址

[Github](https://github.com/OrangeX4/Orangex-Mobile)

欢迎Star, Pull Request!

## Orangex用户反馈交流群

QQ群: 1158193208

![](https://s1.ax1x.com/2020/10/11/0gBfwq.png)

# Termux的安装与配置

以下内容从**国光大大的Termux配置教程**中摘抄, 详细请见:

[国光Termux配置教程](https://www.sqlsec.com/2018/05/termux.html)

提醒:  
安装配置Termux需要稳定的网络环境, 甚至在必要的时候还需要使用代理, 否则极易失败.

## 下载Termux

F-Droid下载: [https://f-droid.org/packages/com.termux/](https://f-droid.org/packages/com.termux/)

百度云下载(推荐): [https://pan.baidu.com/s/1nrWb05hDfSp6TDVC4HXpVA](https://pan.baidu.com/s/1nrWb05hDfSp6TDVC4HXpVA)  
提取码: term  
![地址](https://s1.ax1x.com/2020/10/11/0gJSMV.jpg)

## 初始化

运行你安装好的Termux.

### 问题

第一次启动Termux的时候需要从远程服务器加载数据，然而可能会遇到这种问题：

![](https://image.3001.net/images/20200418/15871943464391.png)

目前解决方法有两种：

VPN 全局代理 （成功率很高）
如果你是 WiFi 的话尝试切换到运营商流量 （有一定成功率）
① Google Play ② F-Droid 根据这个顺序重复1、2操作

## Pkg更换国内源
使用pkg update 更新一下的时候发现默认的官方源网速有点慢，在这个喧嚣浮躁的时代，我们难以静下心等待，这个时候就得更换成国内的Termux清华大学源了，加快软件包下载速度.

pkg update 卡住的话多按几次'y'和回车,不要傻乎乎的等.

请复制以下代码, 粘贴到终端处.  
(注意 pkg update 下面的换行符也要复制)

```bash
sed -i 's@^\(deb.*stable main\)$@#\1\ndeb https://mirrors.tuna.tsinghua.edu.cn/termux/termux-packages-24 stable main@' $PREFIX/etc/apt/sources.list

sed -i 's@^\(deb.*games stable\)$@#\1\ndeb https://mirrors.tuna.tsinghua.edu.cn/termux/game-packages-24 games stable@' $PREFIX/etc/apt/sources.list.d/game.list

sed -i 's@^\(deb.*science stable\)$@#\1\ndeb https://mirrors.tuna.tsinghua.edu.cn/termux/science-packages-24 science stable@' $PREFIX/etc/apt/sources.list.d/science.list

pkg update

```

卡住就按回车, 比如

![](https://s1.ax1x.com/2020/10/11/0gNuLV.jpg)

![](https://s1.ax1x.com/2020/10/11/0gNns0.jpg)

## 安装基础工具与环境 (重要!!!)

复制粘贴运行下列代码: 

```bash
pkg install vim curl wget git tree nodejs python clang -y
```

该操作耗时较长, 请确保拥有良好的网络环境, 并且常常看一下需不需要按回车键.

## NPM设置淘宝镜像

执行下列命令: 
```bash
npm config set registry https://registry.npm.taobao.org
```

## 安装Orangex (重要!!! 关键步骤)

执行下列命令: 
```bash
npm install -g orangex
```

# 运行Orangex

## 执行命令

**以上配置环境的代码只用执行一次，**

**配置好环境之后，运行Orangex都只需要使用下面的代码就好。**

执行下列命令: 
```bash
orangex
```

![](https://s1.ax1x.com/2020/10/11/0gdhTK.jpg)

## 浏览器打开

然后在手机的浏览器中打开: [http://127.0.0.1:8080/](http://127.0.0.1:8080/)

这里推荐使用**Firefox**浏览器，能有较好的体验。

**至此，你就能愉快地写代码了！**

## 界面UI

![](https://s1.ax1x.com/2020/10/11/0gdfw6.jpg)

![](https://s1.ax1x.com/2020/10/11/0gdWex.jpg)

![](https://s1.ax1x.com/2020/10/11/0gd2O1.jpg)

# 终端界面优化 (选做)

该脚本主要使用了zsh来替代bash作为默认 shell，并且支持色彩和字体样式，同时也激活了外置存储，可以直接访问SD卡下的目录。主题默认为 agnoster，颜色样式默认为 Tango，字体默认为 Ubuntu。

复制粘贴回车执行下面代码:  
(注意不要漏了双引号!!! 否则将进入 > 类似的输入状态, 再输入一个双引号即可) 

```bash
sh -c "$(curl -fsSL https://html.sqlsec.com/termux-install.sh)"
```

执行, 等它下载安装完, 界面不动的时候多按几次回车.

该过程耗时较长, 请耐心等待.  
(可以切换成后台, 但请不要关闭Termux)

Android6.0 以上会弹框确认是否授权访问文件,点击始终允许授权后 Termux 可以方便的访问SD卡文件.

![](https://image.3001.net/images/20200418/1587207468173.png)

手机 App 默认只能访问自己的数据，如果要访问手机的存储，需要请求权限，如果你刚刚不小心点了拒绝的话，那么可以执行以下命令来重新获取访问权限:

```bash
termux-setup-storage
```

脚本允许后先后有如下两个选项:

```Bash
Enter a number, leave blank to not to change: 14
Enter a number, leave blank to not to change: 6
```

分别选择色彩样式和字体样式，重启Termux app后生效配置。不满意刚刚的效果，想要继续更改配色方案的话，可以根据下面命令来更改对应的色彩配色方案：

设置色彩样式：

输入`chcolor`命令更换色彩样式，或者：`~/.termux/colors.sh`命令

设置字体

运行`chfont`更换字体，或者：`~/.termux/fonts.sh`命令

# 其他

Termux配置教程详见：

[国光Termux配置教程](https://www.sqlsec.com/2018/05/termux.html)
