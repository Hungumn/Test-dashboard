import { createContext, useCallback, useEffect, useReducer } from 'react'
import { useRouter } from 'next/router'
import { supabase } from 'src/utils/supabaseClient'
import { toast } from 'react-hot-toast'

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

console.log('initialState', initialState)

export const AuthProvider = props => {
  const { children } = props
  const [state, dispatch] = useReducer(reducer, initialState)
  const router = useRouter()

  const getUserInfo = useCallback(async () => {
    const {
      data: { session },
      error
    } = await supabase.auth.getSession()

    if (!session?.user) {
      console.log('User not logged in')
    }
    return session?.user
  }, [])

  const initialize = useCallback(async () => {
    try {
      if (!supabase.auth.getSession()) return
      const user = await getUserInfo()
      const {
        data: { userLogin }
      } = await supabase.auth.getUser()
      console.log('data getUser', userLogin)
      const { data, error } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url, role`)
        .eq('id', user?.id)
        .limit(1)
        .single()
      console.log('user...', data)
      if (data.delete_flag == 1) {
        await logout()
        router.replace('pages/login')
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null
          }
        })
        return
      }

      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          isAuthenticated: true,
          user: {
            id: user.id,
            role: data.role,
            email: user.email,
            avatar_url: data.avatar_url,
            username: data.username
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
      const user = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })

      const { data, error } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url, role, delete_flag`)
        .eq('id', user.data.user?.id)
        .limit(1)
        .single()
      const userLogin = {
        id: user.data.user.id,
        role: data.role,
        email: user.data.user.email,
        avatar_url: data.avatar_url,
        username: data.username
      }
      if (data?.delete_flag == 1) {
        await logout()
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null
          }
        })
        return
      }
      dispatch({
        type: ActionType.LOGIN,
        payload: {
          user: {
            id: user?.data?.user?.id,
            role: data?.role,
            email: user?.data?.user?.email,
            avatar_url: data?.avatar_url,
            username: data?.username
          }
        }
      })
      return userLogin
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
