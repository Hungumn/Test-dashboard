import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'

export function useProductFunc() {
  const baseURL = process.env.NEXT_PUBLIC_URL
  const token = localStorage.getItem('TOKEN')

  const ListProductFunc = useCallback(async () => {
    const dataFilter = {
      name: '',
      page: 1,
      limit: 1000
    }
    try {
      const categoryList = await axios.post(baseURL + '/api/Products/filter', dataFilter, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      return categoryList.data.data
    } catch (err) {
      console.error(err)
    }
  }, [])


  return {
    ListProductFunc,
  }
}
