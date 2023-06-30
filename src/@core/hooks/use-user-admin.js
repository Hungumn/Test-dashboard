import { useState, useEffect, useCallback } from 'react';
import { supabase } from 'src/utils/supabaseClient';

export function useUsersAdminFunc() {
	const createStudent = useCallback(async (email,password,username) => {
		try {
			const { data, error } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        user_metadata: { username: username, role:'client' }
      })
			return data;
		} catch (err) {
			console.error(err);
			throw err;
		}
	}, []);

	const resendEmailSignup = useCallback(async (email) => {
		try {
			const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })
			return data
		} catch (err) {
			console.error(err);
			throw err;
		}
	}, []);

  const ListUserAdminFunc = useCallback(async () => {
		try {
			const { data: { users }, error } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 10
      })
			return {users}
		} catch (err) {
			console.error(err);
			throw err;
		}
	}, []);



	return {
		createStudent,
		resendEmailSignup,
    ListUserAdminFunc
	};
}
