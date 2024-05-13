#!/bin/bash
# This file is meant to be imported with `source` as a library for other bash scripts
# Nice icons: # ☕ ℹ ★ 🚩 🏁 ⚐ ⚑ 🔽 🔼 ↧ ☝ ⛔ ⛶ ➕ + ✓ ✔ ⚠⚙
source $(dirname "$0")/config   # the path refers to the initial script in the root, not to the common.sh folder

function init_working_folders()
{
    create_folder_if_not_present $HPE_ROOT_DATA_FOLDER
    create_folder_if_not_present $HPE_RECORDS_ROOT_FOLDER
    create_folder_if_not_present $HPE_LOGGING_FOLDER
    return 0
}

function create_folder_if_not_present()
{
    [ ! -d "$1" ] && mkdir -p $1 && echo "$(print_timestamp) ✔ Created folder $1"    
    return 0
}

# Output in UTC and the current process ID. Example: 2024-01-28T18:49:10.335Z-1234
function print_timestamp()
{
    echo -n $(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")-$$
    return 0
}

# Expect 2 parameters, source file (full path, excluding bucket name) and destination file (full path)
# i.e., recordstreams/record0.0.3/2024-04-25T21_17_08.000248496Z.rcd.gz ./records/2024-04-25T21_17_08.000248496Z.rcd.gz
function download_file_from_aws_s3()
{
    echo "$(print_timestamp) ☕ Downloading $1"
    aws s3api get-object --bucket $HPE_S3_BUCKET_NAME --key $1 --request-payer requester $2 --no-cli-pager --output text --no-paginate --no-cli-auto-prompt
    
    return 0
}
