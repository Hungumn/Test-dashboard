import { createContext, useCallback, useEffect, useReducer, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from 'src/utils/supabaseClient'
import { toast } from 'react-hot-toast'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import _ from 'lodash';

var ActionType
;(function (ActionType) {
  ActionType['INITIALIZE'] = 'INITIALIZE'
  ActionType['LOGIN'] = 'LOGIN'
  ActionType['LOGOUT'] = 'LOGOUT'
})(ActionType || (ActionType = {}))

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
}

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    }
  },
  LOGIN: (state, action) => {
    const { user } = action.payload
    return {
      ...state,
      isAuthenticated: true,
      user
    }
  },
  LOGOUT: state => ({
    ...state,
    isAuthenticated: false,
    user: null
  })
}

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state)

export const AuthContext = createContext({
  ...initialState,
  platform: 'Amplify',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  verifyCode: () => Promise.resolve()
})


const baseURL = process.env.NEXT_PUBLIC_URL
console.log('URL: ', baseURL)

export const AuthProvider = props => {
  const { children } = props
  const [state, dispatch] = useReducer(reducer, initialState)
  const router = useRouter()

  const getUserInfo = useCallback(async () => {
    // const {
    //   data: { session },
    //   error
    // } = await supabase.auth.getSession()

    // if (!session?.user) {
    //   console.log('User not logged in')
    // }
    // return session?.user
    const token = localStorage.getItem('TOKEN');
    if (_.isNull(token)) return
    const data = jwt_decode(token)
    console.log('userInfo',data)
    return data
  }, [])

  const initialize = useCallback(async () => {
    try {
      // if (!supabase.auth.getSession()) return
      const user = await getUserInfo()
      console.log('in auth context',user);
      // const {
      //   data: { userLogin }
      // } = await supabase.auth.getUser()
      // const { data, error } = await supabase
      //   .from('profiles')
      //   .select(`username, website, avatar_url, role`)
      //   .eq('id', user?.id)
      //   .limit(1)
      //   .single()
      // console.log('user...', data)
      // if (data.delete_flag == 1) {
      //   await logout()
      //   router.replace('pages/login')
      //   dispatch({
      //     type: ActionType.INITIALIZE,
      //     payload: {
      //       isAuthenticated: false,
      //       user: null
      //     }
      //   })
      //   return
      // }

      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          isAuthenticated: true,
          user: {
            role: user.role,
            // email: user.email,
            // avatar_url: data.avatar_url,
            username: user.name
          }
        }
      })
    } catch (error) {
      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          isAuthenticated: false,
          user: null
        }
      })
    }
  }, [])

  useEffect(() => {
    initialize()
  }, [])

  const login = async (email, password) => {
    try {
      // const user = await supabase.auth.signInWithPassword({
      //   email: email,
      //   password: password
      // })
      const data = await axios.post(`${baseURL}/api/Accounts/login`,{
        username: email,
        password: password
      })
      
      console.log(data);
      if (data.status == 200){
        localStorage.setItem('TOKEN',data.data.token);
      }
      const dataDecoded = jwt_decode(data.data.token);
      console.log('user in auth', dataDecoded);

      // const { data, error } = await supabase
      //   .from('profiles')
      //   .select(`username, website, avatar_url, role, delete_flag`)
      //   .eq('id', user.data.user?.id)
      //   .limit(1)
      //   .single()
      // const userLogin = {
      //   id: user.data.user.id,
      //   role: data.role,
      //   email: user.data.user.email,
      //   avatar_url: data.avatar_url,
      //   username: data.username
      // }
      // if (data?.delete_flag == 1) {
      //   await logout()
      //   dispatch({
      //     type: ActionType.INITIALIZE,
      //     payload: {
      //       isAuthenticated: false,
      //       user: null
      //     }
      //   })
      //   return
      // }
      dispatch({
        type: ActionType.LOGIN,
        payload: {
          user: {
            role: dataDecoded?.role,
            username: dataDecoded?.name
          }
        }
      })
      return data
    } catch (error) {
      console.log(error)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    dispatch({
      type: ActionType.LOGOUT
    })
  }

  const register = async (email, password, username) => {
    console.log('in auth...', { email, password, username })
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username,
          email: email
        }
      }
    })
    console.log({ data, error })
    return data
  }

  const verifyCode = async (email, code) => {
    try {
      const data = await supabase.auth.verifyOtp({ email: email, token: code, type: 'email' })
      return data
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'Supabase',
        login,
        logout,
        register,
        verifyCode,
        reloadUserInfo: initialize
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const AuthConsumer = AuthContext.Consumer
