
var config;

function warning(msg) {
  /* eslint-disable no-console */
  if (console && typeof console.error === 'function') {
    console.error('Warning: ', msg);
  }

  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(msg)
  /* eslint-disable no-empty */
  } catch (e) { }
}

/**
 * 通过遍历targetArr数组，找出id所指示的对象路径
 * 遍历过程中，给每个加入堆栈的对象添加一个标识其路径的属性，如果该对象id和目的id相同，则返回该路径
 */

// 由于复制方式的原因，该函数还是修改了参数target
// 导致target中，与推入栈中的对象对应的部分多出一个routeStack对象
// 最根本的解决方法是修改复制的方法
function findRoute(target, id) {
  var objStack = [];
  if (!target || !target.length) return ;
  // 下面这个方法，如果数组是简单数组，则设置result不会影响target，但如果target是个复杂值，其中含有对象，则设置result仍然会影响target
  var result = [].concat(target); // 防止参数修改
  for (var i = 0, len = result.length; i < len; i++) {
    var obj = result[i];
    obj.routeStack = [i];
    objStack.push(obj);
    if (obj.id && obj.id == id) {
      return obj.routeStack;
    } else if (obj.routes) {
      obj.routeStack.push('routes');
    }
  }

  var item;
  while (objStack.length) {
    item = objStack.shift();
    if (item.routes && item.routes.length) {
      var cLen = item.routes.length;
      for (var j = cLen - 1; j >= 0; j--) {
        var cObj = item.routes[j];
        cObj.routeStack = item.routeStack.concat([j]);
        if (cObj.id && cObj.id == id) {
          // 找到id指示对象，返回其路径
          return cObj.routeStack;
        } else if (cObj.routes) {
          cObj.routeStack.push('routes');
        }
        objStack.unshift(cObj);
      }
    }
  }
  console.log('target', target);
  return [];
}

// 这个方法可以更加通用一些，不仅仅针对数组，object对象也可以使用
// 现在的问题是，如何判断传入的参数是否是object对象，而不是普通变量
function getIn(target, route) {
  if (Object.prototype.toString.call(target) != "[object Array]") {
    throw new Error("The first argument of function getIn must be array");
  }
  if (Object.prototype.toString.call(route) != "[object Array]") {
    throw new Error("The second argument of function getIn must be array");
  }
  if (route.length == 0) return null;
  var result = [].concat(target), i = 0;
  var len = route.length;
  while (i < len) {
    result = result[route[i++]]
  }
  return result;
}

// 同上，也可以做的更加通用
function setIn(target, route, value) {
  var result = [].concat(target); // 避免修改参数
  var routeStack = [].concat(route);
  if (Object.prototype.toString.call(target) != "[object Array]") {
    throw new Error("The first argument of function setIn must be array");
  }
  if (Object.prototype.toString.call(route) != "[object Array]") {
    throw new Error("The second argument of function setIn must be array");
  }
  if (route.length == 0) {
    warning('config.js -> setIn: Can not find the object refered by route, return target without change');
    return result;
  }
  var obj = result;
  while (routeStack.length > 1) {
    var step = routeStack.shift();
    obj = obj[step];
    if (typeof obj == 'undefined') {
      warning('config.js -> setIn: Can not find the object refered by route, return target without change');
      return result;
    }
  }
  // 因为被设置的值有可能是一个属性，而不是对象或数组，为了取得引用而不是简单的值，所以保留了一步，确保取得的是引用。
  obj[routeStack[0]] = value;

  return result;
}

// route指示的对象必须是object，不能是数组或普通变量，否则报错
function mergeIn(target, route, mergeObj) {
  // 合并一个有route指示的对象到target
  var result = [].concat(target);
  if (Object.prototype.toString.call(route) != "[object Array]") {
    throw new Error("config --> mergeIn: Argument route must be array");
  } else if (route.length == 0) {
    warning("config --> mergeIn: Can not find the object refered by route, return target without change");
    return result;
  }
  var routeStack = [].concat(route);
  var obj = result;
  while(routeStack.length > 1) {
    var step = routeStack.shift();
    obj = obj[step];
    if (typeof obj == 'undefined') {
      warning('config.js -> mergeIn: Can not find the object refered by route, return target without change');
      return result;
    }
  }
  var value = Object.assign({}, obj[routeStack[0]], mergeObj);
  obj[routeStack[0]] = value;

  return result;
}


// 删除之后，可能留下一个空的routes数组，需不需要特殊处理？
function deleteIn(target, route) {
  // 删除route指示的对象
  var result = [].concat(target);
  if (Object.prototype.toString.call(route) != "[object Array]") {
    throw new Error("config.js -> deleteIn: The second argument must be array");
  } else if (route.length == 0) {
    warning('config.js -> deleteIn: Can not find the object refered by route, return target without change');
    return result;
  }
  return setIn(result, route, undefined);
}

function append(target, route, routeObj) {
  // 按照所给路径添加一个routes对象
  var result = [].concat(target);
  var routeStack = [].concat(route);
  if (Object.prototype.toString.call(route) != "[object Array]") {
    throw new Error("config.js -> append: The second argument must be array");
  } else if (route.length == 0) {
    warning('config.js -> append: Can not find the object refered by route, return target without change');
    return result;
  }

  var obj = result;
  while(routeStack.length > 0) {
    var step = routeStack.shift();
    obj = obj[step];
    if (typeof obj == 'undefined') {
      warning('config.js -> mergeIn: Can not find the object refered by route, return target without change');
      return result;
    }
  }
  // 只有数组才能添加，所以obj最后必然是引用，无需保留最后一步
  obj.push(routeObj);

  return result;
}

function addBefore(target, posId, routeObj) {
  // 在posId指示的对象前，添加一个路由Object
  var result = [].concat(target);
  var idRoute = findRoute(result, posId);
  if (idRoute.length == 0) {
    warning('config.js -> addBefore: Can not find the object refered by route, return target without change');
    return result;
  }

  // 拿到posId所在的数组
  var arrRoute = idRoute.slice(0, -1);
  var addPos = idRoute[idRoute.length - 1];
  var childRoutes = getIn(result, arrRoute);
  var len = childRoutes.length - 1;
  // 数组元素依次往后挪动一位
  while(len > addPos) {
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
      warning('config.js -> merge: Object to be merged must contain an attribute named id. Object without id was ingnored!')
    } else {
      var route = findRoute(result, id);
      result = mergeIn(result, route, item);
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
    var route = findRoute(result, id);
    result = deleteIn(result, route);
  });

  return result;
}


config = {
  findRoute: findRoute,
  getIn: getIn,
  setIn: setIn,
  mergeIn: mergeIn,
  merge: merge,
  delete: deleteByIdArr,
  append: append,
  addBefore: addBefore,
};

// exports
if (typeof module === "object" && typeof module.exports === "object" ) {
  module.exports = config;
}
