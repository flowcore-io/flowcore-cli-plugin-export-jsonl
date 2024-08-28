import {BaseCommand} from '@flowcore/cli-plugin-config'
import {StreamService} from '@flowcore/cli-plugin-core'
import {Args, Flags} from '@oclif/core'

import {JsonlOutputService} from '../../services/jsonl.service.js'

export const STREAM_ARGS = {
  STREAM: Args.string({description: 'stream url to connect to', required: true}),
}

export const STREAM_FLAGS = {
  end: Flags.string({
    char: 'e',
    description: 'End time to stream to, example: 2024-07-08T12:20:44Z, 1y, 1m, 1w, 1d, 1h, now',
  }),
  json: Flags.boolean({char: 'j', description: 'Output json only'}),
  live: Flags.boolean({
    allowNo: true,
    char: 'l',
    default: true,
    description: 'Change to live mode when reaching last time bucket',
  }),
  max: Flags.integer({char: 'm', default: 0, description: 'Maximum number of events to send to the destination'}),
  output: Flags.string({
    char: 'o',
    default: 'jsonl',
    description: 'Output format',
    options: ['http', 'log', 'jsonl'],
  }),
  payload: Flags.boolean({char: 'p', default: false, description: 'Only send the event payload to the destination'}),
  scan: Flags.boolean({char: 'c', default: false, description: 'Scan the full time range'}),
  start: Flags.string({
    char: 's',
    description: 'Start time bucket to stream from, example: (2024-07-08T12:20:44Z, 1y, 1m, 1w, 1d, 1h, now)',
  }),
}

export default class Jsonl extends BaseCommand<typeof Jsonl> {
  static args = STREAM_ARGS

  static description = 'Stream events from a datacore running on the Flowcore Platform'

  static examples = [
    '<%= config.bin %> <%= command.id %> "https://flowcore.io/<org>/<data core>/<flow type>/<event type>.stream" -s 1m -e 1h --tenant <tenant> --outputFolder ./jsonl_files',
  ]

  static flags = {
    ...STREAM_FLAGS,
    dataOnly: Flags.boolean({char: 'd', default: false, description: 'Only send the event data to the destination'}),
    outputFolder: Flags.string({
      char: 'f',
      default: './jsonl_files',
      description: 'Folder to write jsonl files to',
    }),
    tenant: Flags.string({char: 'n', description: 'Tenant to stream from', required: true}),
    timeBucketSplitLength: Flags.string({
      default: '8',
      description: 'Split files by time, number of digits to use in timebucket key',
      multiple: false,
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Jsonl)

    const jsonlService = new JsonlOutputService()

    const streamService = new StreamService(this.cliConfiguration)

    streamService.registerOutputProcessor(jsonlService)

    await streamService.init(args.STREAM, flags)

    await streamService.startStream()
  }
}
