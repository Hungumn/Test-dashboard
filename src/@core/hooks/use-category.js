import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'

export function useCategoryFunc() {
  const baseURL = process.env.NEXT_PUBLIC_URL
  const token = localStorage.getItem('TOKEN')

  const ListCategoryFunc = useCallback(async () => {
    const dataFilter = {
      name: '',
      page: 1,
      limit: 1000
    }
    try {
      const categoryList = await axios.post(baseURL + '/api/Categories/filter', dataFilter, {
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
    ListCategoryFunc,
  }
}
