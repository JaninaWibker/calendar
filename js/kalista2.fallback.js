'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var kalista = function kalista() {
  return {
    gen_id: function gen_id(obj_tree, path, i) {
      if (!path) {
        path = '';
      }
      if (!i) {
        i = 0;
      }
      var l_path = path + '.' + i;
      var obj = obj_tree;
      obj['__id__'] = l_path;
      if (obj.children) {
        for (i = 0; i < obj.children.length; i++) {

          obj.children[i] = kalista().gen_id(obj.children[i], l_path, i);
        }
      }
      return obj;
    },
    dom: function dom(tag, prop, children) {
      var c = 1;
      var x = 0;
      var obj = { 'tag': tag, 'children': [] };
      if ((typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) === 'object') {
        c++;
        obj.prop = prop;
      }
      for (var _i = c; _i < arguments.length; _i++) {
        if (_typeof(arguments[_i]) === 'object') {
          obj.children[_i - c] = arguments[_i];
        } else {
          obj.children[_i - c] = { 'tag': '__text__', 'text': arguments[_i] };
        }
      }
      return obj;
    },
    render: function render(tree) {
      var el = document.createElement(tree.tag);
      if (tree.prop) {
        for (var _i2 = 0; _i2 < Object.keys(tree.prop).length; _i2++) {
          el.setAttribute(Object.keys(tree.prop)[_i2], tree.prop[Object.keys(tree.prop)[_i2]]);
        }
      }
      el.setAttribute('kalista-dataid', tree.__id__);
      if (tree.text) {
        el.innerText = tree.text;
      }
      if (tree.children) {
        for (var _i3 = 0; _i3 < tree.children.length; _i3++) {
          if (tree.children[_i3].tag === '__text__') {
            el.appendChild(document.createTextNode(tree.children[_i3].text));
          } else {
            el.appendChild(kalista().render(tree.children[_i3], el));
          }
        }
      }
      return el;
    },
    diff: function diff(obj1, obj2, el, path, n) {
      var a = obj1,
          b = obj2;
      if (!Array.isArray(a.children)) {
        a.children = [];
      }
      if (!Array.isArray(b.children)) {
        b.children = [];
      }
      if (a.prop == null) {
        a.prop = {};
      }
      if (b.prop == null) {
        b.prop = {};
      }
      var same = true,
          temp_result = void 0,
          temp_selector = void 0;
      if (a.tag === b.tag) {
        if (keys(a.prop).length !== keys(b.prop).length) {
          // console.log('uneven amount of properties', path)
          if (keys(a.prop).length > keys(b.prop).length) {
            for (var _i4 = 0; _i4 < keys(a.prop).length; _i4++) {
              if (keys(b.prop)[_i4] == undefined) {
                // console.log('remove "' + keys(a.prop)[i] + ': ' + key(a.prop, i) + '"', a.__id__)
                $('[kalista-dataid="' + a.__id__ + '"]', 0, el).removeAttribute(keys(a.prop)[_i4]);
              } else if (a.prop[keys(a.prop)[_i4]] !== b.prop[keys(a.prop)[_i4]] || keys(a.prop)[_i4] !== keys(b.prop)[_i4]) {
                // console.log('change "' + keys(a.prop)[i] + ': ' + key(a.prop, i) + '" to "' + keys(b.prop)[i] + ': ' + key(b.prop, i) + '"', a.__id__)
                $('[kalista-dataid="' + a.__id__ + '"]', 0, el).setAttribute(keys(b.prop)[_i4], key(b.prop, _i4));
              }
            }
          } else if (keys(a.prop).length < keys(b.prop).length) {
            for (var _i5 = 0; _i5 < keys(b.prop).length - keys(a.prop).length; _i5++) {
              // console.log('add "' + keys(b.prop)[i+keys(a.prop).length] + ': ' + key(b.prop, i+keys(a.prop).length) + '"', a.__id__)
              $('[kalista-dataid="' + a.__id__ + '"]', 0, el).setAttribute(keys(b.prop)[_i5 + keys(a.prop).length], key(b.prop, _i5 + keys(a.prop).length));
            }
          }
          same = false;
        } else {
          for (var _i6 = 0; _i6 < keys(a.prop).length; _i6++) {
            if (a.prop[keys(a.prop)[_i6]] !== b.prop[keys(a.prop)[_i6]] || keys(a.prop)[_i6] !== keys(a.prop)[_i6]) {
              // console.log('change "' + keys(a.prop)[i] + ': ' + key(a.prop, i) + '" to "' + keys(b.prop)[i] + ': ' + key(b.prop, i) + '"', a.__id__)
              $('[kalista-dataid="' + a.__id__ + '"]', 0, el).setAttribute(keys(b.prop)[_i6], key(b.prop, _i6));
              same = false;
            }
          }
        }
        if (a.children.length === b.children.length) {
          for (var _i7 = 0; _i7 < a.children.length; _i7++) {
            temp_result = kalista().diff(a.children[_i7], b.children[_i7], el, path, _i7);
            if (!temp_result.isSame) {
              same = false;
              b.children[_i7] = temp_result.newRenderTree;
            }
          }
        } else {
          if (a.children.length > b.children.length) {
            for (var _i8 = 0; _i8 < a.children.length; _i8++) {
              if (b.children[_i8]) {
                temp_result = kalista().diff(a.children[_i8], b.children[_i8], el, path, _i8);
                if (!temp_result.isSame) {
                  same = false;
                  b.children[_i8] = temp_result.newRenderTree;
                }
              } else {
                // console.log('remove child node at ' + a.children[i].__id__ , a.children[i])
                $('[kalista-dataid="' + a.children[_i8].__id__ + '"]', 0, el).remove();
              }
            }
          } else if (b.children.length > a.children.length) {
            for (var _i9 = 0; _i9 < b.children.length; _i9++) {
              if (a.children[_i9]) {
                temp_result = kalista().diff(a.children[_i9], b.children[_i9], el, path, _i9);
                if (!temp_result.isSame) {
                  same = false;
                  b.children[_i9] = temp_result.newRenderTree;
                }
              } else {
                // console.log('add child node at ' + b.__id__ , b.children[i])
                $('[kalista-dataid="' + kalista().id(b.children[_i9].__id__).getParent() + '"]', 0, el).appendChild(kalista().render(b.children[_i9]));
              }
            }
          }
        }
      } else {
        // console.log('wrong tag: "' + a.tag + '" and "' + b.tag + '"', path)
        same = false;
      }
      if (a.tag === '__text__' && b.tag === '__text__') {
        if (a.text !== b.text) {
          temp_selector = $('[kalista-dataid="' + kalista().id(a.__id__).getParent() + '"]', 0, el);
          temp_selector.firstChild.remove();
          temp_selector.appendChild(document.createTextNode(b.text));
          // console.log('change "' + a.text + '" to "' + b.text + '" at ' + a.__id__)
        }
      }
      b.__id__ = a.__id__;
      return { 'isSame': same, 'newRenderTree': b };
    },
    id: function id(_id) {
      var temp = void 0;
      return {
        getParent: function getParent() {
          return _id.substring(0, _id.lastIndexOf('.'));
        },
        back: function back(n) {
          temp = _id;
          n = n + 1;
          for (i = 0; i < n; i++) {
            temp = temp.substring(0, temp.lastIndexOf('.'));
          }
          return temp;
        }
      };
    },
    version: function version() {
      return 'kalista.js v1.0';
    }
  };
};
var _stores = {};
var store = function store() {
  return {
    create: function create(name, data) {
      _stores[name] = { 'data': data, 'callback': [] };
    },
    subscribe: function subscribe(name, callback) {
      _stores[name].callback[_stores[name].callback.length] = callback;
    },
    change: function change(name, data) {
      for (var _i10 = 0; _i10 < Object.keys(_stores[name].data).length; _i10++) {
        if (data[Object.keys(_stores[name].data)[_i10]]) {
          _stores[name].data[Object.keys(_stores[name].data)[_i10]] = data[Object.keys(_stores[name].data)[_i10]];
        }
      }
      for (var _i11 = 0; _i11 < _stores[name].callback.length; _i11++) {
        _stores[name].callback[_i11].call(this, _stores[name].data);
      }
    },
    get: function get(name) {
      return _stores[name].data;
    }
  };
};

var $ = function $(query, i) {
  var el = arguments.length <= 2 || arguments[2] === undefined ? document : arguments[2];
  return typeof i === 'number' ? el.querySelectorAll(query)[i] : el.querySelectorAll(query);
};
var key = function key(obj, i) {
  return obj[Object.keys(obj)[i]];
};
var keys = function keys(obj) {
  return Object.keys(obj);
};
