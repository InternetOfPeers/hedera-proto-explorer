var protobuf = require("protobufjs");
var fs = require("fs");
const { base64ToHex, base64ToArrayBuffer, setupDebugLogging } = require("./utils/common");

const DEBUG_MODE = process.env.DEBUG === "true" || false;

// Set up debug logging with the DEBUG_MODE flag
setupDebugLogging(DEBUG_MODE);

protobuf.load("hedera-protobufs-static/streams/record_stream_file.proto", function (err, root) {
  if (err) throw err;
  //console.debug("record", argv("record"))
  //console.debug("txhash", argv("txhash"))
  let recordStreamFileMessage = root.lookupType("proto.RecordStreamFile");
  let buffer = fs.readFileSync(argv("record")); // example "./record/2024-04-25T21_17_08.000248496Z.rcd"
  let verification = recordStreamFileMessage.verify(buffer);
  //console.debug(verification == null ? "Verification OK" : "Verification KO");
  let record = recordStreamFileMessage.decode(buffer);
  let recordJSON = record.toJSON();
  // console.debug("=== Record file ===");
  // console.deepLog(recordJSON);
  // console.debug(
  //   Object.entries(recordJSON).filter((el) => el[0] !== "recordStreamItems")
  // );
  // console.debug("");

  //console.log(`>>> Searching for ${argv("txhash")}`);
  let tx = recordJSON.recordStreamItems.find((el) => {
    //console.debug(el.record.transactionHash);
    return el.record.transactionHash === argv("txhash"); // base64, not the hex format. i.e. ATGcMV0XrYmiI1ZpGmZ5l5IW4wC5XDB1jO5m9qlAmmXyW3ulLW7w5ZPZtsY5XwF+
  });

  if (tx != undefined) {
    let txHash = tx.record.transactionHash;
    let txHashHex = base64ToHex(txHash);
    let txNonce = tx.record.transactionID.nonce ? tx.record.transactionID.nonce : 0;

    console.log(`=== Transaction #${txNonce} ${txHash} ${txHashHex} ===`);
    console.deepLog(tx);
    console.log("");

    let transactionJSON = tx.transaction;

    if (tx.transaction.signedTransactionBytes) {
      // New format
      buffer = Buffer.from(base64ToArrayBuffer(tx.transaction.signedTransactionBytes));
      let transactionMessage = root.lookupType("proto.SignedTransaction");
      verification = transactionMessage.verify(buffer);
      //console.debug("=== Transaction verification", verification == null ? "OK" : "KO", "===")
      let transaction = transactionMessage.decode(buffer);
      transactionJSON = transaction.toJSON();
      //console.debug("transaction.signedTransactionBytes (decoded):")
      //console.deepLog(transactionJSON)
      //console.debug("")
    }

    //============================== Find the transaction's signatures
    console.log(`=== Signatures #${txNonce} ${txHash} ${txHashHex} ===`);
    if (transactionJSON.sigMap) {
      transactionJSON.sigMap.sigPair.forEach((signature) => {
        if (signature.pubKeyPrefix) signature.pubKeyPrefixHex = base64ToHex(signature.pubKeyPrefix);
        console.log(signature);
      });
    }
    console.log("");

    //============================== Find the transaction's body
    let transactionBodyProtoBuffer = Buffer.from(base64ToArrayBuffer(transactionJSON.bodyBytes));
    let transactionBody = root.lookupType("proto.TransactionBody");
    verification = transactionBody.verify(buffer);
    //console.debug("=== Body verification", verification == null ? "OK" : "KO", "===");

    console.log(`=== Body #${txNonce} ${txHash} ${txHashHex} ===`);
    let body = transactionBody.decode(transactionBodyProtoBuffer);
    let bodyJSON = body.toJSON();
    console.deepLog(bodyJSON);
    console.log("");

    //============================== Custom data based on transaction type
    if (bodyJSON.consensusSubmitMessage) {
      console.log("=== Message payload decoded from base64 ===");
      console.log(atob(bodyJSON.consensusSubmitMessage.message));
      console.log("");
    }
  } else {
    console.log("=== Transaction", argv("txhash"), "NOT FOUND!!!");
    console.log("");
    console.log("If it is a scheduled transaction it is probably in another record file.");
    console.log("");
  }
});

const argv = (key) => {
  if (process.argv.includes(`--${key}`)) return true; // Return true if the key exists and a value is undefined
  const value = process.argv.find((element) => element.startsWith(`--${key}=`));
  if (!value) return null; // Return null if the key does not exist and a value is undefined
  return value.replace(`--${key}=`, "");
};
