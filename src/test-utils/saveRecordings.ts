import fs from "fs";
import { resolve as resolvePath } from "path";
import nock from "nock";

export async function saveRecordings(dirName: string, tapeName: string) {
  await fs.promises.mkdir(resolvePath(dirName, "__tapes__"));
  await fs.promises.writeFile(
    resolvePath(dirName, "__tapes__", `${tapeName}.json`),
    JSON.stringify(nock.recorder.play())
  );
}
