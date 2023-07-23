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

  const DeleteMaterialFunc = useCallback(async(id) => {
    const result = await axios.post(`${baseURL}/api/Materials/delete`, [id], {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return result.data;
  });

  const CreateMaterialFunc = useCallback(async(data) => {
    const result = await axios.post(`${baseURL}/api/Materials/insert`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return result.data;
  });

  const UpdateMaterialFunc = useCallback(async(data, id) => {
    const result = await axios.post(`${baseURL}/api/Materials/update/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return result.data;
  });

  return {
    ListMaterialFunc,
    DeleteMaterialFunc,
    CreateMaterialFunc,
    UpdateMaterialFunc,
  }
}
