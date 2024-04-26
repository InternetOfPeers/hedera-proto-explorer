var protobuf = require("protobufjs");
var fs = require("fs");

protobuf.load("hedera/record_stream_file.proto", function (err, root) {
  if (err) throw err;

  let recordStreamFileMessage = root.lookupType("proto.RecordStreamFile");
  let buffer = fs.readFileSync("records/2023-10-31T00_30_20.005260923Z.rcd");

  let verification = recordStreamFileMessage.verify(buffer);
  //console.log(verification == null ? "Verification OK" : "Verification KO");

  let record = recordStreamFileMessage.decode(buffer);

  let recordJSON = record.toJSON();

  console.log(recordJSON.recordStreamItems);

  let tx = recordJSON.recordStreamItems.find(
    (el) =>
      el.record.transactionHash ===
      "O+ABIeEnVa1ALDvBQlDpHdf8oOEoroKNBS2CullgCBiDteGt0blxHDCsmg0bWu1P"
  );

  buffer = base64ToArrayBuffer(tx.transaction.signedTransactionBytes);

  let transactionMessage = root.lookupType("proto.Transaction");
  verification = transactionMessage.verify(buffer);
  //console.log(verification == null ? "Verification OK" : "Verification KO");

  //console.log();

  let transaction = transactionMessage.decode(Buffer.from(buffer));

  let transactionJSON = transaction.toJSON();

  console.log(JSON.stringify(transactionJSON.body.cryptoTransfer));

  //  fs.writeFileSync("./converted.json", buffer);

  /*
  let txString = JSON.stringify(tx);
  console.log(txString);

  fs.writeFileSync("./converted.json", txString);

  */
  //console.log(recordJSON.recordStreamItems);
});

function base64ToArrayBuffer(base64) {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
