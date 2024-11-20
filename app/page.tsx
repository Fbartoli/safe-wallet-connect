'use client'

import { useAccount } from "wagmi"
import { useCallback, useEffect } from 'react'
import { useCapabilities } from 'wagmi/experimental'
import {
  useSendTransaction,
  useWaitForTransactionReceipt
} from "@permissionless/wagmi"

export default function Page() {
  const { isConnected, chainId, address } = useAccount()
  const capabilities = useCapabilities()
  const capabilitiesForChain = capabilities.data[chainId]
  const paymasterServiceSupported = capabilitiesForChain?.paymasterService?.supported
  const { sendTransaction, data: transactionReference,
    isPending } = useSendTransaction()

  useEffect(() => {
    console.log('chainId', chainId)
    console.log('capabilities', capabilities.data[chainId])
  }, [capabilities])

  const { data: receipt, isPending: isReceiptPending } =
    useWaitForTransactionReceipt({
      id: transactionReference
    })

  const sendTransactionCallback = useCallback(async () => {
    console.log("Sending transaction...")
    sendTransaction({
      to: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
      data: "0x1234",
    }, {
      onSuccess: (data, variables, context) => {
        console.log('success', data, variables, context)
      },
      onError: (error, variables, context) => {
        console.log('error', error, variables, context)
      },
      onSettled: (data, variables, context) => {
        console.log('settled', data, variables, context)
      }
    })
  }, [sendTransaction])

  return (<>
    <appkit-button />
    {isConnected && <>
      
      <div style={{ marginTop: 60, color: 'white' }}>
        <h2>Send ERC-4677 transaction</h2>
        {paymasterServiceSupported ? 'Paymaster service supported' : 'Paymaster service not supported'}
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
