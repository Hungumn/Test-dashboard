import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'

export function useOrderFunc() {
  const baseURL = process.env.NEXT_PUBLIC_URL
  const token = localStorage.getItem('TOKEN')

  const ListOrderFunc = useCallback(async (dataFilter) => {
    try {
      const result = await axios.post(baseURL + '/api/Orders/filter', dataFilter);
      return result.data.data;
    } catch (err) {
      console.error(err)
    }
  }, []);

  const OrderDetailFunc = useCallback(async (id) => {
    try {
      const result = await axios.get(baseURL + '/api/Orders/' + id);

      return result.data;
    } catch (error) {
      console.log(error);
    }
  }, []);

  const OrderUpdateFunc = useCallback(async(id, data) => {
    try {
        const result = await axios.post(`${baseURL}/api/Orders/${id}`, data);

        return result.data;
    } catch (error) {
        console.log(error);
    }
  }, []);

  const OrderDetailByUserFunc = useCallback(async(id) => {
    try {
      const result = await axios.get(`${baseURL}/api/Orders/get-by-account/${id}`);

      return result.data;
    } catch (error) {
      console.log(error);
    }
  }, []);

  const CreateOrder = useCallback(async(data) => {
    try {
      const result = await axios.post(`${baseURL}/api/Orders/insert`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return result.data;
    } catch (error) {
      console.log(error);
    }
  }, []);


  return {
    ListOrderFunc,
    OrderDetailFunc,
    OrderUpdateFunc,
    OrderDetailByUserFunc,
    CreateOrder
  }
}
