Titaniumifier [![Build Status](https://travis-ci.org/smclab/titaniumifier.png)](https://travis-ci.org/smclab/titaniumifier)
=============

Build your **Titanium CommonJS Modules** as they should be: as **CommonJS packages**, allowing more than one file.

Developed around [substack][ss]’s [browserify][b], *titaniumifier* is a tool that can be used to build a zip file following Titanium SDK conventions with a `package.json` as its starting point.

At the moment it doesn’t provide a command line tool, and must be used with a building tool. The [Grunt plugin][gt] is already here, and the Gulp one is on the way. ***Feel free to contribute one or ask for it.***

[ss]: https://github.com/substack
[b]: https://github.com/substack/node-browserify
[gt]: https://github.com/smclab/grunt-titaniumifier


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
