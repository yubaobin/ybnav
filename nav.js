/**
 *
 * 滑动导航
 *
 */
;(function(window, document, Math) {
  'use strict';
  var VERSION = '1.0.0'
  var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) {
    setTimeout(callback, 60)
  }
  var sty = document.createElement('div').style
  var ybNavMap = {} // 保存所有ybnav对象
  var ua = navigator.userAgent.toLowerCase()

  //兼容
  var prefix = (function () {
    var vendors = ['OT', 'msT', 'MozT', 'webkitT', 't']
    var transform
    var i = vendors.length
    while (i--) {
      transform = vendors[i] + 'ransform'
      if (transform in sty) return vendors[i]
    }
  })()

  //使用工具
  var utils = {
    // 兼容
    TSF: prefix + 'ransform',
    TSD: prefix + 'ransitionDuration',
    TFO: prefix + 'ransformOrigin',
    isAndroid: /android/.test(ua),
    isIOS: /iphone|ipad/.test(ua),
    isMobile: /mobile|phone|android|pad/.test(ua),
    // 判断浏览是否支持perspective属性，从而判断是否支持开启3D加速
    translateZ: (function (pre) {
      var f
      if (pre) {
        f = pre + 'Perspective' in sty
      } else {
        f = 'perspective' in sty
      }
      return f ? ' translateZ(0px)' : ''
    })(prefix.substr(0, prefix.length - 1)),

    addClass: function (el, className) {
      if (typeof className === 'undefined') {
        return el
      }
      var classes = className.split(' ')
      for (var i = 0; i < classes.length; i++) {
        if(el.length !== undefined) {
          for (var j = 0; j < el.length; j++) {
            el[j].classList.add(classes[i])
          }
        }else {
          el.classList.add(classes[i])
        }
      }
      return el
    },
    removeClass: function (el, className) {
      var classes = className.split(' ')
      for (var i = 0; i < classes.length; i++) {
        if(el.length !== undefined) {
          for (var j = 0; j < el.length; j++) {
            el[j].classList.remove(classes[i])
          }
        }else {
            el.classList.remove(classes[i])
        }
      }
      return el
    },

    getX: function(e) {
      return e.touches ? e.touches[0].clientX : e.clientX
    },
    findNaver: function (el) {
      var id
      while (el !== document) {
        id = el.getAttribute('nav-id')
        if (id) {
          return ybNavMap[id]
        }
        el = el.parentNode
      }
      return null
    },
    // 移动制定位置
    moveTo: function (el, x, y, duration, callback) {
      var startX = 0
      var startY = 0
      var endX
      var endY
      var stepX
      var stepY
      var d
      var result
      result = /translate\(([-\d.]+)px,\s+([-\d.]+)px\)\s+/.exec(el.style[utils.TSF])
      if (result) {
        startX = Number(result[1])
        startY = Number(result[2])
      }
      d = duration || 17
      stepX = (x - startX) / (d / 17)
      stepY = (y - startY) / (d / 17)
      endX = startX
      endY = startY

      function moving () {
        d = d - 17
        if (d <= 0) {
          endX = x
          endY = y
        } else {
          endX = parseInt(endX + stepX, 10)
          endY = parseInt(endY + stepY, 10)
        }
        el.style[utils.TSF] = 'translate(' + endX + 'px, ' + endY + 'px)' + utils.translateZ

        if (d > 0 && !(endX === x && endY === y)) {
          rAF(moving)
        } else if (typeof callback === 'function') {
          callback()
        }
      }
      moving()
    }
  }

  // 检测是否支持passive选项
  var supportsPassiveOption = false
  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function () {
        supportsPassiveOption = true
      }
    })
    window.addEventListener('test', null, opts)
  } catch (e) {}

  function addEvent (el, type, method) {
    el.addEventListener(type, method, supportsPassiveOption ? { passive: false } : false)
  }

  function _touchstart (e) {
    var yb = utils.findNaver(e.target)
    yb.startX = utils.getX(e)
  }

  function _touchmove (e) {
    var yb = utils.findNaver(e.target)
    if(yb.scroll) {
      var dx = utils.getX(e) - yb.startX
      if (Math.abs(dx) > 5) {
        var changeX = dx + yb.swiperX
        if (changeX <= yb.bounceD && changeX >= -(yb.maxSCrollWidth + yb.bounceD)) {
          if (changeX <= 0 || changeX >= -yb.maxSCrollWidth) yb.dx = dx
          yb.ybnaver.style[utils.TSF] = 'translate(' + changeX + 'px, 0)' + utils.translateZ
        }
      }
    }
  }

  function _touchend (e) {
    var yb = utils.findNaver(e.target)
    var changeX = yb.dx + yb.swiperX
    if( changeX > 0) {
      utils.moveTo(yb.ybnaver, 0, 0, 200)
      yb.swiperX = 0
    }else if(changeX < - yb.maxSCrollWidth){
      utils.moveTo(yb.ybnaver, -yb.maxSCrollWidth, 0, 200)
      yb.swiperX = -yb.maxSCrollWidth
    }else {
      yb.swiperX += yb.dx // 记录所有变化
    }
    yb.dx = 0 // 把这次的变化初始化为0
  }

  function _click (e) {
    e.stopPropagation()
    var yb = utils.findNaver(e.target), el = e.target
    while('.' + el.className !== yb.options.navItem){
      if(el === yb.ybnaver){
        el = null
        break
      }
      el = el.parentNode
    }
    if(el) {
      utils.removeClass(yb.navItems, 'active')
      utils.addClass(el, 'active')
      var index = 0, items = yb.navItems
      while(items[index] !== el && index < items.length) {
        index++
      }
      yb.activeIndex = index
      if(typeof yb.options.clickItem === 'function'){
        yb.options.clickItem.call(yb, e, index)
      }
    }
  }

  var YBnav = function(el, options) {
    var me = this;
    me.container = typeof el === 'string' ? document.querySelector(el) : el
    me.ybnaver = me.container.children[0]
    // 防止多次new
    if (me.ybnaver.ybb) {
      me.ybnaver.ybb.refresh()
      return me.ybnaver.ybb
    } else {
      me.ybnaver.ybb = me
    }
    this._init(el, options)
  }

  YBnav.version = VERSION

  YBnav.utils = utils

  YBnav.ybnavMap = ybNavMap

  YBnav.prototype = {
    _init: function(el, options) {
      var me = this
      //创建id
      me.id = (options && options.id) || 'nav_' + Math.random().toString().substr(2, 8)

      me.container.setAttribute('nav-id', me.id);

      me.ybnaver.style[utils.TSF] = 'translate(0px,0px)' + utils.translateZ

      me.scroll = true

      ybNavMap[me.id] = me
      //默认选项
      me.options = {
        navItem: '.ybnav-item',
        bounce: true,
        clickItem: '',
        space: 0
      }
      for(var i in options) {
        me.options[i] = options[i]
      }
      me.navItems = me.ybnaver.querySelectorAll(me.options.navItem)

      if(me.options.space) {
        for (var i = 0; i < (me.navItems.length - 1); i++) {
          me.navItems[i].style.marginRight = me.options.space + 'px'
        }
      }

      me.startX = 0 // 开始点击坐标
      me.swiperX = 0 //总变化值
      me.dx = 0 // 一次滑动的变化值
      me.width = 0
      me.maxSCrollWidth = 0 //最大的滑动距离
      me.bounceD = 50 //回弹的距离
      me.activeIndex = 0

      // 添加监听事件
      addEvent(me.ybnaver, utils.isMobile ? 'touchstart' : 'mousedown', _touchstart)
      addEvent(me.ybnaver, utils.isMobile ? 'touchmove' : 'mousemove', _touchmove)
      addEvent(me.ybnaver, utils.isMobile ? 'touchend' : 'mouseup', _touchend)
      addEvent(me.ybnaver, 'click', _click)

      //刷新
      me.refresh()
    },
    //销毁
    destroy: function() {
      var me = this
      delete ybNavMap[me.id]
      me.prototype = null
      for (var i in me) {
        if (me.hasOwnProperty(i)) {
          delete me[i]
        }
      }
    },
    addNav: function(nav) {
      var oldNav = this.navItems;
      var oldLength = oldNav.length
      if(oldLength && this.options.space) this.navItems[oldLength-1].style.marginRight = this.options.space + 'px'
      var newNav = document.createElement('div')
      newNav.className = 'ybnav-item'
      newNav.innerHTML = nav
      this.ybnaver.appendChild(newNav)
      this.refresh()
    },
    removeNav: function(index, refresh) {
      this.navItems[index].parentNode.removeChild(this.navItems[index]);
      this.refresh()
    },
    setActive: function(index) {
      var active = this.navItems[index]
      utils.removeClass(this.navItems, 'active')
      utils.addClass(active, 'active')
    },
    scrollTo: function(index) {
      var navItem = this.navItems
      var dx = 0
      for(var i=0; i<index; i++) {
        dx+=navItem[i].offsetWidth
        if(this.options.space) dx+=this.options.space
      }
      if(dx > this.maxSCrollWidth) dx = this.maxSCrollWidth
      this.swiperX = -dx
      utils.moveTo(this.ybnaver, -dx, 0, 200)
    },
    //刷新
    refresh: function() {
      var me = this

      me.width = 0
      me.navItems = me.ybnaver.querySelectorAll(me.options.navItem)

      var parent = me.container.parentNode.getBoundingClientRect()
      var length =  me.navItems.length

      // 计算宽度
      if(me.navItems && length) {
        for(var i=0; i<length; i++) {
          me.width += me.navItems[i].offsetWidth
        }
        me.width += me.options.space * (length - 1)
        if(me.width > parent.width) {
          me.scroll = true
          me.maxSCrollWidth = me.width - parent.width
        }else {
          me.maxSCrollWidth = 0
          me.scroll = false
        }
        me.ybnaver.style.width = me.width + 'px'
      }
    },
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = YBnav
  }
  if (typeof define === 'function') {
    define(function () {
      return YBnav
    })
  }
  window.YBnav = YBnav;
})(window, document, Math);
