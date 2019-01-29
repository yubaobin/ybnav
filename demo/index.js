import '../src/ybnav.css'
import YBNav from '../src/nav.js'

var nav = new YBnav('.nav-container', {
  space: 5,
  clickItem: function(e, index) {
//        this.removeNav(index)
//        this.scrollTo(index)
  }
})
for(var i=0; i<10; i++) {
  nav.addNav('<span>标签'+ i +'</span>')
}
nav.refresh()

document.querySelector('.add').addEventListener('touchend', function() {
  nav.addNav('<span>新标签</span>', true)
  nav.scrollTo(nav.navItems.length)
})

document.querySelector('.jump').addEventListener('touchend', function() {
  nav.scrollTo(4)
  nav.setActive(4)
})