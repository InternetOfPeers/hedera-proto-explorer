#!/bin/bash
# i.e., ./download-file.sh recordstreams/record0.0.15/2024-01-24T00_00_08.001730738Z.rcd_sig /tmp/foo.rcd_sig
# TODO check file existence
source $(dirname "$0")/utils/common.sh

# Check parameters
test -z "$1" && echo "Specify a valid transaction ID (i.e. 0.0.1872027-1715617273-901905148) as first parameter" && exit 100
FORCE_DOWNLOAD="false"
test "$2" == "overwrite-if-present" && FORCE_DOWNLOAD="true"

HPE_TXID=$(echo $1 | sed -r "s/@(.*[0-9])\./-\1-/")
HPE_TXID_LOGFILE="$HPE_LOGGING_FOLDER/$HPE_TXID.txt"
HPE_TXID_LOGFILE_COLOR="$HPE_LOGGING_FOLDER/$HPE_TXID.txt.color"

echo "$(print_timestamp) ⚑ Started $0 (PID $$) with the following configuration"
echo "$(print_timestamp) ⛶ Transaction ID .......................: $HPE_TXID"
echo "$(print_timestamp) ⛶ Records folder .......................: $HPE_RECORDS_ROOT_FOLDER"

init_working_folders

HPE_TRANSACTIONS=$(curl -s https://mainnet-public.mirrornode.hedera.com/api/v1/transactions/$HPE_TXID)
HPE_TRANSACTIONS_COUNT=$(echo $HPE_TRANSACTIONS | jq ".transactions | length")

[ $HPE_TRANSACTIONS_COUNT == 0 ] && echo "$(print_timestamp) ⛔ No transaction with the specified ID. Exiting." && exit 102

echo "$(print_timestamp) ⚙ Transactions with the same ID: $HPE_TRANSACTIONS_COUNT"

HPE_CONSENSUS_TIMESTAMP=$(echo $HPE_TRANSACTIONS | jq -r '.transactions[0].consensus_timestamp ')

HPE_RECORDFILENAME_GZ=$(curl -s "https://mainnet-public.mirrornode.hedera.com/api/v1/blocks?limit=1&order=asc&timestamp=gte:$HPE_CONSENSUS_TIMESTAMP" | jq -r ".blocks[].name")

HPE_RECORDFILENAME=${HPE_RECORDFILENAME_GZ%.gz}
HPE_RECORDFILEPATH="./records/$HPE_RECORDFILENAME"
HPE_RECORDFILEPATH_GZ="./records/$HPE_RECORDFILENAME_GZ"

[ $FORCE_DOWNLOAD == "true" ] || [ ! -s "${HPE_RECORDFILEPATH}" ] &&\
    download_file_from_aws_s3 recordstreams/record0.0.3/$HPE_RECORDFILENAME_GZ $HPE_RECORDFILEPATH_GZ &&
    gzip -df $HPE_RECORDFILEPATH_GZ

echo "" > $HPE_TXID_LOGFILE
echo "" > $HPE_TXID_LOGFILE_COLOR
for HPE_TXHASH in $(echo $HPE_TRANSACTIONS | jq -r '.transactions[].transaction_hash'); do
    node proto-decode-transaction.js --record=./records/$HPE_RECORDFILENAME --txhash=$HPE_TXHASH >> $HPE_TXID_LOGFILE_COLOR
done
cat $HPE_TXID_LOGFILE_COLOR | sed -r "s/\x1B\[([0-9]{1,3}(;[0-9]{1,2};?)?)?[mGK]//g" > $HPE_TXID_LOGFILE
cat $HPE_TXID_LOGFILE_COLOR

echo "$(print_timestamp) ✔ Transactions details in $HPE_TXID_LOGFILE"
echo "$(print_timestamp) 🏁 Script $0 (PID $$) ended" &&\
    exit 0
    