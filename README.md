# Hedera Proto Explorer

IMPORTANT ASSUMPTION: this procedure does not verify the signatures associated to the tx, nor that the downloaded record file and corresponding txs hashes! If you want to query a verified data source, use your own mirror node to download and verify the signatures associated to the record file.

## How to get transactions details via script

Run the following script:

```bash
./examine.sh 0.0.513587-1714079813-090631706
```

The output will be:

```bash
2024-05-13T18:15:11.204Z-15456 ⚑ Started ./examine.sh (PID 15456) with the following configuration
2024-05-13T18:15:11.205Z-15456 ⛶ Transaction ID .......................: 0.0.513587-1714079813-090631706
2024-05-13T18:15:11.205Z-15456 ⛶ Records folder .......................: ./records
2024-05-13T18:15:11.207Z-15456 ⛶ Transactions details in ..............: ./logs/0.0.1872027-1715617273-901905148.txt
2024-05-13T18:15:11.208Z-15456 ✔ Created folder ./records
2024-05-13T18:15:11.210Z-15456 ✔ Created folder ./logs
2024-05-13T18:15:11.445Z-15456 ☕ Downloading recordstreams/record0.0.3/2024-04-25T21_17_08.000248496Z.rcd.gz
bytes   800018  binary/octet-stream     "a88a4de02cfc283c9bb8f53473d5e875"      2024-04-25T21:17:15+00:00       COMPLETED        requester       AES256  z3SIH.ypHpLh1BLugG6JA3W7DdFcxbMH
=== Transaction ===
{
  transaction: {
    signedTransactionBytes: 'ClgKGQoLCMWQq7EGEJrcmysSCAgAEAAYs6wfGAASBggAEAAYAxiAhK9fIgIIeDIAggMnEiUKCQgAEAAY0ciIAhIICAAQABizrB8aCQgAEAAYxaHpASID9vUBEswBCmQKIHcoN6wujR2qXjZWVOxzYBEP6a9i8khL0gIgT2JuXIKyGkDu761b22vDr/chkr5qaR/QqXPIdV2Y08/9S11nlChfAlMXZj0jIWgvFyN25CXzGB4rw+KhwOU8jPpnF3d+pBYACmQKIJUSLeJ3nu+RKNA7rsFMFMNOlg2U59HkwXbTZQS+/kh7GkDgkkcbbok6JZVz6dGgmaXQPTEz66X6EcvKx3BQID+b/BbwSaA6G9114w+olR3jqrIv2gMIAFkH6a+eexzVbCMK'
  },
  record: {
    receipt: {
      status: 'SUCCESS',
      exchangeRate: {
        currentRate: {
          hbarEquiv: 30000,
          centEquiv: 353419,
          expirationTime: { seconds: '1714082400' }
        },
        nextRate: {
          hbarEquiv: 30000,
          centEquiv: 357345,
          expirationTime: { seconds: '1714086000' }
        }
      }
    },
    transactionHash: 'ATGcMV0XrYmiI1ZpGmZ5l5IW4wC5XDB1jO5m9qlAmmXyW3ulLW7w5ZPZtsY5XwF+',
    consensusTimestamp: { seconds: '1714079829', nanos: 44599703 },
    transactionID: {
      transactionValidStart: { seconds: '1714079813', nanos: 90631706 },
      accountID: { accountNum: '513587' }
    },
    transactionFee: '68984744',
    transferList: {
      accountAmounts: [
        { accountID: { accountNum: '3' }, amount: '1765339' },
        { accountID: { accountNum: '98' }, amount: '60497465' },
        { accountID: { accountNum: '800' }, amount: '6721940' },
        { accountID: { accountNum: '513587' }, amount: '-68984744' }
      ]
    }
  }
}

=== Signatures ===
{
  pubKeyPrefix: 'dyg3rC6NHapeNlZU7HNgEQ/pr2LySEvSAiBPYm5cgrI=',
  ed25519: '7u+tW9trw6/3IZK+amkf0KlzyHVdmNPP/UtdZ5QoXwJTF2Y9IyFoLxcjduQl8xgeK8PiocDlPIz6Zxd3fqQWAA==',
  pubKeyPrefixHex: '772837ac2e8d1daa5e365654ec7360110fe9af62f2484bd202204f626e5c82b2'
}
{
  pubKeyPrefix: 'lRIt4nee75Eo0DuuwUwUw06WDZTn0eTBdtNlBL7+SHs=',
  ed25519: '4JJHG26JOiWVc+nRoJml0D0xM+ul+hHLysdwUCA/m/wW8EmgOhvddeMPqJUd46qyL9oDCABZB+mvnnsc1WwjCg==',
  pubKeyPrefixHex: '95122de2779eef9128d03baec14c14c34e960d94e7d1e4c176d36504befe487b'
}

=== Body ==
TransactionBody {
  transactionID: TransactionID {
    transactionValidStart: Timestamp {
      seconds: Long { low: 1714079813, high: 0, unsigned: false },
      nanos: 90631706
    },
    accountID: AccountID {
      shardNum: Long { low: 0, high: 0, unsigned: false },
      realmNum: Long { low: 0, high: 0, unsigned: false },
      accountNum: Long { low: 513587, high: 0, unsigned: false }
    },
    scheduled: false
  },
  nodeAccountID: AccountID {
    shardNum: Long { low: 0, high: 0, unsigned: false },
    realmNum: Long { low: 0, high: 0, unsigned: false },
    accountNum: Long { low: 3, high: 0, unsigned: false }
  },
  transactionFee: Long { low: 200000000, high: 0, unsigned: true },
  transactionValidDuration: Duration { seconds: Long { low: 120, high: 0, unsigned: false } },
  memo: '',
  cryptoApproveAllowance: CryptoApproveAllowanceTransactionBody {
    cryptoAllowances: [],
    nftAllowances: [
      NftAllowance {
        serialNumbers: [ Long { low: 31478, high: 0, unsigned: false } ],
        tokenId: TokenID {
          shardNum: Long { low: 0, high: 0, unsigned: false },
          realmNum: Long { low: 0, high: 0, unsigned: false },
          tokenNum: Long { low: 4334673, high: 0, unsigned: false }
        },
        owner: AccountID {
          shardNum: Long { low: 0, high: 0, unsigned: false },
          realmNum: Long { low: 0, high: 0, unsigned: false },
          accountNum: Long { low: 513587, high: 0, unsigned: false }
        },
        spender: AccountID {
          shardNum: Long { low: 0, high: 0, unsigned: false },
          realmNum: Long { low: 0, high: 0, unsigned: false },
          accountNum: Long { low: 3821765, high: 0, unsigned: false }
        }
      }
    ],
    tokenAllowances: []
  }
}
2024-05-13T18:15:13.457Z-15456 🏁 Script ./examine.sh (PID 15456) ended
```

