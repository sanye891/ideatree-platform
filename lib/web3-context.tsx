"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface Web3ContextType {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  balance: string
  chainId: number | null
  connect: () => Promise<void>
  disconnect: () => void
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function Web3Provider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [balance, setBalance] = useState("0")
  const [chainId, setChainId] = useState<number | null>(null)

  const isConnected = !!address

  const connect = async () => {
    setIsConnecting(true)
    try {
      // Mock wallet connection - in production, use ethers.js or wagmi
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockAddress = "0x" + Math.random().toString(16).substring(2, 42)
      const mockBalance = (Math.random() * 500) + 500; // At least 500 tokens
      const mockChainId = 1 // Ethereum mainnet

      setAddress(mockAddress)
      setBalance(mockBalance)
      setChainId(mockChainId)

      // Store in localStorage
      localStorage.setItem("wallet_address", mockAddress)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setBalance("0")
    setChainId(null)
    localStorage.removeItem("wallet_address")
  }

  // Auto-connect on mount if previously connected
  useEffect(() => {
    const savedAddress = localStorage.getItem("wallet_address")
    if (savedAddress) {
      setAddress(savedAddress)
      setBalance(((Math.random() * 500) + 500).toString())
      setChainId(1)
    }
  }, [])

  return (
    <Web3Context.Provider
      value={{
        address,
        isConnected,
        isConnecting,
        balance,
        chainId,
        connect,
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}
