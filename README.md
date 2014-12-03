Titaniumifier
=============
[![Build Status](https://img.shields.io/travis/smclab/titaniumifier.svg?style=flat)](https://travis-ci.org/smclab/titaniumifier) [![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/smclab/titaniumifier?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Build your **Titanium CommonJS Modules** as they should be: as **CommonJS packages**, allowing more than one file.

Developed around [substack][ss]’s [browserify][b], *titaniumifier* is a tool that can be used to build a zip file following Titanium SDK conventions with a `package.json` as its starting point.

At the moment it doesn’t provide a command line tool, and must be used with a building tool. The [Grunt plugin][gt] is already here, and the Gulp one is on the way. ***Feel free to contribute one or ask for it.***

### [Use it with Grunt][gt], [Example package][ti-superagent]

[ss]: https://github.com/substack
[b]: https://github.com/substack/node-browserify
[gt]: https://github.com/smclab/grunt-titaniumifier
[ti-superagent]: https://github.com/smclab/ti-superagent


What is it for?
---------------

You’ll want to give `titaniumifier` a try if you want to write

- a Titanium CommonJS distributable module
  - more complex than a single file,
  - some `npm` dependencies;
- a package that works on both Node.js and Titanium SDK;
- a wrapper for an existing package existing on `npm`.

Once you’re done writing your package you’ll be able to publish it on `npm` for users to
- use it with Node.js;
- include it as a dependency of a *titaniumified* package.

This is **not** for using arbitrary `npm` packages with Titanium. The way we build a module out of a package **could** be used to build a complete app too (and we tried, oh if we tried) but it poses few challenges. In particular debugging is very cumbersome. On the other side we could get transparent transpiling for free (you know, coffee-script, traceur, es6 etc.)

Such a project was codenamed `npmifier` but not released. If interested please let us know in the [issues][i].

Until we solve those challenges, have a look at [`tipi`][tp] which looks very promising. We are going to contribute to them few changes that will enable full compatibility with titaniumified packages.

[i]: https://github.com/smclab/titaniumifier/issues?state=open
[tp]: https://github.com/dawicorti/tipi


What is it **not** for?
-----------------------

With `titaniumifier`, you will not be able to

- use arbitrary Node.js packages in your app;
- use or depend on ‘complex’ e ‘deeply’ node-ish packages like `socket.io`;
- do something not already offered by the Titanium SDK APIs.

### …but…

- we worked (and still working) on providing a solution to use **every** Node.js package directly in your app;
- we want to have shims that made the differences between Node.js’ environment and Titanium’s as small as possible;
- we want to integrate [gitTio][gittio] to support native modules installation based on explicit dependency or automatic inference of dependency (for example a module for fully async filesystem operations.)

[gittio]: http://gitt.io/cli


TODO
----

- Make the built module easily debuggable from Titanium Studio (this is pretty big;)
- Document and explore transpilation (this is a research mostly related to source maps/debug features;)
- Make titaniumified repositories crawlable from `gitTio`;
- Shim the following globals
  - `Buffer` with `Titanium.Buffer`
  - `TypedArrays`,
  - `set/clearImmediate`,
  - `process.nextTick`;
- Shim the following built-ins
  - `fs`,
  - `http`,
  - `net` (with `Titanium.Network.TCPSocket`),
  - `stream` (and make `fs` work with it.)

The shimming process could be a community effort into the development of `ti-fs`, `ti-net` etc. Contact us if you’re interested in working on it. In case don’t limit yourself to pure JS, give native development a chance.


Compatibility
-------------

### Titanium SDK

The reference packages have been tested extensively from Titanium SDK 3.2 onward. There should be no reson for titaniumified packages to not work on older SDK versions.

Issues with Titanium SDK 3.x will be considered critical. With older versions we’ll try to do our best.

Because it does not mangle your `Resources` folder it is compatible with Alloy and TiShadow (and similars.) Please report any issue you have.

### Node.js (in packages)

Currently Node.js 0.10 environment is shimmed in the packaging process. Once Node.js 0.12 is out there will be some interesting challenge to cope with (generators, WeakMap etc.)

Once that happens we’ll shim whatever is necessary.

### Node.js (build-time)

This code is tested against Node.js 0.10 and 0.11.


Please steal this code (aka *examples*)
---------------------------------------

At the moment, you’ll use `titaniumifier` through its `grunt` plugin, [`grunt-titaniumifier`][grtt].

There are 2 reference packages at the moment:

- [`ti-superagent`][tisa] Which wraps @visionmedia’s `superagent`
- [`liferay-connector`][lc] Which is a connector for our Portal Framework of choice, Liferay

[grtt]: https://github.com/smclab/grunt-titaniumifier
[tisa]: https://github.com/smclab/ti-superagent
[lc]: https://github.com/smclab/liferay-connector


Contributing and whishlist
--------------------------

If you feel like helping, we’ll accept pull requests with great joy.

Here are a few ideas to help this project:

- A stand-alone CLI so there’s no need for Grunt, Gulp etc
- A Gulp plugin (here’s a [link to get you started][gp])
- Even more unit-tests

[gp]: https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/README.md


We love feedback
----------------

**Please**, don’t be afraid in opening new issues, even just for asking some help.


Credits
-------

Humbly made by the spry ladies and gents at SMC.


License
-------

This library, *titaniumifier*, is free software ("Licensed Software"); you can
redistribute it and/or modify it under the terms of the [GNU Lesser General
Public License](http://www.gnu.org/licenses/lgpl-2.1.html) as published by the
Free Software Foundation; either version 2.1 of the License, or (at your
option) any later version.

This library is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; including but not limited to, the implied warranty of MERCHANTABILITY,
NONINFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser General
Public License for more details.

You should have received a copy of the [GNU Lesser General Public
License](http://www.gnu.org/licenses/lgpl-2.1.html) along with this library; if
not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth
Floor, Boston, MA 02110-1301 USA
