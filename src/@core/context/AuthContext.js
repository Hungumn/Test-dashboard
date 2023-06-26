import { useRouter } from 'next/router';
import { createContext, useEffect, useReducer } from 'react';
import { supabase } from 'src/utils/supabaseClient';

const initialAuthState = {
  isAuthentication: false,
  formType: 'login',
  session: null,
  isInitialized: false,
  userDetails: null,
};

var ActionType;
(function (ActionType) {
	ActionType['INITIALIZE'] = 'INITIALIZE';
	ActionType['LOGIN'] = 'LOGIN';
	ActionType['LOGOUT'] = 'LOGOUT';
})(ActionType || (ActionType = {}));

export const AuthContext = createContext({
  state: initialAuthState,
  dispatch: () => {},
});



const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        session: action.session,
        isAuthentication:true,
      };
    case 'LOGOUT':
      return {
        ...state,
        session: null,
        isAuthentication: false,
      };
    case 'SET_USER_DETAILS':
      return {
        ...state,
        userDetails: action.userDetails,
      };
  }
};


const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const router = useRouter();

  useEffect(() => {
    dispatch({ type: 'LOGIN', session: supabase.auth.getSession() });
    supabase.auth.onAuthStateChange((event, session) => {
      dispatch({ type: 'LOGIN', session });
    });
  }, []);

  useEffect(() => {
    if (!supabase.auth.getSession()) return;
    (async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'example@email.com',
        password: 'example-password',
      })
      if (error) return;
      dispatch({ type: 'SET_USER_DETAILS', userDetails: data[0] });
    })();
  }, [state.session]);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