The output will be also saved in the default logs folder.

By default the script does not download the record file if it is already present. Override this behaviour with the `overwrite-if-present` parameter.

```bash
./examine.sh 0.0.513587-1714079813-090631706 overwrite-if-present
```

If you want to change the default values, edit the `config` file.

## How to manually get transactions details

1. First you want the tx hash

    ```zsh
    curl -s https://mainnet-public.mirrornode.hedera.com/api/v1/transactions/0.0.513587-1714079813-090631706 | jq '.transactions[] | { consensus_timestamp, transaction_hash}'

    {
      "consensus_timestamp": "1714079829.044599703",
      "transaction_hash": "ATGcMV0XrYmiI1ZpGmZ5l5IW4wC5XDB1jO5m9qlAmmXyW3ulLW7w5ZPZtsY5XwF+"
    }
    ```

1. Then, you want the record file containing that tx

    ```zsh
    curl -s "https://mainnet-public.mirrornode.hedera.com/api/v1/blocks?limit=1&order=asc&timestamp=gte:1714079829.044599703" | jq ".blocks[].name"
    "2024-04-25T21_17_08.000248496Z.rcd.gz"
    ```

1. Then you download the record file. Note: if 0.0.3 does not have that file, try 0.0.4, 0.0.5, and so on.

    ```zsh
    mkdir records
    aws s3 cp --request-payer requester s3://hedera-mainnet-streams/recordstreams/record0.0.3/2024-04-25T21_17_08.000248496Z.rcd.gz ./records
    ```

1. Ungzip the record file

    ```zsh
    gzip -d ./records/2024-04-25T21_17_08.000248496Z.rcd.gz 
    ```

