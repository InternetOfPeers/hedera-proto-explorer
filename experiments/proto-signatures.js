var protobuf = require("protobufjs");
var fs = require("fs");

protobuf.load("hedera/record_stream_file.proto", function (err, root) {
  if (err) throw err;

  let recordStreamFileMessage = root.lookupType("proto.RecordStreamFile");
  let buffer = fs.readFileSync("records/2024-04-26T01_53_16.002943358Z.rcd");

  let verification = recordStreamFileMessage.verify(buffer);
  //console.log(verification == null ? "Verification OK" : "Verification KO");

  let record = recordStreamFileMessage.decode(buffer);

  let recordJSON = record.toJSON();

  let tx = recordJSON.recordStreamItems.find(
    (el) =>
      el.record.transactionHash ===
      "z/OGvrSBG5XVi2Pgym3jV7C8gwjCbg9tE++AWYnuZKYxWx4EpFSK7EESuOXx5g0g"
  );

  console.log(tx);

  buffer = Buffer.from(
    base64ToArrayBuffer(tx.transaction.signedTransactionBytes)
  );

  fs.writeFileSync("./signedTransactionBytes.bin", buffer);

  let transactionMessage = root.lookupType("proto.SignedTransaction");
  verification = transactionMessage.verify(buffer);
  //console.log(verification == null ? "Verification OK" : "Verification KO");

  //console.log();

  let transaction = transactionMessage.decode(buffer);

  console.log(transaction.sigMap);

  let transactionJSON = transaction.toJSON();

  console.log(transactionJSON.sigMap);

  //console.log(JSON.stringify(transactionJSON.body.cryptoTransfer));

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
