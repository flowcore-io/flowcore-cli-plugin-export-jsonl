import {OutputService, SourceEvent, StreamFlags} from '@flowcore/cli-plugin-core'
import * as fs from 'node:fs'
import * as path from 'node:path'

const counts = new Map<string, number>()

export class JsonlOutputService implements OutputService {
  private currentTimeBuckets: Map<string, string> = new Map<string, string>()

  public getDescription(): string {
    return 'Outputs data as jsonl files'
  }

  public getName(): string {
    return 'jsonl'
  }

  public async process(
    event: SourceEvent,
    streamFlags: {dataOnly: boolean} & {outputFolder: string} & {timeBucketSplitLength: string} & StreamFlags,
  ): Promise<void> {
    const mapKey = event.aggregator + ':' + event.eventType

    const splitLength = Number.parseInt(streamFlags.timeBucketSplitLength, 10)
    const previousTimebucketKey = this.currentTimeBuckets.get(mapKey)?.slice(0, splitLength) || ''
    const timeBucketKey = event.timeBucket.slice(0, splitLength)
    const currentCount = counts.get(mapKey) || 0
    counts.set(mapKey, currentCount + 1)

    if (this.currentTimeBuckets.get(mapKey)?.slice(0, splitLength) !== timeBucketKey) {
      console.debug(
        `New timebucket ${timeBucketKey} previous ${previousTimebucketKey} count ${currentCount} events of type ${mapKey}`,
      )
      this.currentTimeBuckets.set(mapKey, timeBucketKey)
      counts.set(mapKey, 1)
    }

    this.writeEventToJsonl(event, timeBucketKey, streamFlags.outputFolder, streamFlags.dataOnly)
  }

  private async writeEventToJsonl(event: SourceEvent, date: string, folder: string, dataOnly: boolean): Promise<void> {
    const dir = path.resolve(folder)

    const directory = path.join(dir, event.aggregator, event.eventType)
    if (!fs.existsSync(directory)) {
      console.debug(`Creating directory ${directory}`)
      fs.mkdirSync(directory, {recursive: true})
    }

    const filePath = path.join(directory, `${date}.jsonl`)

    if (dataOnly) {
      fs.appendFileSync(filePath, JSON.stringify(event.payload) + '\n')
    } else {
      fs.appendFileSync(filePath, JSON.stringify(event) + '\n')
    }
  }
}
