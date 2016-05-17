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
    },
    diff: function(a, b, path, n, el) {
    if(!Array.isArray(a.children)) { a.children = []}
    if(!Array.isArray(b.children)) { b.children = []}
    let same = true
    if(path === ''){
      path = a.tag + ':nth-child(' + (n + 1) + ')'
    } else {
      path = path + ' ' + a.tag + ':nth-child(' + (n + 1) + ')'
    }
    if(a.tag === b.tag){
      if(keys(a.prop).length !== keys(b.prop).length){
        console.log('uneven amount of properties', path)
        if(keys(a.prop).length > keys(b.prop).length){
          for(let i=0;i<keys(a.prop).length;i++){
            if(keys(b.prop)[i] == undefined){
              console.log('remove "' + keys(a.prop)[i] + ': ' + key(a.prop, i) + '"', path)
              el.querySelector(path).removeAttribute(keys(a.prop)[i])
            } else if(a.prop[keys(a.prop)[i]] !== b.prop[keys(a.prop)[i]] || keys(a.prop)[i] !== keys(b.prop)[i]){
              console.log('change "' + keys(a.prop)[i] + ': ' + key(a.prop, i) + '" to "' + keys(b.prop)[i] + ': ' + key(b.prop, i) + '"', path)
              el.querySelector(path).setAttribute(keys(a.prop)[i], key(a.prop, i))
            }
          }
        } else if(keys(a.prop).length < keys(b.prop).length){
          for(let i=0;i<(keys(b.prop).length - keys(a.prop).length);i++){
            console.log('add "' + keys(b.prop)[i+keys(a.prop).length] + ': ' + key(b.prop, i+keys(a.prop).length) + '"', path)
            el.querySelector(path).setAttribute(keys(b.prop)[i+keys(a.prop).length], key(b.prop, i+keys(a.prop).length))
          }
        }
        same = false
      }
      for(let i=0;i<keys(a.prop).length;i++){
        if(a.prop[keys(a.prop)[i]] !== b.prop[keys(a.prop)[i]] || keys(a.prop)[i] !== keys(a.prop)[i]){
          console.log('change "' + keys(a.prop)[i] + ': ' + key(a.prop, i) + '" to "' + keys(b.prop)[i] + ': ' + key(b.prop, i) + '"', path)
          el.querySelector(path).setAttribute(keys(a.prop)[i], key(a.prop, i))
          same = false
        }
      }
      if(a.children.length === b.children.length){
        for(let i=0;i<a.children.length;i++){
          if(!kalista().diff(a.children[i], b.children[i], path, i)){
            same = false
          }
        }
      } else {
        if(a.children.length > b.children.length){
          for(let i=0;i<a.children.length;i++){
            if(b.children[i]){
              if(!kalista().diff(a.children[i], b.children[i], path, i)){
                same = false
              }
            } else {
              console.log('remove child node at ' + path , a.children[i])
            }
          }
        } else if(b.children.length > a.children.length){
          for(let i=0;i<b.children.length;i++){
            if(a.children[i]){
              if(!kalista().diff(a.children[i], b.children[i], path, i)){
                same = false
              }
            } else {
              console.log('add child(s) node at ' + path , b.children[i])
            }
          }
        }
      }
    } else {
      console.log('wrong tag: "' + a.tag + '" and "' + b.tag + '"', path)
      same = false
    }
    return same
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

let $ = (query, i) => i ? document.querySelectorAll(query)[i] : document.querySelectorAll(query)
let key = (obj, i) => obj[Object.keys(obj)[i]]
let keys = (obj) => Object.keys(obj)
