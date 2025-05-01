type GetWalletTokenBalancesResponse = {
  token_address: string
  name: string
  symbol: string
  logo?: string | undefined
  thumbnail?: string | undefined
  decimals: number
  balance: string
  possible_spam?: boolean
  verified_contract?: boolean | undefined
  total_supply?: string
  total_supply_formatted?: string
  percentage_relative_to_total_supply?: number,
  isNativeToken?: boolean
}
