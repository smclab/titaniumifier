
/* jshint asi:true */

// modules are defined as an array
// [ module function, map of requireuires ]
//
// map of requireuires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the requireuire for previous bundles

(function outer (modules, cache, entry) {

  var slice = Array.prototype.slice;

  if (!Function.prototype.bind) {
    Object.defineProperty(Function.prototype, 'bind', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function (ctx) {
        if (typeof this !== "function") {
          // closest thing possible to the ECMAScript 5 internal IsCallable function
          throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var fn = this;
        var args = slice.call(arguments, 1);

        function binded() {
          return fn.apply((this instanceof binded && ctx) ? this : ctx, args.concat(slice.call(arguments)));
        }

        binded.prototype = Object.create(fn.prototype);
        binded.prototype.contructor = binded;

        return binded;
      }
    });
  }

  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require == "function" && require;

  function newRequire(name, jumped){
    if(!cache[name]) {
      if(!modules[name]) {
        // if we cannot find the the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require == "function" && require;
        if (!jumped && currentRequire && currentRequire.length === 2) {
          return currentRequire(name, true);
        }
        else {
          return currentRequire(name);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire && previousRequire.length === 2) {
          return previousRequire(name, true);
        }
        else if (previousRequire) {
          return previousRequire(name);
        }
        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      var m = cache[name] = {exports:{}};
      modules[name][0].call(m.exports, function(x){
        var id = modules[name][1][x];
        return newRequire(id ? id : x);
      },m,m.exports,outer,modules,cache,entry);
    }
    return cache[name].exports;
  }
  for(var i=0;i<entry.length;i++) newRequire(entry[i]);

  // Override the current require with this new one
  return newRequire;
})
