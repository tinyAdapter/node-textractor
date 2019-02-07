import { spawn, ChildProcess } from "child_process";
import { EventEmitter } from "events";
import { resolve } from "path";
import { sscanf } from "scanf";
const Split = require("split");

export interface TextOutputObject {
  /** hook index */
  handle: number;
  /** process ID */
  pid: number;
  /** hook address */
  addr: number;
  /** hook context */
  ctx: number;
  /** hook context 2 */
  ctx2: number;
  /** hook name */
  name: string;
  /** output text */
  text: string;
}

export interface Textractor {
  /**
   * Specify callback function when text outputs.

   * @param event Must be "output"
   * @param listener The callback function
   */
  on(event: "output", listener: (output: TextOutputObject) => void): this;
  on(event: string, listener: Function): this;
}

export class Textractor extends EventEmitter {
  private splitStream: NodeJS.ReadWriteStream;
  private path: string;
  private process: ChildProcess | undefined;
  private attachedPids: number[];

  /**
   * Textractor wrapper for Node.js
   *
   * @param path Path to TextractorCLI.exe
   */
  constructor(path: string) {
    super();
    this.path = resolve(__dirname, path);
    this.splitStream = Split();
    this.splitStream.on("data", line => {
      this.onData(line);
    });
    this.attachedPids = [];
  }

  /**
   * Start Textractor process.
   */
  start() {
    if (this.process) return;

    this.process = spawn(this.path, {
      stdio: ["pipe", "pipe", "ignore"]
    });
    this.process.stdout.setEncoding("utf16le");
    this.process.stdout.pipe(this.splitStream);
    this.process.on("error", code => {
      console.log(`error: ${code}`);
    });
  }

  /**
   * Attach text hooker to a specific process.
   *
   * @param pid Process ID
   *
   * @throws _RangeError_ if pid is invalid
   * @throws _ReferenceError_ if Textractor process is not started
   */
  attach(pid: number) {
    if (!this.process) throw new ReferenceError("Textractor not started");
    this.ensurePidValid(pid);
    if (this.attachedPids.indexOf(pid) !== -1) return;

    this.exec("attach -P" + pid);
    this.attachedPids.push(pid);
  }

  /**
   * Detach text hooker to a specific process.
   *
   * @param pid Process ID
   *
   * @throws _ReferenceError_ if the process has not been attached
   */
  detach(pid: number) {
    this.ensureProcessAttached(pid);

    this.exec(`attach -P${pid}`);
  }

  /**
   * Inject a hook into a specific process.
   * Supports __/H__ hook code and __/R__ read code.
   *
   * @param pid Process ID
   * @param code __/H__ hook code or __/R__ read code
   *
   * @throws _ReferenceError_ if Textractor process is not started
   * @throws _ReferenceError_ if the process has not been attached
   * @throws _SyntaxError_ if code is invalid
   */
  hook(pid: number, code: string) {
    if (!this.process) throw new ReferenceError("Textractor not started");
    this.ensureProcessAttached(pid);
    if (code.indexOf("/H") === -1 && code.indexOf("/R") === -1)
      throw new SyntaxError("invalid code");

    this.exec(`${code} -P${pid}`);
  }

  /**
   * Execute a command manually.
   *
   * @param command The command to execute
   *
   * @throws _ReferenceError_ if Textractor process is not started
   */
  exec(command: string) {
    if (!this.process) throw new ReferenceError("Textractor not started");

    this.process.stdin.write(Buffer.from(`${command}\n`, "utf16le"));
  }

  /**
   * Stop Textractor process.
   */
  stop() {
    if (!this.process) return;

    this.process.kill();
    delete this.process;
  }

  private ensurePidValid(pid: number) {
    if (pid < 0 || pid > 65535) throw new RangeError("invalid process ID");
  }

  private ensureProcessAttached(pid: number) {
    if (this.attachedPids.indexOf(pid) === -1)
      throw new ReferenceError("process has not been attached");
  }

  private onData(line: string) {
    if (line.indexOf("[") !== 0) return;
    let parsedObject = <TextOutputObject>(
      sscanf(
        line,
        "[%x:%x:%x:%x:%x:%s] %S",
        "handle",
        "pid",
        "addr",
        "ctx",
        "ctx2",
        "name",
        "text"
      )
    );
    this.emit("output", parsedObject);
  }
}
