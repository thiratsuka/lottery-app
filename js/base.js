window.requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
    return window.setTimeout(callback, 1000 / 60);
  };
})();
window.cancelAnimFrame = (function(_id) {
  return window.cancelAnimationFrame || window.cancelRequestAnimationFrame || window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame || window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame || window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame || function(_id) { window.clearTimeout(id); };
})();

function closest(el, selector) {
  // type el -> Object
  // type select -> String
  var matchesFn;
  // find vendor prefix
  ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some(function(fn) {
    if (typeof document.body[fn] == 'function') {
      matchesFn = fn;
      return true;
    }
    return false;
  })
  var parent;
  // traverse parents
  while (el) {
    parent = el.parentElement;
    if (parent && parent[matchesFn](selector)) {
      return parent;
    }
    el = parent;
  }
  return null;
}

function getCssProperty(elem, property) {
  return window.getComputedStyle(elem, null).getPropertyValue(property);
}
var easingEquations = {
  easeOutSine: function(pos) {
    return Math.sin(pos * (Math.PI / 2));
  },
  easeInOutSine: function(pos) {
    return (-0.5 * (Math.cos(Math.PI * pos) - 1));
  },
  easeInOutQuint: function(pos) {
    if ((pos /= 0.5) < 1) {
      return 0.5 * Math.pow(pos, 5);
    }
    return 0.5 * (Math.pow((pos - 2), 5) + 2);
  }
};

function isPartiallyVisible(el) {
  var elementBoundary = el.getBoundingClientRect();
  var top = elementBoundary.top;
  var bottom = elementBoundary.bottom;
  var height = elementBoundary.height;
  return ((top + height >= 0) && (height + window.innerHeight >= bottom));
}

function isFullyVisible(el) {
  var elementBoundary = el.getBoundingClientRect();
  var top = elementBoundary.top;
  var bottom = elementBoundary.bottom;
  return ((top >= 0) && (bottom <= window.innerHeight));
}

function CreateElementWithClass(elementName, className) {
  var el = document.createElement(elementName);
  el.className = className;
  return el;
}

function createElementWithId(elementName, idName) {
  var el = document.createElement(elementName);
  el.id = idName;
  return el;
}

function getScrollbarWidth() {
  var outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.width = "100px";
  document.body.appendChild(outer);
  var widthNoScroll = outer.offsetWidth;
  // force scrollbars
  outer.style.overflow = "scroll";
  // add innerdiv
  var inner = document.createElement("div");
  inner.style.width = "100%";
  outer.appendChild(inner);
  var widthWithScroll = inner.offsetWidth;
  // remove divs
  outer.parentNode.removeChild(outer);
  return widthNoScroll - widthWithScroll;
}
var transform = ["transform", "msTransform", "webkitTransform", "mozTransform", "oTransform"];
var flex = ['-webkit-box', '-moz-box', '-ms-flexbox', '-webkit-flex', 'flex'];
var fd = ['flexDirection', '-webkit-flexDirection', '-moz-flexDirection'];
var animatriondelay = ["animationDelay", "-moz-animationDelay", "-wekit-animationDelay"];

function getSupportedPropertyName(properties) {
  for (var i = 0; i < properties.length; i++) {
    if (typeof document.body.style[properties[i]] != "undefined") {
      return properties[i];
    }
  }
  return null;
}
var transformProperty = getSupportedPropertyName(transform);
var flexProperty = getSupportedPropertyName(flex);
var fdProperty = getSupportedPropertyName(fd);
var ad = getSupportedPropertyName(animatriondelay);

