import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'

export function useMaterialFunc() {
  const baseURL = process.env.NEXT_PUBLIC_URL
  const token = localStorage.getItem('TOKEN')

  const ListMaterialFunc = useCallback(async () => {
    const dataFilter = {
      name: '',
      page: 1,
      limit: -1
    }
    try {
      const result = await axios.post(baseURL + '/api/Materials/filter', dataFilter, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      return result.data.data
    } catch (err) {
      console.error(err)
    }
  }, [])


  return {
    ListMaterialFunc,
  }
}
