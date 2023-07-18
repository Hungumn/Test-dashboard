// ** MUI Imports
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
// !Do not remove this Layout import
import VerticalLayout from 'src/@core/layouts/VerticalLayout'

// ** Navigation Imports
import VerticalNavItems from 'src/navigation/vertical'

// ** Component Import
import UpgradeToProButton from './components/UpgradeToProButton'
import VerticalAppBarContent from './components/vertical/AppBarContent'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import ControlledOpenSpeedDial from 'src/Components/widgets/speed-dial'
import { useState } from 'react'
import { useAuth } from 'src/@core/hooks/use-auth'
import { useUsersAdminFunc } from 'src/@core/hooks/use-user-admin'
import { useEffect } from 'react'

const UserLayout = ({ children }) => {
  // ** Hooks
  const [isAuth, setIsAuth] = useState(false)
  const user = useAuth()
  const userId = user?.user?.id
  const [userDetailAdmin, setUserDetailAdmin] = useState()
  const { detailUserAdminFunc } = useUsersAdminFunc()
  const { settings, saveSettings } = useSettings()

  useEffect(async () => {
    if (user.user?.id) {
      setIsAuth(true)
    }
    const userDetailAdmin = await detailUserAdminFunc(userId)
    if (userId) {
      setUserDetailAdmin(userDetailAdmin)
    }
  }, [])

  /**
   *  The below variable will hide the current layout menu at given screen size.
   *  The menu will be accessible from the Hamburger icon only (Vertical Overlay Menu).
   *  You can change the screen size from which you want to hide the current layout menu.
   *  Please refer useMediaQuery() hook: https://mui.com/components/use-media-query/,
   *  to know more about what values can be passed to this hook.
   *  ! Do not change this value unless you know what you are doing. It can break the template.
   */
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
  console.log(children);

  return (
    <VerticalLayout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      
      verticalNavItems={VerticalNavItems()} // Navigation Items
      verticalAppBarContent={(
        props // AppBar Content
      ) => (
        <VerticalAppBarContent
          hidden={hidden}
          settings={settings}
          saveSettings={saveSettings}
          toggleNavVisibility={props.toggleNavVisibility}
          userDetailAdmin={userDetailAdmin}
        />
      )}
    >
      {children}
      {/* <UpgradeToProButton /> */}
    </VerticalLayout>
  )
}

export default UserLayout
