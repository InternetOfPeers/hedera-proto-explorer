var protobuf = require("protobufjs");
const axios = require("axios");
const { base64ToHex, base64ToArrayBuffer, setupDebugLogging } = require("./utils/common");

const DEBUG_MODE = process.env.DEBUG === "true" || false;

// Set up debug logging with the DEBUG_MODE flag
setupDebugLogging(DEBUG_MODE);

// Check if transaction ID is provided
if (process.argv.length < 3) {
  console.error("Please provide a schedule ID.");
  console.error("Usage: node proto-decode-schedule-by-mirror-node.js <scheduleID>");
  console.error("Example: node proto-decode-schedule-by-mirror-node 0.0.5757938");
  process.exit(1);
}

// Get transaction ID from command line arguments
let scheduleID = process.argv[2];

// Default to mainnet, unless testnet is specified
const useTestnet = process.argv[3] === "testnet" ? true : false;

/**
 * Main function to process a transaction ID
 * @param {string} transactionId - The transaction ID to process
 * @param {boolean} useTestnet - Whether to use testnet (true) or mainnet (false)
 */
async function processTransaction(transactionId, useTestnet) {
  try {
    console.log(`Processing scheduleID: ${transactionId}`);
    console.log(`Using ${useTestnet ? "testnet" : "mainnet"} mirror node`);

    // Fetch transaction body
    const transactionBodyProtoBuffer = await fetchTransactionBody(
      scheduleID,
      useTestnet ? "https://testnet.mirrornode.hedera.com" : "https://mainnet.mirrornode.hedera.com"
    );
    console.debug("Transaction body fetched successfully");

    // Decode the protobuf buffer and print the information
    decodeProtobufAndPrintData(transactionBodyProtoBuffer);
  } catch (error) {
    console.error(`Failed to process transaction: ${error.message}`);
    process.exit(2);
  }
}

/**
 * Fetches the transaction body for a given schedule ID from the mirror node.
 *
 * @param {string} scheduleID - The ID of the schedule to fetch the transaction body for.
 * @param {string} mirrorNodeUrl - The base URL of the mirror node.
 * @returns {Promise<Buffer>} A promise that resolves to a Buffer containing the transaction body.
 * @throws Will throw an error if the request fails.
 */
async function fetchTransactionBody(scheduleID, mirrorNodeUrl) {
  try {
    const response = await axios.get(mirrorNodeUrl + `/api/v1/schedules/${scheduleID}`);
    const transactionBodyBase64 = response.data.transaction_body;
    return Buffer.from(transactionBodyBase64, "base64");
  } catch (error) {
    console.error(`Error fetching transaction body: ${error.message}`);
    if (error.response) {
      console.error(`Status code: ${error.response.status}`);
      console.error(`Response data:`, error.response.data);
    }
    throw error;
  }
}

/**
 * Decodes protobuf transaction body data and outputs detailed information
 * @param {Buffer} transactionBuffer - Buffer containing the transaction body protobuf data
 */
function decodeProtobufAndPrintData(transactionBodyProtoBuffer) {
  protobuf.load("hedera-protobufs-static/streams/record_stream_file.proto", function (err, root) {
    if (err) throw err;

    // Find the transaction's record
    let JSONData = root.lookupType("proto.SchedulableTransactionBody").decode(transactionBodyProtoBuffer).toJSON();
    console.log("=== Transaction details ===");
    console.deepLog(JSONData);
  });
}

// Run the main function
processTransaction(scheduleID, useTestnet);