function getPosition(el) {
  var xPos = 0;
  var yPos = 0;
  while (el) {
    if (el.tagName == "BODY") {
      // deal with browser quirks with body/window/document and page scroll
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;
      xPos += (el.offsetLeft - xScroll + el.clientLeft);
      yPos += (el.offsetTop - yScroll + el.clientTop);
    } else {
      // for all other non-BODY elements
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
    }
    el = el.offsetParent;
  }
  return {
    x: xPos,
    y: yPos
  };
}
/* images pc <---> sp */
(function() {
  var PicturePolyfill = (function() {
    function PicturePolyfill() {
      var _this = this;
      this.pictures = [];
      this.onResize = function() {
        var width = document.body.clientWidth;
        for (var i = 0; i < _this.pictures.length; i = (i + 1)) {
          _this.pictures[i].update(width);
        };
      };
      if ([].includes) return;
      var picture = Array.prototype.slice.call(document.getElementsByTagName('picture'));
      for (var i = 0; i < picture.length; i = (i + 1)) {
        this.pictures.push(new Picture(picture[i]));
      };
      window.addEventListener("resize", this.onResize, false);
      this.onResize();
    }
    return PicturePolyfill;
  }());
  var Picture = (function() {
    function Picture(node) {
      var _this = this;
      this.update = function(width) {
        width <= _this.breakPoint ? _this.toSP() : _this.toPC();
      };
      this.toSP = function() {
        if (_this.isSP) return;
        _this.isSP = true;
        _this.changeSrc();
      };
      this.toPC = function() {
        if (!_this.isSP) return;
        _this.isSP = false;
        _this.changeSrc();
      };
      this.changeSrc = function() {
        var toSrc = _this.isSP ? _this.srcSP : _this.srcPC;
        _this.img.setAttribute('src', toSrc);
      };
      this.img = node.getElementsByTagName('img')[0];
      this.srcPC = this.img.getAttribute('src');
      var source = node.getElementsByTagName('source')[0];
      this.srcSP = source.getAttribute('srcset');
      this.breakPoint = Number(source.getAttribute('media').match(/(\d+)px/)[1]);
      this.isSP = !document.body.clientWidth <= this.breakPoint;
      this.update();
    }
    return Picture;
  }());
  new PicturePolyfill();
}());
window.addEventListener('DOMContentLoaded', function() {
  new Menu();
  new Anchor();
  new Sticky();
  new tabs();
  if (document.getElementById('accor')) {
    new Accor();
  }
}); // tabs
var tabs = (function() {
  function tabs() {
    var e = this;
    this.tabs = document.querySelectorAll('#tabs li a');
    this.tabs_length = this.tabs.length;
    this.handling = function() {
      Array.prototype.map.call(e.tabs, function(obj) {
        obj.addEventListener('click', function(event) {
          event.preventDefault();
          var tab = this.getAttribute('data-tab');
          if (tab.trim() == '') {
            return;
          }
          [].map.call(document.querySelectorAll('ul.tabs li a'), function(el) {
            el.classList.remove('active');
            el.parentNode.classList.remove('active');
          });
          [].map.call(document.querySelectorAll('.tab_content'), function(el) {
            el.classList.remove('active');
          });
          this.classList.add('active');
          this.parentNode.classList.add('active');
          document.querySelector('#' + tab).classList.add('active');
        });
      });
    }
    this.handling();
  }
  return tabs;
})();
var Menu = function() {
  m = this;
  m._hamburger = document.getElementById('menu_icon');
  m._menu = document.getElementById('header__nav');
  m._body = document.querySelector('body');
  m._header = document.querySelector('#header');
  m._flag = true;
  m.wH = null;
  m.hHeader = null;
  if (!m._hamburger) return;
  m.init();
}
Menu.prototype = {
  init: function() {
    window.addEventListener('load', function() { m.Handl() }, true);
    window.addEventListener('resize', function() { m.resize() }, true);
  },
  Handl: function() {
    m.close();
    m._hamburger.addEventListener('click', function() { m.onClick() }, false);
  },
  onClick: function() {
    m.wH = window.innerHeight - document.querySelector('.header').offsetHeight;
    if (m._flag) {
      m._menu.classList.add('active');
      m._header.classList.add('active');
      m._hamburger.classList.add('active');
      m._body.style.overflow = 'hidden';
      m._flag = false;
      m._menu.style.height = (m.wH) + 'px';
    } else {
      m.close();
    }
  },
  close: function() {
    m._body.style.overflow = '';
    m._menu.classList.remove('active');
    m._header.classList.remove('active');
    m._hamburger.classList.remove('active');
    m._menu.removeAttribute("style");
    m._flag = true;
  },
  resize: function() {
    if (m._hamburger.classList.contains('active')) {
      if (window.innerWidth > 768) {
        m._hamburger.classList.remove('active');
        m._menu.classList.remove('active');
        document.body.style.overflow = 'auto';
        m._menu.style.height = 'auto';
        //document.body.style.paddingTop = document.querySelector('.header').clientHeight + 'px';
        m._menu.style.top = 0;
        m._menu.style.height = 'auto';
      } else {
        m._menu.style.height = window.innerHeight - document.querySelector('.header').offsetHeight + 'px';
        // m._menu.style.top = 0;
      }
    } else {
      if (window.innerWidth < 769) {
        m._menu.style.height = 0;
      } else {
        m._menu.style.height = 'auto';
      }
    }
  }
}
var Accor = (function() {
  function Accor() {
    var a = this;
    this._wrap = document.getElementById('accor');
    this._eles = this._wrap.querySelectorAll('dl dt');
    Array.prototype.forEach.call(this._eles, function(el) {
      el.addEventListener('click', function() {
        if (this.classList.contains('open')) {
          this.classList.remove('open');
          this.nextElementSibling.style.height = 0 + 'px';
        } else {
          this.classList.add('open');
          var _h = this.nextElementSibling.querySelector('.con').offsetHeight;
          this.nextElementSibling.style.height = _h + 'px';
        }
      })
    })
    this.reset = function() {
      Array.prototype.forEach.call(a._eles, function(el) {
        if (!el.classList.contains('open')) {
          el.nextElementSibling.style.height = 0 + 'px';
        } else {
          var _h = el.nextElementSibling.querySelector('.con').offsetHeight;
          el.nextElementSibling.style.height = _h + 'px';
        }
      })
    }
    window.addEventListener('resize', a.reset, false);
  }
  return Accor;
})();
var Sticky = (function() {
  function Sticky() {
    var s = this;
    this._target = document.getElementById('header');
    this._for_sp = function(top) {
      if (top > 0) {
        s._target.classList.add('fixed');
        document.body.style.paddingTop = s._target.clientHeight + 'px';
      } else {
        s._target.classList.remove('fixed');
        document.body.style.paddingTop = 0;
      }
    };
    this._for_pc = function(top, left) {
      if (top > 0) {
        s._target.classList.add('fixed');
        document.body.style.paddingTop = s._target.clientHeight + 'px';
      } else {
        s._target.classList.remove('fixed');
        document.body.style.paddingTop = 0;
      }
    };
    this.handling = function() {
      var _top = document.documentElement.scrollTop || document.body.scrollTop;
      var _left = document.documentElement.scrollLeft || document.body.scrollLeft;
      if (window.innerWidth < 1000) {
        s._for_sp(_top);
      } else {
        s._for_pc(_top, _left);
      }
    };
    window.addEventListener('scroll', s.handling, false);
    window.addEventListener('resize', s.handling, false);
    window.addEventListener('load', s.handling, false);
  }
  return Sticky;
})();
var Anchor = (function() {
  function Anchor() {
    var a = this;
    this._target = '.anchor';
    this._header = document.getElementById('header');
    // this._icon_menu = document.getElementById('menu_icon');
    this.timer;
    this.flag_start = false;
    this.iteration;
    this.eles = document.querySelectorAll(this._target);
    this.stopEverything = function() {
      a.flag_start = false;
    };
    this._getbuffer = function(next) {
      var _buffer;
      if (window.innerWidth < 769) {
        _buffer = 0;
      } else {
        _buffer = 0;
      }
      return _buffer;
    };
    this.scrollToY = function(scrollTargetY, speed, easing) {
      var scrollY = window.scrollY || window.pageYOffset,
        scrollTargetY = scrollTargetY || 0,
        speed = speed || 2000,
        easing = easing || 'easeOutSine',
        currentTime = 0;
      var time = Math.max(0.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, 0.8), );

      function tick() {
        if (a.flag_start) {
          currentTime += 1 / 60;
          var p = currentTime / time;
          var t = easingEquations[easing](p);
          if (p < 1) {
            requestAnimFrame(tick);
            window.scrollTo(0, scrollY + (scrollTargetY - scrollY) * t);
          } else {
            window.scrollTo(0, scrollTargetY);
          }
        }
      }
      tick();
    };
    this._getUrl = function() {
      var vars = {};
      var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
      }, );
      return vars;
    };
    Array.prototype.forEach.call(this.eles, function(el, i) {
      el.addEventListener('click', function(e) {
        var next = el.getAttribute('href').split('#')[1];
        el.classList.add('active');
        if (document.getElementById(next)) {
          a.flag_start = true;
          e.preventDefault();
          // if (a._icon_menu.classList.contains('active')) {
          //   a._icon_menu.click();
          // }
          if (window.innerWidth < 769) {
            a.scrollToY(document.getElementById(next).getBoundingClientRect().top + window.scrollY - a._getbuffer() + 0, 1500, 'easeOutSine', );
          } else {
            a.scrollToY(document.getElementById(next).getBoundingClientRect().top + window.scrollY - a._getbuffer() + 0, 1500, 'easeOutSine', );
          }
        }
      });
    });
    this._start = function() {
      var next = window.location.hash.split('#')[1];
      a.flag_start = true;
      if (document.getElementById(next)) {
        a.scrollToY(document.getElementById(next).getBoundingClientRect().top + window.scrollY - a._getbuffer(next) + 0, 1500, 'easeOutSine');
      }
    };
    window.addEventListener('load', a._start, false);
    document.querySelector('body').addEventListener('mousewheel', a.stopEverything, false);
    document.querySelector('body').addEventListener('DOMMouseScroll', a.stopEverything, false);
  }
  return Anchor;
})();
jQuery(function($) {
  $(document).on('click', '.newsList a', function(e) {
    e.preventDefault();
    $('#modalNews').addClass('open');
  })
  $(document).on('click', '.modalNews', function(e) {
    e.preventDefault();
    $('.modalNews').removeClass('open')
  })
  $(document).on('click', '.modalNews .modalNews__inner', function(e) {
    e.stopPropagation();
  })
  $(document).on('click', '.modalNews .close', function(e) {
    e.preventDefault();
    $('.modalNews').removeClass('open')
  })
  $('.cb-element').change(function() {
    if ($('.cb-element:checked').length == $('.cb-element').length) {
      $('#btn_apply').removeClass('disable')
    } else {
      $('#btn_apply').addClass('disable')
    }
  });
})