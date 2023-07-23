import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'

export function useTechnicalFunc() {
  const baseURL = process.env.NEXT_PUBLIC_URL
  const token = localStorage.getItem('TOKEN')

  const ListTechincalFunc = useCallback(async () => {
    const dataFilter = {
      name: '',
      page: 1,
      limit: -1
    }
    try {
      const categoryList = await axios.post(baseURL + '/api/TechnicalDetails/filter', dataFilter, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      return categoryList.data.data
    } catch (err) {
      console.error(err)
    }
  }, [])

  const DeleteTechnicalFunc = useCallback(async(id) => {
    const result = await axios.post(`${baseURL}/api/TechnicalDetails/delete`, [id], {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return result.data;
  });

  const CreateTechnicalFunc = useCallback(async(data) => {
    const result = await axios.post(`${baseURL}/api/TechnicalDetails/insert`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return result.data;
  });

  const UpdateTechnicalFunc = useCallback(async(data, id) => {
    const result = await axios.post(`${baseURL}/api/TechnicalDetails/update/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return result.data;
  });

  return {
    ListTechincalFunc,
    DeleteTechnicalFunc,
    CreateTechnicalFunc,
    UpdateTechnicalFunc
  }
}
