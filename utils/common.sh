#!/bin/bash
# This file is meant to be imported with `source` as a library for other bash scripts
# Nice icons: # ☕ ℹ ★ 🚩 🏁 ⚐ ⚑ 🔽 🔼 ↧ ☝ ⛔ ⛶ ➕ + ✓ ✔ ⚠ ⚙
source $(dirname "$0")/config   # the path refers to the initial script in the root, not to the common.sh folder

function init_working_folders()
{
    create_folder_if_not_present $HPE_ROOT_DATA_FOLDER
    create_folder_if_not_present $HPE_RECORDS_ROOT_FOLDER/mainnet
    create_folder_if_not_present $HPE_RECORDS_ROOT_FOLDER/testnet
    create_folder_if_not_present $HPE_RECORDS_ROOT_FOLDER/previewnet
    create_folder_if_not_present $HPE_LOGGING_FOLDER/mainnet
    create_folder_if_not_present $HPE_LOGGING_FOLDER/testnet
    create_folder_if_not_present $HPE_LOGGING_FOLDER/previewnet
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
    echo "$(print_timestamp) ☕ Downloading via AWS S3: $HPE_BUCKET_NAME/$1"
    aws s3api get-object --bucket $HPE_BUCKET_NAME --key $1 --request-payer requester $2 --no-cli-pager --output text --no-paginate --no-cli-auto-prompt
    return 0
}

# Expect 2 parameters, source file (full path, excluding bucket name) and destination file (full path)
# i.e., recordstreams/record0.0.3/2024-04-25T21_17_08.000248496Z.rcd.gz ./records/2024-04-25T21_17_08.000248496Z.rcd.gz
function download_file_from_gcp_storage()
{
    [[ $HPE_GCP_BILLING_PROJECT_ID == "" ]] && echo "$(print_timestamp) ⛔ Please specify a billing project ID in the config file. Exiting." && exit 201
    # Remember to setup a default billing project like this:
    # gcloud config set billing/quota_project <PROJECT_ID>
    # or change the command to use the --billing-project flag like this:
    # gcloud storage cp gs://$HPE_BUCKET_NAME/$1 $2 --billing-project=<PROJECT_ID>
    echo "$(print_timestamp) ☕ Downloading via GCP Storage: $HPE_BUCKET_NAME/$1"
    gcloud --billing-project $HPE_GCP_BILLING_PROJECT_ID storage cp gs://$HPE_BUCKET_NAME/$1 $2
    return 0
}

# Expect 2 parameters, source file (full path, excluding bucket name) and destination file (full path)
# i.e., recordstreams/record0.0.3/2024-04-25T21_17_08.000248496Z.rcd.gz ./records/2024-04-25T21_17_08.000248496Z.rcd.gz
function download_file()
{
    if [[ $HPE_STORAGE_PROVIDER == "aws" ]]; then
        download_file_from_aws_s3 $1 $2
    elif [[ $HPE_STORAGE_PROVIDER == "gcp" ]]; then
        download_file_from_gcp_storage $1 $2
    else
        echo "$(print_timestamp) ⛔ Invalid storage provider specified [$HPE_STORAGE_PROVIDER]. Please choose either 'aws' or 'gcp'. Exiting."
        exit 200
    fi
    return 0
}