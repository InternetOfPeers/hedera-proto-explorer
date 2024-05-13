#!/bin/bash
# i.e., ./download-file.sh recordstreams/record0.0.15/2024-01-24T00_00_08.001730738Z.rcd_sig /tmp/foo.rcd_sig
# TODO check file existence
source $(dirname "$0")/utils/common.sh

# Check parameters
test -z "$1" && echo "Specify a transaction ID (i.e. 0.0.1872027-1715617273-901905148) as first parameter" && exit 100
FORCE_DOWNLOAD="false"
test "$2" == "overwrite-if-present" && FORCE_DOWNLOAD="true"

HPE_TXID="$1"
HPE_TXID_LOGFILE="$HPE_LOGGING_FOLDER/$HPE_TXID.txt"

echo "$(print_timestamp) ⚑ Started $0 (PID $$) with the following configuration"
echo "$(print_timestamp) ⛶ Transaction ID .......................: $HPE_TXID"
echo "$(print_timestamp) ⛶ Records folder .......................: $HPE_RECORDS_ROOT_FOLDER"
echo "$(print_timestamp) ⛶ Transactions details in ..............: $HPE_TXID_LOGFILE"

init_working_folders

for s in $(curl -s https://mainnet-public.mirrornode.hedera.com/api/v1/transactions/$HPE_TXID | jq -r '.transactions[] | { consensus_timestamp, transaction_hash} | to_entries? | map("\(.key)=\(.value|tostring)")|.[]' ); do
    export HPE_$s
done

HPE_recordfilename_gz=$(curl -s "https://mainnet-public.mirrornode.hedera.com/api/v1/blocks?limit=1&order=asc&timestamp=gte:$HPE_consensus_timestamp" | jq -r ".blocks[].name")

HPE_recordfilename=${HPE_recordfilename_gz%.gz}
HPE_recordfilepath="./records/$HPE_recordfilename"
HPE_recordfilepath_gz="./records/$HPE_recordfilename_gz"

[ $FORCE_DOWNLOAD == "true" ] || [ ! -s "${HPE_recordfilepath}" ] &&\
    download_file_from_aws_s3 recordstreams/record0.0.3/$HPE_recordfilename_gz $HPE_recordfilepath_gz &&
    gzip -df $HPE_recordfilepath_gz

node proto-decode-transaction.js --record=./records/$HPE_recordfilename --txhash=$HPE_transaction_hash > $HPE_TXID_LOGFILE

cat $HPE_TXID_LOGFILE

echo "$(print_timestamp) 🏁 Script $0 (PID $$) ended" &&\
    exit 0
    