'use client'

import { wagmiAdapter, projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { sepolia } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { WagmiProvider, type Config } from 'wagmi'
import { PermissionlessProvider } from '@permissionless/wagmi'

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

const capabilities = {
  paymasterService: {
    [sepolia.id]: {
      url: `https://api.pimlico.io/v2/${sepolia.id}/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API_KEY}`
    }
  }
}

// Set up metadata
const metadata = {
  name: 'appkit-example',
  description: 'AppKit Example',
  url: 'https://appkitexampleapp.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [sepolia, sepolia],
  defaultNetwork: sepolia,
  metadata: metadata,
  features: {
    emailShowWallets: false
  }
})

function ContextProvider({ children }: { children: ReactNode }) {

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config}>
      <QueryClientProvider client={queryClient}>
        <PermissionlessProvider
          capabilities={capabilities}
        >
          {children}
        </PermissionlessProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider