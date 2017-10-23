### 使用
#### 直接引用
```html
<link href="ybnav.css" />
<script src="nav.js"></script>
```
#### 初始化
```javascript
var nav = new YBnav(el, options)
```

#### 配置
1. navItem 每个item的类, 如 '.nav-item'
2. bounce 是否回弹 boolean值
3. clickItem 点击标签的回调方法
4. space 每个标签的间隔

#### 方法
1. addNav() 添加nav 如：addNav('<span>新标签</span>')
2. removeNav(index) 删除指定index的nav，从0开始
3. setActive(index) 把第index个设置成acitve，从0开始
4. scrollTo(index) 滚动到指定的标签，从0开始