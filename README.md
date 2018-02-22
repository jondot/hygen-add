# hygen-add

`hygen-add` is one of the tools in the [Hygen](http://www.hygen.io) toolbelt which allows you to add pre-made generator packages to your project.

## Quick Start

Install:

```
$ yarn add --dev hygen-add
```

And add a package:

```
$ hygen-add test-package
```

## What's Defines a Package?

A package can be a Git repository, path (location), or a node module. In all cases, a package needs:

* To have a `package.json` file that is installable by Yarn.
* To have a `_templates` folder where your generators will be.

## Naming Your Package

Since there are two options to use (Git and `npm`), using Git you can end up with a repository that's named one thing, and the package in it is named another thing.

Here's how to treat all cases.

### As a Node Module

If you decide to push your package as a proper node module, then you must prefix its name as `hygen-YOURNAME`, and installing it will be:

```
$ hygen-add YOURNAME
```

We use the `hygen-` prefix to avoid trashing the node module ecosystem, and to allow for easy search. Meaning, you can search for `hygen-` to get a listing of all packages on a node module registry.

### As a Git Repo

If you decide to publish as a Git repo, you can use `hygen-add` like this:

```
$ hygen-add https://github.com/jondot/foo-bar
```

A name of a package, even if it's on a Git repo and was never pushed to `npm`, is still the same name that is specified in your `package.json` file.

With that in mind any repo works and there's no special naming rules for the repo itself. In this case the default name for the package will be `foo-bar` and taken directly from the Git repo address.

If you have a different name within the actual package in the repo, you can override the default and specify a name:

```
$ hygen-add https://github.com/jondot/not-a-name --name best-generator
```

# Contributing

Fork, implement, add tests, pull request, get my everlasting thanks and a respectable place here :).

### Thanks:

To all [Contributors](https://github.com/jondot/hygen-add/graphs/contributors) - you make this happen, thanks!

# Copyright

Copyright (c) 2018 [Dotan Nahum](http://gplus.to/dotan) [@jondot](http://twitter.com/jondot). See [LICENSE](LICENSE.txt) for further details.
