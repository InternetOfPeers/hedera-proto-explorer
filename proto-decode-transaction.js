var protobuf = require("protobufjs");
var fs = require("fs");

protobuf.load("hedera/record_stream_file.proto", function (err, root) {
  if (err) throw err;

  let recordStreamFileMessage = root.lookupType("proto.RecordStreamFile");
  let buffer = fs.readFileSync(argv("record")); // example "./record/2024-04-25T21_17_08.000248496Z.rcd"

  let verification = recordStreamFileMessage.verify(buffer);
  //console.log(verification == null ? "Verification OK" : "Verification KO");
  let record = recordStreamFileMessage.decode(buffer);
  let recordJSON = record.toJSON();

  //console.trace(recordJSON.recordStreamItems);
  let tx = recordJSON.recordStreamItems.find(
    (el) => el.record.transactionHash === argv("txhash") // base64, not the hex format. i.e. ATGcMV0XrYmiI1ZpGmZ5l5IW4wC5XDB1jO5m9qlAmmXyW3ulLW7w5ZPZtsY5XwF+
  );

  console.log("=== Transaction ===");
  console.deepLog(tx);
  console.log("");

  buffer = Buffer.from(
    base64ToArrayBuffer(tx.transaction.signedTransactionBytes)
  );

  let transactionMessage = root.lookupType("proto.SignedTransaction");
  verification = transactionMessage.verify(buffer);
  //console.debug("=== Transaction verification", verification == null ? "OK" : "KO", "===");

  let transaction = transactionMessage.decode(buffer);
  let transactionJSON = transaction.toJSON();
  //console.debug("signedTransactionBytes:")
  //console.debug(transactionJSON)
  //console.debug("")

  //============================== Find the transaction's signatures
  console.log("=== Signatures ===");
  //console.debug(transactionJSON.sigMap);
  transactionJSON.sigMap.sigPair.forEach((signature) => {
    signatureArrayBuffer = base64ToArrayBuffer(signature.pubKeyPrefix);
    signatureBuffer = Buffer.from(signatureArrayBuffer);
    pubKeyPrefixHex = Buffer.from(
      signatureBuffer.buffer,
      signatureBuffer.byteOffset,
      signatureBuffer.byteLength
    ).toString("hex");
    signature.pubKeyPrefixHex = pubKeyPrefixHex;
    console.log(signature);
  });
  console.log("");

  //============================== Find the transaction's body
  let transactionBodyProtoBuffer = Buffer.from(
    base64ToArrayBuffer(transactionJSON.bodyBytes)
  );
  let transactionBody = root.lookupType("proto.TransactionBody");
  verification = transactionBody.verify(buffer);
  //console.debug("=== Body verification", verification == null ? "OK" : "KO", "===");

  console.log("=== Body ==");
  let body = transactionBody.decode(transactionBodyProtoBuffer);
  console.deepLog(body);
});

function base64ToArrayBuffer(base64) {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
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
