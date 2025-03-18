var protobuf = require("protobufjs");
const axios = require("axios");
const { base64ToHex, base64ToArrayBuffer, setupDebugLogging } = require("./utils/common");

const DEBUG_MODE = process.env.DEBUG === "true" || false;

// Set up debug logging with the DEBUG_MODE flag
setupDebugLogging(DEBUG_MODE);

// Check if transaction ID is provided
if (process.argv.length < 3) {
  console.error("Please provide a transaction ID.");
  console.error("Usage: node proto-decode-transaction-by-mirror-node.js <transactionId>");
  console.error("Example: node proto-decode-transaction-by-mirror-node 0.0.3229-1742253499-010000000");
  process.exit(1);
}

// Get transaction ID from command line arguments
let transactionId = process.argv[2];

// Convert transaction ID from @ notation to hyphen notation
if (transactionId.includes("@")) {
  const [accountId, timestamp] = transactionId.split("@");
  transactionId = `${accountId}-${timestamp.replace(".", "-")}`;
  console.debug(`Converted transaction ID: ${transactionId}`);
}

// Default to mainnet, unless testnet is specified
const useTestnet = process.argv[3] === "testnet" ? true : false;

/**
 * Main function to process a transaction ID
 * @param {string} transactionId - The transaction ID to process
 * @param {boolean} useTestnet - Whether to use testnet (true) or mainnet (false)
 */
async function processTransaction(transactionId, useTestnet) {
  try {
    console.log(`Processing transaction: ${transactionId}`);
    console.log(`Using ${useTestnet ? "testnet" : "mainnet"} mirror node`);

    // Fetch state proof
    const stateProof = await fetchStateProof(
      transactionId,
      useTestnet ? "https://testnet.mirrornode.hedera.com" : "https://mainnet.mirrornode.hedera.com"
    );
    console.debug("State proof fetched successfully");

    // Extract the buffers
    const result = extractBuffers(stateProof, transactionId);

    // Decode the protobuf buffers and print the information
    decodeProtobufAndPrintData(result.transactionBuffer, result.recordBuffer);
  } catch (error) {
    console.error(`Failed to process transaction: ${error.message}`);
    process.exit(2);
  }
}

/**
 * Fetches the state proof for a given transaction ID
 * @param {string} transactionId - The transaction ID in format 0.0.xxxx-timestamp-yyyyy
 * @param {string} mirrorNodeUrl - URL of the mirror node API
 * @returns {Promise<Object>} The state proof data
 * @throws {Error} If fetching the state proof fails
 */
async function fetchStateProof(transactionId, mirrorNodeUrl) {
  try {
    const response = await axios.get(mirrorNodeUrl + `/api/v1/transactions/${transactionId}/stateproof`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching state proof: ${error.message}`);
    if (error.response) {
      console.error(`Status code: ${error.response.status}`);
      console.error(`Response data:`, error.response.data);
    }
    throw error;
  }
}

/**
 * Extracts record and transaction buffers from a state proof object.
 *
 * This function parses the base64-encoded record stream object found in the state proof,
 * validates its header, and extracts the record and transaction buffers contained within.
 *
 * @param {Object} stateProof - The state proof object containing the record file
 * @param {Object} stateProof.record_file - The record file object
 * @param {string} stateProof.record_file.record_stream_object - Base64-encoded record stream object
 *
 * @returns {Object} An object containing the extracted buffers
 * @returns {Buffer} returns.recordBuffer - The extracted record buffer
 * @returns {Buffer} returns.transactionBuffer - The extracted transaction buffer
 *
 * @throws {Error} If the record stream object header is invalid
 * @throws {Error} If any extraction process fails
 */
function extractBuffers(stateProof) {
  const RECORD_STREAM_OBJECT_HEAD = Buffer.from([
    0xe3, 0x70, 0x92, 0x9b, 0xa5, 0x42, 0x9d, 0x8b, 0x00, 0x00, 0x00, 0x01,
  ]);
  try {
    // Extract the record_stream_object
    const recordStreamObjectBase64 = stateProof.record_file.record_stream_object;
    const recordStreamObject = Buffer.from(recordStreamObjectBase64, "base64");

    // Verify the header
    if (!recordStreamObject.subarray(0, RECORD_STREAM_OBJECT_HEAD.length).equals(RECORD_STREAM_OBJECT_HEAD)) {
      throw new Error("Invalid record stream object header");
    }

    // Skip the header
    let offset = RECORD_STREAM_OBJECT_HEAD.length;

    // Read record buffer length (4 bytes)
    const recordBufferLength = recordStreamObject.readUInt32BE(offset);
    offset += 4;

    // Extract record buffer
    const recordBuffer = recordStreamObject.subarray(offset, offset + recordBufferLength);
    offset += recordBufferLength;

    // Read transaction buffer length (4 bytes)
    const transactionBufferLength = recordStreamObject.readUInt32BE(offset);
    offset += 4;

    // Extract transaction buffer
    const transactionBuffer = recordStreamObject.subarray(offset, offset + transactionBufferLength);

    // Return the two buffers
    return {
      recordBuffer,
      transactionBuffer,
    };
  } catch (error) {
    console.error(`Error extracting buffers: ${error.message}`);
    throw error;
  }
}

/**
 * Decodes protobuf transaction and record data and outputs detailed information
 * @param {Buffer} transactionBuffer - Buffer containing the transaction protobuf data
 * @param {Buffer} recordBuffer - Buffer containing the record protobuf data
 */
function decodeProtobufAndPrintData(transactionBuffer, recordBuffer) {
  protobuf.load("hedera-protobufs-static/streams/record_stream_file.proto", function (err, root) {
    if (err) throw err;

    // Find the transaction's record
    let JSONData = root.lookupType("proto.TransactionRecord").decode(recordBuffer).toJSON();
    console.log("=== Record information ===");
    console.deepLog(JSONData);

    // Find the transaction's details
    JSONData = root.lookupType("proto.Transaction").decode(transactionBuffer).toJSON();
    console.log("=== Transaction raw information ===");
    console.deepLog(JSONData);
    console.log("");

    // Check if the transaction uses the latest format
    if (JSONData.signedTransactionBytes) {
      JSONData = root
        .lookupType("proto.SignedTransaction")
        .decode(Buffer.from(base64ToArrayBuffer(JSONData.signedTransactionBytes)))
        .toJSON();
    }

    // Find the transaction's signatures
    console.log(`=== Signatures ===`);
    if (JSONData.sigMap) {
      JSONData.sigMap.sigPair.forEach((signature) => {
        if (signature.pubKeyPrefix) signature.pubKeyPrefixHex = base64ToHex(signature.pubKeyPrefix);
        console.log(signature);
      });
    }
    console.log("");

    // Find the transaction's body
    console.log(`=== Body ===`);
    JSONData = root
      .lookupType("proto.TransactionBody")
      .decode(Buffer.from(base64ToArrayBuffer(JSONData.bodyBytes)))
      .toJSON();
    console.deepLog(JSONData);
    console.log("");

    // Custom data based on transaction type
    if (JSONData.consensusSubmitMessage) {
      console.log("=== Message payload decoded from base64 ===");
      console.log(atob(JSONData.consensusSubmitMessage.message));
      console.log("");
    }
  });
}

// Run the main function
processTransaction(transactionId, useTestnet);