1. Decode the record file and show tx's detail (--record parameter accepts also a path)

    ```zsh
    node proto-decode-transaction.js --record=./records/2024-04-25T21_17_08.000248496Z.rcd --txhash=ATGcMV0XrYmiI1ZpGmZ5l5IW4wC5XDB1jO5m9qlAmmXyW3ulLW7w5ZPZtsY5XwF+

    === Transaction ===
    {
      transaction: {
        signedTransactionBytes: 'ClgKGQoLCMWQq7EGEJrcmysSCAgAEAAYs6wfGAASBggAEAAYAxiAhK9fIgIIeDIAggMnEiUKCQgAEAAY0ciIAhIICAAQABizrB8aCQgAEAAYxaHpASID9vUBEswBCmQKIHcoN6wujR2qXjZWVOxzYBEP6a9i8khL0gIgT2JuXIKyGkDu761b22vDr/chkr5qaR/QqXPIdV2Y08/9S11nlChfAlMXZj0jIWgvFyN25CXzGB4rw+KhwOU8jPpnF3d+pBYACmQKIJUSLeJ3nu+RKNA7rsFMFMNOlg2U59HkwXbTZQS+/kh7GkDgkkcbbok6JZVz6dGgmaXQPTEz66X6EcvKx3BQID+b/BbwSaA6G9114w+olR3jqrIv2gMIAFkH6a+eexzVbCMK'
      },
      record: {
        receipt: {
          status: 'SUCCESS',
          exchangeRate: {
            currentRate: {
              hbarEquiv: 30000,
              centEquiv: 353419,
              expirationTime: { seconds: '1714082400' }
            },
            nextRate: {
              hbarEquiv: 30000,
              centEquiv: 357345,
              expirationTime: { seconds: '1714086000' }
            }
          }
        },
        transactionHash: 'ATGcMV0XrYmiI1ZpGmZ5l5IW4wC5XDB1jO5m9qlAmmXyW3ulLW7w5ZPZtsY5XwF+',
        consensusTimestamp: { seconds: '1714079829', nanos: 44599703 },
        transactionID: {
          transactionValidStart: { seconds: '1714079813', nanos: 90631706 },
          accountID: { accountNum: '513587' }
        },
        transactionFee: '68984744',
        transferList: {
          accountAmounts: [
            { accountID: { accountNum: '3' }, amount: '1765339' },
            { accountID: { accountNum: '98' }, amount: '60497465' },
            { accountID: { accountNum: '800' }, amount: '6721940' },
            { accountID: { accountNum: '513587' }, amount: '-68984744' }
          ]
        }
      }
    }

    === Signatures ===
    {
      pubKeyPrefix: 'dyg3rC6NHapeNlZU7HNgEQ/pr2LySEvSAiBPYm5cgrI=',
      ed25519: '7u+tW9trw6/3IZK+amkf0KlzyHVdmNPP/UtdZ5QoXwJTF2Y9IyFoLxcjduQl8xgeK8PiocDlPIz6Zxd3fqQWAA==',
      pubKeyPrefixHex: '772837ac2e8d1daa5e365654ec7360110fe9af62f2484bd202204f626e5c82b2'
    }
    {
      pubKeyPrefix: 'lRIt4nee75Eo0DuuwUwUw06WDZTn0eTBdtNlBL7+SHs=',
      ed25519: '4JJHG26JOiWVc+nRoJml0D0xM+ul+hHLysdwUCA/m/wW8EmgOhvddeMPqJUd46qyL9oDCABZB+mvnnsc1WwjCg==',
      pubKeyPrefixHex: '95122de2779eef9128d03baec14c14c34e960d94e7d1e4c176d36504befe487b'
    }

    === Body ==
    TransactionBody {
      transactionID: TransactionID {
        transactionValidStart: Timestamp {
          seconds: Long { low: 1714079813, high: 0, unsigned: false },
          nanos: 90631706
        },
        accountID: AccountID {
          shardNum: Long { low: 0, high: 0, unsigned: false },
          realmNum: Long { low: 0, high: 0, unsigned: false },
          accountNum: Long { low: 513587, high: 0, unsigned: false }
        },
        scheduled: false
      },
      nodeAccountID: AccountID {
        shardNum: Long { low: 0, high: 0, unsigned: false },
        realmNum: Long { low: 0, high: 0, unsigned: false },
        accountNum: Long { low: 3, high: 0, unsigned: false }
      },
      transactionFee: Long { low: 200000000, high: 0, unsigned: true },
      transactionValidDuration: Duration { seconds: Long { low: 120, high: 0, unsigned: false } },
      memo: '',
      cryptoApproveAllowance: CryptoApproveAllowanceTransactionBody {
        cryptoAllowances: [],
        nftAllowances: [
          NftAllowance {
            serialNumbers: [ Long { low: 31478, high: 0, unsigned: false } ],
            tokenId: TokenID {
              shardNum: Long { low: 0, high: 0, unsigned: false },
              realmNum: Long { low: 0, high: 0, unsigned: false },
              tokenNum: Long { low: 4334673, high: 0, unsigned: false }
            },
            owner: AccountID {
              shardNum: Long { low: 0, high: 0, unsigned: false },
              realmNum: Long { low: 0, high: 0, unsigned: false },
              accountNum: Long { low: 513587, high: 0, unsigned: false }
            },
            spender: AccountID {
              shardNum: Long { low: 0, high: 0, unsigned: false },
              realmNum: Long { low: 0, high: 0, unsigned: false },
              accountNum: Long { low: 3821765, high: 0, unsigned: false }
            }
          }
        ],
        tokenAllowances: []
      }
    }
```
