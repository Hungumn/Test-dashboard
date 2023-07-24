import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'

export function useCategoryFunc() {
  const baseURL = process.env.NEXT_PUBLIC_URL
  const token = localStorage.getItem('TOKEN')

  const ListCategoryFunc = useCallback(async () => {
    const dataFilter = {
      name: '',
      page: 1,
      limit: -1
    }
    try {
      const categoryList = await axios.post(baseURL + '/api/Categories/filter', dataFilter, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return categoryList.data
    } catch (err) {
      console.error(err)
    }
  }, []);

  const DeleteCategoryFunc = useCallback(async(id) => {
    try {
      const result = await axios.post(`${baseURL}/api/Categories/delete`, [id], {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return result.data;
    } catch (error) {
      console.log(error);
    }
  }, []);

  const CreateCategoryFunc = useCallback(async(data) => {
    try {
      const result = await axios.post(`${baseURL}/api/Categories/insert`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return result.data;
    } catch (error) {
      console.log(error.response);
    }
  }, []);

  const UpdateCategoryFunc = useCallback(async(data, id) => {
    try {
      const result = await axios.post(`${baseURL}/api/Categories/update/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return result.data;
    } catch (error) {
      console.log(error);
    }
  }, []);


  return {
    ListCategoryFunc,
    DeleteCategoryFunc,
    CreateCategoryFunc,
    UpdateCategoryFunc,
  }
}
