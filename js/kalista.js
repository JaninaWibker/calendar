'use strict';
let kalista = () => {
  return {
    dom: function(tag, prop, children) {
      let c = 1;
      let x = 0;
      let obj = { 'tag': tag, 'children': []};
      if(typeof prop === 'object') {
        c++
        obj.prop = prop
      }
      for(let i = c;i < arguments.length;i++){
        if(typeof arguments[i] === 'object') {
          obj.children[i-c] = arguments[i]
        } else {
          obj.children[i-c] = {'tag': '__text__', 'text': arguments[i]}
        }
      }
      return obj
    },
    render: function(tree) {
      let el = document.createElement(tree.tag);

      if (tree.prop) {
        for (let i = 0; i < Object.keys(tree.prop).length; i++) {
          el.setAttribute(Object.keys(tree.prop)[i], tree.prop[Object.keys(tree.prop)[i]])
        }

      }
      if (tree.text) {
        el.innerText = tree.text;
      }
      if(tree.children){
        for (let i = 0; i < tree.children.length; i++) {
          if(tree.children[i].tag === '__text__'){
            el.appendChild(document.createTextNode(tree.children[i].text))
          } else {
            el.appendChild(kalista().render(tree.children[i], el));
          }
        }
      }
      return el;
    }
  }
}

let _stores = {}
let store = () => {
  return {
    create: function(name, data) {
      _stores[name] = {'data': data, 'callback': []}
    },
    subscribe: function(name, callback) {
      _stores[name].callback[_stores[name].callback.length] = callback
    },
    change: function(name, data) {
      for (let i = 0; i < Object.keys(_stores[name].data).length; i++) {
        if(data[Object.keys(_stores[name].data)[i]]) {
          _stores[name].data[Object.keys(_stores[name].data)[i]] = data[Object.keys(_stores[name].data)[i]]
        }
      }
      for (let i = 0; i < _stores[name].callback.length; i++) {
        _stores[name].callback[i].call(this, _stores[name].data)
      }
    },
    get: function(name) {
      return _stores[name].data
    }
  }
}

let $ = (query) => {
  return document.querySelectorAll(query)
}
