import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './use-auth';


export const AuthGuard = (props) => {
	const { children, role } = props;
	const auth = useAuth();
	console.log('auth...',auth);
	console.log('role in auth guard...',role);
	const router = useRouter();
	const [checked, setChecked] = useState(false);

	useEffect(
		() => {
			if (!router.isReady) {
				return;
			}
			if (!auth.isAuthenticated) {
				router
					.push({
						pathname: 'pages/login',
						query: { returnUrl: router.asPath },
					})
					.catch(console.error);
			} else {
				
				const group = auth.user.role;
				console.log('auth...',group);
				if (role && role != group) {
					let pathName = '/login';
					switch (group) {
						case 'admin':
							pathName = 'pages/login';
							break;
						case 'client':
							pathName = 'pages/login';
							break;
					}
					router.replace(pathName).catch(console.error);
					return;
				}
				setChecked(true);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[router.isReady, role, auth],
	);

	if (!checked) {
		return null;
	}

	// If got here, it means that the redirect did not occur, and that tells us that the user is
	// authenticated / authorized.

	return <>{children}</>;
};