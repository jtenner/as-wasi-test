const fs = require("fs");
const loader = require("@assemblyscript/loader");
const WASI = require("wasi").WASI;

const wasi = new WASI({
  args: process.argv,
  env: process.env,
  preopens: {
    "/example": "./example",
  },
});

loader.instantiate(fs.readFileSync(__dirname + "/build/untouched.wasm"), {
  wasi_snapshot_preview1: wasi.wasiImport,
}).then((result) => {
  wasi.start(result.instance);
  // exports._start();
});
