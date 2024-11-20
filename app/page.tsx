'use client'

import { useAccount } from "wagmi"
import { useCallback, useEffect } from 'react'
import { useCapabilities } from 'wagmi/experimental'
import {
  useSendTransaction,
  useWaitForTransactionReceipt
} from "@permissionless/wagmi"
import { sendCalls } from '@wagmi/core/experimental'
import { wagmiAdapter } from "./config"
import { sepolia } from "@reown/appkit/networks"

export default function Page() {
  const { isConnected, chainId, address } = useAccount()
  const capabilities = useCapabilities()
  const { sendTransaction, data: transactionReference,
    isPending } = useSendTransaction()

  const { data: receipt, isPending: isReceiptPending } =
    useWaitForTransactionReceipt({
      id: transactionReference
    })

  const sendTransactionCallback = useCallback(async () => {
    console.log("Sending transaction...")
    const result = await sendCalls(wagmiAdapter.wagmiConfig, {
      account: address,
      calls: [
        {
          to: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
          data: "0x1234",
        }
      ],
      capabilities: {
        paymasterService: {
          url: `https://api.pimlico.io/v2/${sepolia.id}/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`
        }
      }
    })
    console.log("Result", result)
  }, [sendCalls])

  return (<>
    <appkit-button />
    {isConnected && <>

      <div style={{ marginTop: 60, color: 'white' }}>
        <h2>Send ERC-4677 transaction</h2>
        {address}

        {isPending && <div>Sending transaction...</div>}

        {transactionReference && (
          <div>Awaiting confirmation: {transactionReference}</div>
        )}

        {receipt && <div>{receipt.status}</div>}

        <button onClick={sendTransactionCallback} type="button">
          Send Transaction
        </button>
      </div>
    </>}
  </>)
}
