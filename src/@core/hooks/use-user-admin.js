import axios from 'axios'
import { useState, useEffect, useCallback } from 'react'
import login from 'src/pages/api/login'
import { supabase } from 'src/utils/supabaseClient'

export function useUsersAdminFunc() {
  const baseURL = process.env.NEXT_PUBLIC_URL

  const ListUserAdminFunc = useCallback(async () => {
    const token = localStorage.getItem('TOKEN')
    console.log('token', token)
    try {
      const userList = await axios.get(baseURL + '/api/Accounts/filter', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
			console.log('userList', userList);
    } catch (err) {
      console.error(err)
      throw err
    }
  }, [])

  return {
    ListUserAdminFunc
  }
}
