#!/bin/bash
# i.e., ./examine.sh 0.0.4628257-1742237538-087066692

# TODO check file existence
source $(dirname "$0")/utils/common.sh

# Check parameters
test -z "$1" && echo "Specify a valid transaction ID (i.e. 0.0.1872027-1715617273-901905148) as first parameter" && exit 100
test "$2" == "mainnet" && HPE_NETWORK="mainnet"
test "$3" == "mainnet" && HPE_NETWORK="mainnet"
test "$2" == "testnet" && HPE_NETWORK="testnet"
test "$3" == "testnet" && HPE_NETWORK="testnet"
test "$2" == "previewnet" && HPE_NETWORK="previewnet"
test "$3" == "previewnet" && HPE_NETWORK="previewnet"
test "$2" == "overwrite-if-present" && HPE_FORCE_DOWNLOAD="true"
test "$3" == "overwrite-if-present" && HPE_FORCE_DOWNLOAD="true"

test $HPE_NETWORK = "testnet" &&\
    HPE_MIRROR_NODE_API_BASE_URL=$HPE_TESTNET_MIRROR_NODE_API_BASE_URL &&\
    HPE_BUCKET_NAME=$HPE_TESTNET_BUCKET_NAME

test $HPE_NETWORK = "previewnet" &&\
    HPE_MIRROR_NODE_API_BASE_URL=$HPE_PREVIEWNET_MIRROR_NODE_API_BASE_URL &&\
    HPE_BUCKET_NAME=$HPE_PREVIEWNET_BUCKET_NAME

HPE_TXID=$(echo $1 | sed -r "s/@(.*[0-9])\./-\1-/")
HPE_TXID_LOGFILE="$HPE_LOGGING_FOLDER/$HPE_NETWORK/$HPE_TXID.txt"
HPE_TXID_LOGFILE_COLOR="$HPE_LOGGING_FOLDER/$HPE_NETWORK/$HPE_TXID.txt.color"

echo "$(print_timestamp) ⚑ Started $0 (PID $$) with the following configuration"
echo "$(print_timestamp) ⛶ Network ..............................: $HPE_NETWORK"
echo "$(print_timestamp) ⛶ Transaction ID .......................: $HPE_TXID"
echo "$(print_timestamp) ⛶ Records folder .......................: $HPE_RECORDS_ROOT_FOLDER/$HPE_NETWORK"

init_working_folders

HPE_TRANSACTIONS=$(curl -s "$HPE_MIRROR_NODE_API_BASE_URL/transactions/$HPE_TXID")
HPE_TRANSACTIONS_COUNT=$(echo $HPE_TRANSACTIONS | jq ".transactions | length")

[ $HPE_TRANSACTIONS_COUNT == 0 ] && echo "$(print_timestamp) ⛔ No transaction with the specified ID. Exiting." && exit 102

echo "$(print_timestamp) ⚙ Transactions with the same ID: $HPE_TRANSACTIONS_COUNT"

# TODO: same txid can have sub txs with different consensus timestamps, for example in case of scheduled tx,
# so, getting only the first one can lead to error in find all the txs reported by the mirror node
HPE_CONSENSUS_TIMESTAMP=$(echo $HPE_TRANSACTIONS | jq -r '.transactions[0].consensus_timestamp ')

HPE_RECORDFILENAME_GZ=$(curl -s "$HPE_MIRROR_NODE_API_BASE_URL/blocks?limit=1&order=asc&timestamp=gte:$HPE_CONSENSUS_TIMESTAMP" | jq -r ".blocks[].name")

HPE_RECORDFILENAME=${HPE_RECORDFILENAME_GZ%.gz}
HPE_RECORDFILEPATH="$HPE_RECORDS_ROOT_FOLDER/$HPE_NETWORK/$HPE_RECORDFILENAME"
HPE_RECORDFILEPATH_GZ="$HPE_RECORDS_ROOT_FOLDER/$HPE_NETWORK/$HPE_RECORDFILENAME_GZ"

[ $HPE_FORCE_DOWNLOAD == "true" ] || [ ! -s "${HPE_RECORDFILEPATH}" ] &&\
    download_file $HPE_RECORD_SOURCE_FOLDER/$HPE_RECORDFILENAME_GZ $HPE_RECORDFILEPATH_GZ &&\
    gzip -df $HPE_RECORDFILEPATH_GZ

[ ! -s "${HPE_RECORDFILEPATH}" ] && echo "$(print_timestamp) ⛔ File $HPE_RECORDFILEPATH is empty! A previous download may have been failed. Exiting." && exit 101

echo "" > $HPE_TXID_LOGFILE
echo "" > $HPE_TXID_LOGFILE_COLOR
for HPE_TXHASH in $(echo $HPE_TRANSACTIONS | jq -r '.transactions[].transaction_hash'); do
    node proto-decode-transaction.js --record=$HPE_RECORDFILEPATH --txhash=$HPE_TXHASH >> $HPE_TXID_LOGFILE_COLOR
done
cat $HPE_TXID_LOGFILE_COLOR | sed -r "s/\x1B\[([0-9]{1,3}(;[0-9]{1,2};?)?)?[mGK]//g" > $HPE_TXID_LOGFILE
cat $HPE_TXID_LOGFILE_COLOR

echo "$(print_timestamp) ✔ Transactions details in $HPE_TXID_LOGFILE"
echo "$(print_timestamp) 🏁 Script $0 (PID $$) ended" &&\
    exit 0
    