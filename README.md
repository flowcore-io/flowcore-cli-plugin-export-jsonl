Flowcore CLI Plugin - Export Jsonl
=================

Export data as jsonl files

[![Version](https://img.shields.io/npm/v/@flowcore/flowcore-cli-plugin-export-jsonl)](https://npmjs.org/package/@flowcore/flowcore-cli-plugin-export-jsonl)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Build and Release](https://github.com/@flowcore/flowcore-cli-plugin-export-jsonl/actions/workflows/build.yml/badge.svg)](https://github.com/@flowcore/flowcore-cli-plugin-export-jsonl/actions/workflows/build.yml)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @flowcore/cli-plugin-export-jsonl
$ scenario COMMAND
running command...
$ scenario (--version)
@flowcore/cli-plugin-export-jsonl/0.0.0 darwin-arm64 node-v18.18.0
$ scenario --help [COMMAND]
USAGE
  $ scenario COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`scenario hello PERSON`](#scenario-hello-person)
* [`scenario hello world`](#scenario-hello-world)
* [`scenario help [COMMANDS]`](#scenario-help-commands)
* [`scenario plugins`](#scenario-plugins)
* [`scenario plugins:install PLUGIN...`](#scenario-pluginsinstall-plugin)
* [`scenario plugins:inspect PLUGIN...`](#scenario-pluginsinspect-plugin)
* [`scenario plugins:install PLUGIN...`](#scenario-pluginsinstall-plugin-1)
* [`scenario plugins:link PLUGIN`](#scenario-pluginslink-plugin)
* [`scenario plugins:uninstall PLUGIN...`](#scenario-pluginsuninstall-plugin)
* [`scenario plugins reset`](#scenario-plugins-reset)
* [`scenario plugins:uninstall PLUGIN...`](#scenario-pluginsuninstall-plugin-1)
* [`scenario plugins:uninstall PLUGIN...`](#scenario-pluginsuninstall-plugin-2)
* [`scenario plugins update`](#scenario-plugins-update)

## `scenario hello PERSON`

Say hello

```
USAGE
  $ scenario hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/flowcore/flowcore-cli-plugin-export-jsonl/blob/v0.0.0/src/commands/hello/index.ts)_

## `scenario hello world`

Say hello world

```
USAGE
  $ scenario hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ scenario hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/flowcore/flowcore-cli-plugin-export-jsonl/blob/v0.0.0/src/commands/hello/world.ts)_

## `scenario help [COMMANDS]`

Display help for scenario.

```
USAGE
  $ scenario help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for scenario.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.12/src/commands/help.ts)_

## `scenario plugins`

List installed plugins.

```
USAGE
  $ scenario plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ scenario plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.2/src/commands/plugins/index.ts)_

## `scenario plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ scenario plugins add plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ scenario plugins add

EXAMPLES
  $ scenario plugins add myplugin 

  $ scenario plugins add https://github.com/someuser/someplugin

  $ scenario plugins add someuser/someplugin
```

## `scenario plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ scenario plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ scenario plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.2/src/commands/plugins/inspect.ts)_

## `scenario plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ scenario plugins install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ scenario plugins add

EXAMPLES
  $ scenario plugins install myplugin 

  $ scenario plugins install https://github.com/someuser/someplugin

  $ scenario plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.2/src/commands/plugins/install.ts)_

## `scenario plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ scenario plugins link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ scenario plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.2/src/commands/plugins/link.ts)_

## `scenario plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ scenario plugins remove plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ scenario plugins unlink
  $ scenario plugins remove

EXAMPLES
  $ scenario plugins remove myplugin
```

## `scenario plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ scenario plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.2/src/commands/plugins/reset.ts)_

## `scenario plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ scenario plugins uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ scenario plugins unlink
  $ scenario plugins remove

EXAMPLES
  $ scenario plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.2/src/commands/plugins/uninstall.ts)_

## `scenario plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ scenario plugins unlink plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ scenario plugins unlink
  $ scenario plugins remove

EXAMPLES
  $ scenario plugins unlink myplugin
```

## `scenario plugins update`

Update installed plugins.

```
USAGE
  $ scenario plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.2.2/src/commands/plugins/update.ts)_
<!-- commandsstop -->
