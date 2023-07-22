import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'

export function useProductFunc() {
  const baseURL = process.env.NEXT_PUBLIC_URL
  const token = localStorage.getItem('TOKEN')

  const ListProductFunc = useCallback(async (dataFilter) => {
    try {
      const result = await axios.post(baseURL + '/api/Products/filter', dataFilter);
      return result.data;
    } catch (err) {
      console.error(err)
    }
  }, []);

  const ProductDetailFunc = useCallback(async (id) => {
    try {
      const result = await axios.get(baseURL + '/api/Products/' + id);

      return result.data;
    } catch (error) {
      console.log(error);
    }
  })

  const DeleteProductFunc = useCallback(async (id) => {
    try {
      const result = await axios.post(`${baseURL}/api/Products/delete`, [id], {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return result.data;
    } catch (error) {
      console.log(error);
    }
  }, []);

  const UpdateProductFunc = useCallback(async (id, data) => {
    try {
      const result = await axios.post(`${baseURL}/api/Products/update/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return result.data;
    } catch (error) {
      console.log(error);
    }
  }, []);

  const CreateProductFunc = useCallback(async (data) => {
    try {
      const result = await axios.post(`${baseURL}/api/Products/insert`, data, {
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
    ListProductFunc,
    ProductDetailFunc,
    DeleteProductFunc,
    UpdateProductFunc,
    CreateProductFunc,
  }
}
