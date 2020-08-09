"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var events_1 = require("events");
var path_1 = require("path");
var scanf_1 = require("scanf");
var Split = require("split");
var Textractor = /** @class */ (function (_super) {
    __extends(Textractor, _super);
    /**
     * Textractor wrapper for Node.js
     *
     * @param path Path to TextractorCLI.exe
     */
    function Textractor(path) {
        var _this = _super.call(this) || this;
        _this.path = path_1.resolve(__dirname, "..", path);
        _this.splitStream = Split();
        _this.splitStream.on("data", function (line) {
            _this.onData(line);
        });
        _this.attachedPids = [];
        _this.textOutputObject = {
            handle: -1,
            pid: -1,
            addr: -1,
            ctx: -1,
            ctx2: -1,
            name: "",
            code: "",
            text: ""
        };
        return _this;
    }
    /**
     * Start Textractor process.
     */
    Textractor.prototype.start = function () {
        if (this.process)
            return;
        this.process = child_process_1.spawn(this.path, {
            stdio: ["pipe", "pipe", "ignore"]
        });
        this.process.stdout.setEncoding("utf16le");
        this.process.stdout.pipe(this.splitStream);
        this.process.on("error", function (code) {
            console.log("error: " + code);
        });
    };
    /**
     * Attach text hooker to a specific process.
     *
     * @param pid Process ID
     *
     * @throws _RangeError_ if pid is invalid
     * @throws _ReferenceError_ if Textractor process is not started
     */
    Textractor.prototype.attach = function (pid) {
        if (!this.process)
            throw new ReferenceError("Textractor not started");
        this.ensurePidValid(pid);
        if (this.attachedPids.indexOf(pid) !== -1)
            return;
        this.exec("attach -P" + pid);
        this.attachedPids.push(pid);
    };
    /**
     * Detach text hooker to a specific process.
     *
     * @param pid Process ID
     *
     * @throws _ReferenceError_ if the process has not been attached
     */
    Textractor.prototype.detach = function (pid) {
        this.ensureProcessAttached(pid);
        this.exec("detach -P" + pid);
    };
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
    Textractor.prototype.hook = function (pid, code) {
        if (!this.process)
            throw new ReferenceError("Textractor not started");
        this.ensureProcessAttached(pid);
        if (code.indexOf("/H") === -1 && code.indexOf("/R") === -1)
            throw new SyntaxError("invalid code");
        this.exec(code + " -P" + pid);
    };
    /**
     * Execute a command manually.
     *
     * @param command The command to execute
     *
     * @throws _ReferenceError_ if Textractor process is not started
     */
    Textractor.prototype.exec = function (command) {
        if (!this.process)
            throw new ReferenceError("Textractor not started");
        this.process.stdin.write(Buffer.from(command + "\n", "utf16le"));
    };
    /**
     * Stop Textractor process.
     */
    Textractor.prototype.stop = function () {
        if (!this.process)
            return;
        this.process.kill();
        delete this.process;
    };
    Textractor.prototype.ensurePidValid = function (pid) {
        if (pid < 0 || pid > 65535)
            throw new RangeError("invalid process ID");
    };
    Textractor.prototype.ensureProcessAttached = function (pid) {
        if (this.attachedPids.indexOf(pid) === -1)
            throw new ReferenceError("process has not been attached");
    };
    Textractor.prototype.onData = function (line) {
        if (line.indexOf("Usage") === 0)
            return;
        // Handle multiple lines
        // Use regex to match the overhead
        var regexp = /^\[([0-9A-Fa-f]*):([0-9A-Fa-f]*):([0-9A-Fa-f]*):([0-9A-Fa-f]*):([0-9A-Fa-f]*):(.*)\]/g;
        var overhead = regexp.exec(line);
        if (overhead !== null) {
            this.textOutputObject = (scanf_1.sscanf(overhead[0], "[%x:%x:%x:%x:%x:%s:%s]", "handle", "pid", "addr", "ctx", "ctx2", "name", "code"));
            this.textOutputObject.text = line.substring(regexp.lastIndex).trim();
            // In case of hook code doesn't exist
            if (this.textOutputObject.name.lastIndexOf(']') === this.textOutputObject.name.length - 1) {
                this.textOutputObject.name =
                    this.textOutputObject.name.substring(0, this.textOutputObject.name.length - 1);
                this.textOutputObject.code = "";
            }
        }
        else {
            var text = scanf_1.sscanf(line, "%S");
            this.textOutputObject.text += text;
        }
        if (this.textOutputObject.text === null) {
            this.textOutputObject.text = "";
        }
        this.emit("output", this.textOutputObject);
    };
    return Textractor;
}(events_1.EventEmitter));
exports.Textractor = Textractor;
