Titaniumifier [![Build Status](https://travis-ci.org/smclab/titaniumifier.png)](https://travis-ci.org/smclab/titaniumifier)
=============

Build your **Titanium CommonJS Modules** as they should be: as **CommonJS packages**, allowing more than one file.

Developed around [substack][ss]’s [browserify][b], *titaniumifier* is a tool that can be used to build a zip file following Titanium SDK conventions with a `package.json` as its starting point.

At the moment it doesn’t provide a command line tool, and must be used with a building tool. The [Grunt plugin][gt] is already here, and the Gulp one is on the way. ***Feel free to contribute one or ask for it.***

[ss]: https://github.com/substack
[b]: https://github.com/substack/node-browserify
[gt]: https://github.com/smclab/grunt-titaniumifier


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
- unclude it as a dependency of a *titaniumified* package.

This is **not** for using arbitrary `npm` packages with Titanium. The way we build a module out of a package **could** be used to build a complete app too (and we tried, oh if we tried) but it poses few challenges. In particular debugging is very cumbersome. On the other side we could get transparent transpiling for free (you know, coffee-script, traceur, es6 etc.)

Such a project was codenamed `npmifier` but not released. If interested please let us know in the [issues][i].

[i]: https://github.com/smclab/titaniumifier/issues?state=open


Please steal this code (aka *examples*)
---------------------------------------

At the moment, you’ll use `titaniumifier` through its `grunt` plugin, [`grunt-titaniumifier`][grtt].

There are 2 reference packages at the moment:

- [`ti-superagent`][sa] Which wraps @visionmedia’s `superagent`
- [`liferay-connector`][lc] Which is a connector for our Portal Framework of choice, Liferay

[grtt]: https://github.com/smclab/grunt-titaniumifier
[sa]: https://github.com/smclab/ti-superagent
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
