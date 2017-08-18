
var warning = require('./warning');
var config;

// 多数方法都会修改传入的target数组，因为数组包含的对象中，含有来自其他地方的引用，必须保持这个引用

/**
 * 通过遍历targetArr数组，找出id所指示的对象路径
 * 遍历过程中，给每个加入堆栈的对象添加一个标识其路径的属性，如果该对象id和目的id相同，则返回该路径
 */
function findPath(target, id) {
  var objStack = [];
  if (!target || !target.length) return ;
  // 下面这个方法，如果数组是简单数组，则设置result不会影响target，但如果target是个复杂值，其中含有对象，则设置result仍然会影响target
  var targetStr = JSON.stringify(target);
  var result = JSON.parse(targetStr); // 防止参数修改
  for (var i = 0, len = result.length; i < len; i++) {
    var obj = result[i];
    obj.pathStack = [i];
    objStack.push(obj);
    if (obj.id && obj.id == id) {
      return obj.pathStack;
    } else if (obj.routes) {
      obj.pathStack.push('routes');
    }
  }

  var item;
  while (objStack.length) {
    item = objStack.shift();
    if (item.routes && item.routes.length) {
      var cLen = item.routes.length;
      for (var j = cLen - 1; j >= 0; j--) {
        var cObj = item.routes[j];
        cObj.pathStack = item.pathStack.concat([j]);
        if (cObj.id && cObj.id == id) {
          // 找到id指示对象，返回其路径
          return cObj.pathStack;
        } else if (cObj.routes) {
          cObj.pathStack.push('routes');
        }
        objStack.unshift(cObj);
      }
    }
  }

  return [];
}

function getIn(target, path) {
  if (typeof target != 'object') {
    throw new Error("config.js -> getIn: The first argument must be an object or array");
  }
  if (Object.prototype.toString.call(path) != "[object Array]") {
    throw new Error("config.js -> getIn: The second argument must be an array");
  }
  if (path.length == 0) return undefined;
  var result = target, i = 0;
  var len = path.length;
  while (i < len && result) {
    result = result[path[i++]];
  }
  return result;
}

function setIn(target, path, value) {
  var result = [].concat(target);
  var pathStackStr = JSON.stringify(path);
  var pathStack = JSON.parse(pathStackStr);
  if (typeof target != 'object') {
    throw new Error("config.js -> setIn: The first argument must be an object or array");
  }
  if (Object.prototype.toString.call(path) != "[object Array]") {
    throw new Error("config.js -> setIn: The second argument must be an array");
  }
  if (path.length == 0) {
    warning(false, 'config.js -> setIn: Can not find the object refered by path, return target without change');
    return result;
  }
  var obj = result;
  while (pathStack.length > 1) {
    var step = pathStack.shift();
    obj = obj[step];
    if (typeof obj == 'undefined') {
      warning(false, 'config.js -> setIn: Can not find the object refered by path, return target without change');
      return result;
    }
  }
  // 因为被设置的值有可能是一个属性，而不是对象或数组，为了取得引用而不是简单的值，所以保留了一步，确保取得的是引用。
  obj[pathStack[0]] = value;

  return result;
}

// path指示的对象必须是object，不能是数组或普通变量，否则报错
function mergeIn(target, path, mergeObj) {
  // 合并一个有path指示的对象到target
  var result = [].concat(target);
  if (Object.prototype.toString.call(path) != "[object Array]") {
    throw new Error("config --> mergeIn: Argument path must be array");
  } else if (path.length == 0) {
    warning(false, "config --> mergeIn: Can not find the object refered by path, return target without change");
    return result;
  }
  if (Object.prototype.toString.call(mergeObj) != "[object Object]") {
    throw new Error("config --> mergeIn: mergeIn can not be used to merge array or variable but only object.");
  }

  var pathStackStr = JSON.stringify(path);
  var pathStack = JSON.parse(pathStackStr);
  var obj = result;
  while(pathStack.length > 1) {
    var step = pathStack.shift();
    obj = obj[step];
    if (typeof obj == 'undefined') {
      warning(false, 'config.js -> mergeIn: Can not find the object refered by path, return target without change');
      return result;
    }
  }
  if (Object.prototype.toString.call(obj[pathStack[0]]) != "[object Object]") {
    throw new Error("config --> mergeIn: item refered by path has to be an object.")
  }
  var value = Object.assign({}, obj[pathStack[0]], mergeObj);
  obj[pathStack[0]] = value;

  return result;
}


