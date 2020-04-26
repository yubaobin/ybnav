import '../src/ybnav.css'
import YBNav from '../src/nav.js'

var nav = new YBnav('.ybnav-container', {
  space: 5,
  clickItem: function(e, index) {
		console.log(index)
  }
})

Array.from({ length: 10 }).forEach((item, i) => {
	nav.addNav(`<span>标签${i}</span>`)
})
nav.refresh()

document.querySelector('.add').addEventListener('click', function() {
  nav.addNav('<span>新标签</span>', true)
  nav.scrollTo(nav.navItems.length)
})

document.querySelector('.jump').addEventListener('click', function() {
  nav.scrollTo(4)
  nav.setActive(4)
})