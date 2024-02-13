import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"
import { ExtendedPaginatedTransactionsResult } from "./types"

export function usePaginatedTransactions(): ExtendedPaginatedTransactionsResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [hasMore, setHasMore] = useState(true)
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<
    Transaction[]
  > | null>(null)

  const fetchAll = useCallback(async () => {
    const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
      "paginatedTransactions",
      {
        page: paginatedTransactions === null ? 0 : paginatedTransactions.nextPage,
      }
      
    )
    if (response !== null){
      setHasMore(response.nextPage !== null)
    }
    setPaginatedTransactions((previousResponse) => {
      if (response === null) {
        return previousResponse
      }
      else if (previousResponse === null){
        return response
      }
      else{
        return {
          ...response, 
          data: [...previousResponse.data, ...response.data]
        }
        
        // return { data: response.data, nextPage: response.nextPage }
      } 
    })
    
  }, [fetchWithCache, paginatedTransactions])

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null)
  }, [])

  return { data: paginatedTransactions, loading, fetchAll, invalidateData, hasMore }
}
