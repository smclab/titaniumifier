Titaniumifier
=============

<img align="right" width="128" height="128" src="https://cdn.mediacru.sh/7/725SJxukZKkC.svg">

[![Build Status](https://img.shields.io/travis/smclab/titaniumifier.svg?style=flat-square)](https://travis-ci.org/smclab/titaniumifier) [![Gitter](https://img.shields.io/badge/GITTER-Join%20chat%20%E2%86%92-1DCE73.svg?style=flat-square)](https://gitter.im/smclab/titaniumifier?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Build your **Titanium CommonJS Modules** as they should be: as **CommonJS packages**, allowing more than one file.

Developed around [substack][ss]’s [browserify][b], *titaniumifier* is a tool that can be used to build a zip file following Titanium SDK conventions with a `package.json` as its starting point.

[Documentation][wiki]
---------------------

The [Titaniumifier Wiki][wiki] is where you’ll find the most up to date documentation.

Installation and usage
----------------------

If you’re serious with it you can use the [**Grunt plugin**][gt].

If you just want to test it out you can use the `titaniumifier` CLI (good for **quick tests**):

    # install it globally
    $ [sudo] npm install --global titaniumifier

    # move into a node package
    $ cd path/to/project

    # this will build dist/NAME-commonjs.VERSION.zip
    $ titaniumifier --out dist

[wiki]: https://github.com/smclab/titaniumifier/wiki
[ss]: https://github.com/substack
[b]: https://github.com/substack/node-browserify
[gt]: https://github.com/smclab/grunt-titaniumifier
[ti-superagent]: https://github.com/smclab/ti-superagent

- - -


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


What is it **not** for?
-----------------------

Even with `titaniumifier` you still wont be ablo to

- use or depend on ‘complex’ e ‘deeply node-ish’ packages like `socket.io` without work;
- install Node.js packages in your app using `npm install ...`;


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
  - `http`,
  - `net` (with `Titanium.Network.TCPSocket`),
  - `stream` (and make `fs` work with it.)

The shimming process could be a community effort into the development of `ti-http`, `ti-net` etc. Contact us if you’re interested in working on it. In case don’t limit yourself to pure JS, give native development a chance.


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

- A Gulp plugin (here’s a [link to get you started][gp])
- Even more unit-tests (**yes please!**)

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
