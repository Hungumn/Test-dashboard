import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'
import login from 'src/pages/api/login'

export function useUsersAdminFunc() {
  const baseURL = process.env.NEXT_PUBLIC_URL
  const token = localStorage.getItem('TOKEN')

  const ListUserAdminFunc = useCallback(async () => {
    const dataFilter = {
      name: '',
      page: 1,
      limit: 1000
    }
    try {
      const userList = await axios.post(baseURL + '/api/Accounts/filter', dataFilter, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      return userList.data.data
    } catch (err) {
      console.error(err)
    }
  }, [])

  const deleteUserAdminFunc = useCallback(async userId => {
    const dataFilter = [userId]
    try {
      const user = await axios.post(baseURL + '/api/Accounts/delete', dataFilter, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log('respond', user.status)
      return user.status
    } catch (err) {
      console.error(err)
    }
  }, [])

  const detailUserAdminFunc = useCallback(async userId => {
    try {
      const user = await axios.get(`${baseURL}/api/Accounts/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log('respond', user)
      return user.data
    } catch (err) {
      console.error(err)
    }
  }, [])

  const updateUserAdminFunc = useCallback(async (userId, dataUpdate) => {
    try {
      console.log('data post update', {dataUpdate,userId})
      const data = await axios.post(`${baseURL}/api/Accounts/update/${userId}`, dataUpdate, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log('respond', data)
      return data.status
    } catch (err) {
      console.error(err)
    }
  }, [])

  return {
    ListUserAdminFunc,
    deleteUserAdminFunc,
    detailUserAdminFunc,
    updateUserAdminFunc
  }
}