// 删除之后，可能留下一个空的routes数组，需不需要特殊处理？
function deleteIn(target, path) {
  // 删除path指示的对象
  var result = [].concat(target);
  if (Object.prototype.toString.call(path) != "[object Array]") {
    throw new Error("config.js -> deleteIn: The second argument must be array");
  } else if (path.length == 0) {
    warning(false, 'config.js -> deleteIn: Can not find the object refered by path, return target without change');
    return result;
  }
  var parentPath = path.slice(0, -1);
  var finalPath = path[path.length - 1];
  var parent = getIn(result, parentPath);
  if (parentPath.length == 0) parent = result; // 特殊情况，
  if (Object.prototype.toString.call(parent) == "[object Array]") {
    var r1 = parent.slice(0, finalPath);
    var r2 = parent.slice(finalPath + 1);
    parent = r1.concat(r2);
  }
  if (Object.prototype.toString.call(parent) == "[object Object]") {
    delete parent[finalPath];
  }
  // 设置的是target数组的元素，其父级元素就是target，直接返回
  if (parentPath.length == 0) return parent;

  return setIn(result, parentPath, parent);
}

function append(target, path, routeObj) {
  // 按照所给路径添加一个routes对象
  var result = [].concat(target);
  var pathStackStr = JSON.stringify(path);
  var pathStack = JSON.parse(pathStackStr);
  if (Object.prototype.toString.call(path) != "[object Array]") {
    throw new Error("config.js -> append: The second argument must be array");
  } else if (path.length == 0) {
    warning(false, 'config.js -> append: Can not find the object refered by path, return target without change');
    return result;
  }

  var obj = result;
  while(pathStack.length > 0) {
    var step = pathStack.shift();
    obj = obj[step];
    if (typeof obj == 'undefined') {
      warning(false, 'config.js -> mergeIn: Can not find the object refered by path, return target without change');
      return result;
    }
  }
  if (Object.prototype.toString.call(obj) != "[object Array]") {
    warning(false, 'config.js -> append: item refered by path has to be an array, return target without change');
    return target;
  }
  // 只有数组才能添加，所以obj最后必然是引用，无需保留最后一步
  obj.push(routeObj);

  return result;
}

function addBefore(target, posId, routeObj) {
  // 在posId指示的对象前，添加一个路由Object
  var result = [].concat(target);
  var idRoute = findPath(result, posId);
  if (idRoute.length == 0) {
    warning(false, 'config.js -> addBefore: Can not find the object refered by path, return target without change');
    return target;
  }

  // 拿到posId所在的数组
  var arrRoute = idRoute.slice(0, -1);
  var addPos = idRoute[idRoute.length - 1];
  var childRoutes = getIn(result, arrRoute);
  var len = childRoutes.length - 1;
  // 数组元素依次往后挪动一位
  while(len >= addPos) {
    childRoutes[len + 1] = childRoutes[len];
    len--;
  }
  childRoutes[addPos] = routeObj;
  return setIn(result, arrRoute, childRoutes);
}


// 合并一组由id指示的对象到target
function merge(target, objArr) {
  if (Object.prototype.toString.call(target) != "[object Array]") {
    throw new Error("config.js -> merge: The first argument must be array");
  }
  if (Object.prototype.toString.call(objArr) != "[object Array]") {
    throw new Error("config.js -> merge: The second argument must be array");
  }

  var result = [].concat(target);
  objArr.forEach(function(item) {
    var id = item.id;
    if (typeof id == 'undefined') {
      warning(false, 'config.js -> merge: Object to be merged must contain an attribute named id. Object without id was ingnored!')
    } else {
      var path = findPath(result, id);
      result = mergeIn(result, path, item);
    }
  });
  return result;
}

// 删除target一组由id指示的对象
function deleteByIdArr(target, idArr) {
  var result = [].concat(target);
  if (Object.prototype.toString.call(idArr) != "[object Array]") {
    throw new Error("config.js -> deleteByIdArr: The second argument must be array");
  }
  idArr.forEach(function(id) {
    var path = findPath(result, id);
    result = deleteIn(result, path);
  });

  return result;
}

// merge funConfig to routes
function merge_funConfig_to_routes(routes, funConfig) {
  var mergeArr = [];
  for (var prop in funConfig) {
    var mergeItem = {
      id: prop,
      funConfig: funConfig[prop],
    }
    mergeArr.push(mergeItem);
  }
  routes = merge(routes, mergeArr);
  return routes;
}

config = {
  findPath: findPath,
  getIn: getIn,
  setIn: setIn,
  mergeIn: mergeIn,
  merge: merge,
  delete: deleteByIdArr,
  append: append,
  addBefore: addBefore,
  deleteIn: deleteIn,
  merge_funConfig_to_routes: merge_funConfig_to_routes,
};

// exports
if (typeof module === "object" && typeof module.exports === "object" ) {
  module.exports = config;
}
