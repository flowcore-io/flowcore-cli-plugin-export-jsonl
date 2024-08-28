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
# Installation
```bash
$ flowcore plugins install @flowcore/flowcore-cli-plugin-export-jsonl
```

# Usage
<!-- usage -->
```sh-session
$ flowcore export jsonl (--version)
@flowcore/cli-plugin-export-jsonl/0.0.0 darwin-arm64 node-v18.18.0
$ flowcore export jsonl --help 
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`export jsonl`](#export-jsonl)

## `export jsonl`

Export data as jsonl

```
USAGE
  $ flowcore export jsonl STREAM -n <value> [--profile <value>] [-e <value>] [-j] [-l] [-m <value>] [-o http|log|jsonl] [-p] [-c] [-s <value>] [-d] [-f <value>] [--timeBucketSplitLength <value>]


ARGUMENTS
  STREAM  stream url to connect to

FLAGS
  -c, --scan                           Scan the full time range
  -d, --dataOnly                       Only send the event data to the destination
  -e, --end=<value>                    End time to stream to, example: 2024-07-08T12:20:44Z, 1y, 1m, 1w, 1d, 1h, now
  -f, --outputFolder=<value>           [default: ./jsonl_files] Folder to write jsonl files to
  -j, --json                           Output json only
  -l, --[no-]live                      Change to live mode when reaching last time bucket
  -m, --max=<value>                    Maximum number of events to send to the destination
  -n, --tenant=<value>                 (required) Tenant to stream from
  -o, --output=<option>                [default: jsonl] Output format
                                       <options: http|log|jsonl>
  -p, --payload                        Only send the event payload to the destination
  -s, --start=<value>                  Start time bucket to stream from, example: (2024-07-08T12:20:44Z, 1y, 1m, 1w, 1d, 1h, now)
      --profile=<value>                Specify the configuration profile to use
      --timeBucketSplitLength=<value>  [default: 8] Split files by time, number of digits to use in timebucket key

DESCRIPTION
  Stream events from a datacore running on the Flowcore Platform and save the data in jsonl files

EXAMPLES
  $ flowcore export jsonl "https://flowcore.io/<org>/<data core>/<flow type>/<event type>.stream" -s 1m -e 1h --tenant <tenant> --outputFolder ./jsonl_files
```

_See code: [src/commands/export/jsonl.ts](https://github.com/flowcore-io/flowcore-cli-plugin-export-jsonl/blob/main/src/commands/export/jsonl.ts)_

<!-- commandsstop -->
