import { useState } from 'react'
import { useApiStatus } from './useApiStatus'
import { PENDING, SUCCESS, ERROR } from '../constants/apiStatus'

export default function useApi (
  fn,
  config = {}
) {
  const { initialData } = config
  const [data, setData] = useState(initialData)
  const [error, setError] = useState()
  const { apiStatus, setApiStatus, ...normalisedStatuses } = useApiStatus()

  const exec = async (...args) => {
    try {
      setError(null)
      setApiStatus(PENDING)
      const data = await fn(...args)
      setData(data)
      setApiStatus(SUCCESS)
      return {
        data,
        error: null,
      }
    } catch (error) {
      //console.log(error)
      setError(error.response.data.detail)
      setApiStatus(ERROR)
      return {
        error,
        data: null,
      }
    }
  }
  return ({
    data,
    setData,
    apiStatus,
    setApiStatus,
    error,
    exec,
    ...normalisedStatuses,
  })
}