# node-textractor

Textractor wrapper for Node.js.

[Textractor](https://github.com/Artikash/Textractor) (a.k.a. NextHooker) is an open-source x86/x64 text hooker for Windows/Wine based off of ITHVNR.

## Requirements

- Textractor v4.3.0 and above

## Example

```js
const Textractor = require("textractor").Textractor;

let t = new Textractor("X:/path/to/TextractorCLI.exe");

t.on("output", output => {
  console.log(`[${output.handle}]: ${output.text}`);
});
t.start();
t.attach(PID);
```

## API

### Textractor(path: string)

The constructor.

#### Params

- `path` - Path to TextractorCLI.exe

### start(): void

Start Textractor process.

### attach(pid: number): void

Attach text hooker to a specific process.

#### Params

- `pid` - Process ID

#### Throws

- _RangeError_ if pid is invalid
- _ReferenceError_ if Textractor process is not started

### detach(pid: number): void

Detach text hooker to a specific process.

#### Params

- `pid` - Process ID

#### Throws

- _ReferenceError_ if the process has not been attached

### hook(pid: number, code: string): void

Inject a hook into a specific process.

Supports **/H** hook code and **/R** read code.

#### Params

- `pid` - Process ID

#### Throws

- _ReferenceError_ if Textractor process is not started
- _ReferenceError_ if the process has not been attached
- _SyntaxError_ if code is invalid

### on(event: "output", listener: (output: TextOutputObject) => void): this

Specify callback function when text outputs.

#### Params

- `event` - Must be "output"
- `listener` - The callback function

#### TextOutputObject

```ts
{
  handle: number; // hook index
  pid: number; // process ID
  addr: number; // hook address
  ctx: number; // hook context
  ctx2: number; // hook context 2
  name: string; // hook name
  code: string; // hook code
  text: string; // output text
}
```

### exec(command: string): void

Execute a command manually.

#### Params

- `command` - The command to execute

#### Throws

- _ReferenceError_ if Textractor process is not started

### stop(): void

Stop Textractor process.

## License

MIT
