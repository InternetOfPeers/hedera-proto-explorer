var protobuf = require("protobufjs");
var fs = require("fs");

protobuf.load(
  [
    "hedera-protobufs-static/services/basic_types.proto",
    "hedera-protobufs-static/services/exchange_rate.proto",
  ],
  function (err, root) {
    if (err) throw err;
    //console.debug("record", argv("record"))
    //console.debug("txhash", argv("txhash"))
    let recordStreamFileMessage = root.lookupType(
      "proto.CurrentAndNextFeeSchedule"
    );
    let buffer = fs.readFileSync("./temp/mainnet-fee-schedule.bin"); // example "./record/2024-04-25T21_17_08.000248496Z.rcd"
    let record = recordStreamFileMessage.decode(buffer);
    let recordJSON = record.toJSON();
    //console.debug("=== Record file ===");
    //console.deepLog(recordJSON);

    recordStreamFileMessage = root.lookupType("proto.ExchangeRateSet");
    buffer = fs.readFileSync("./temp/testnet-exchange-rates.bin"); // example "./record/2024-04-25T21_17_08.000248496Z.rcd"
    record = recordStreamFileMessage.decode(buffer);
    recordJSON = record.toJSON();
    console.deepLog(recordJSON);

    recordStreamFileMessage = root.lookupType("proto.ExchangeRateSet");
    buffer = fs.readFileSync("./temp/mainnet-exchange-rates.bin"); // example "./record/2024-04-25T21_17_08.000248496Z.rcd"
    record = recordStreamFileMessage.decode(buffer);
    recordJSON = record.toJSON();
    console.deepLog(recordJSON);
  }
);

function base64ToArrayBuffer(base64) {
  //console.debug("base64", base64);
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function base64ToHex(base64) {
  arrayBuffer = base64ToArrayBuffer(base64);
  buffer = Buffer.from(arrayBuffer);
  return Buffer.from(
    buffer.buffer,
    buffer.byteOffset,
    buffer.byteLength
  ).toString("hex");
}

console.deepLog = (...args) =>
  args.forEach((obj) =>
    console.log(require("util").inspect(obj, false, null, true))
  );

const argv = (key) => {
  if (process.argv.includes(`--${key}`)) return true; // Return true if the key exists and a value is undefined
  const value = process.argv.find((element) => element.startsWith(`--${key}=`));
  if (!value) return null; // Return null if the key does not exist and a value is undefined
  return value.replace(`--${key}=`, "");
};
