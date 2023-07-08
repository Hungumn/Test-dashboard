import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'
import login from 'src/pages/api/login'
import { supabase } from 'src/utils/supabaseClient'

export function useUsersAdminFunc() {
  const baseURL = process.env.NEXT_PUBLIC_URL

  const ListUserAdminFunc = useCallback(async () => {
    const token = localStorage.getItem('TOKEN')
    const dataFilter = {
      name:'',
      page:1,
      limit:10
    }
    console.log('token', token)
    try {
      const userList = await axios.post(baseURL + '/api/Accounts/filter',dataFilter, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      return userList.data.data
    } catch (err) {
      console.error(err)
    }
  }, [])

  return {
    ListUserAdminFunc
  }
}
