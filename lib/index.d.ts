import { EventEmitter } from "events";
interface TextOutputObject {
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
export declare class Textractor extends EventEmitter {
    private splitStream;
    private path;
    private process;
    private attachedPids;
    /**
     * Textractor wrapper for Node.js
     *
     * @param path Path to TextractorCLI.exe
     */
    constructor(path: string);
    /**
     * Start Textractor process.
     */
    start(): void;
    /**
     * Attach text hooker to a specific process.
     *
     * @param pid Process ID
     *
     * @throws _RangeError_ if pid is invalid
     * @throws _ReferenceError_ if Textractor process is not started
     */
    attach(pid: number): void;
    /**
     * Detach text hooker to a specific process.
     *
     * @param pid Process ID
     *
     * @throws _ReferenceError_ if the process has not been attached
     */
    detach(pid: number): void;
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
    hook(pid: number, code: string): void;
    /**
     * Execute a command manually.
     *
     * @param command The command to execute
     *
     * @throws _ReferenceError_ if Textractor process is not started
     */
    exec(command: string): void;
    /**
     * Stop Textractor process.
     */
    stop(): void;
    private ensurePidValid;
    private ensureProcessAttached;
    private onData;
}
export {};
