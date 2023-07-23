// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'
import HomeAccount from 'mdi-material-ui/HomeAccount'
import AccountBoxMultiple from 'mdi-material-ui/AccountBoxMultiple'
import TreasureChest from 'mdi-material-ui/TreasureChest'

const navigation = () => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/'
    },
    {
      title: 'Account Settings',
      icon: AccountCogOutline,
      path: '/account-settings'
    },
    {
      title: 'Products',
      icon: TreasureChest,
      path: '/products-admin'
    },
    {
      title: 'Users',
      icon: AccountBoxMultiple,
      path: '/list-user-admin'
    },
    {
      sectionTitle: 'Pages'
    },
    {
      title: 'Categories',
      icon: TreasureChest,
      path: '/categories-admin',
      openInNewTab: true
    },
    {
      title: 'Materials',
      icon: TreasureChest,
      path: '/materials-admin',
      openInNewTab: true
    },
    {
      title: 'Technicals',
      icon: TreasureChest,
      path: '/technicals-admin',
      openInNewTab: true
    },
    {
      title: 'Orders',
      icon: TreasureChest,
      path: '/orders-admin',
      openInNewTab: true
    },
    // {
    //   title: 'Login',
    //   icon: Login,
    //   path: '/pages/login',
    //   openInNewTab: true
    // },
    // {
    //   title: 'Register',
    //   icon: AccountPlusOutline,
    //   path: '/pages/register',
    //   openInNewTab: true
    // },
    // {
    //   title: 'Index Client',
    //   icon: HomeAccount,
    //   path: '/home-page',
    //   openInNewTab: true
    // },
    // {
    //   title: 'Error',
    //   icon: AlertCircleOutline,
    //   path: '/pages/error',
    //   openInNewTab: true
    // },
    // {
    //   title: 'Error',
    //   icon: AlertCircleOutline,
    //   path: '/pages/error',
    //   openInNewTab: true
    // },
    // {
    //   sectionTitle: 'User Interface'
    // },
    // {
    //   title: 'Typography',
    //   icon: FormatLetterCase,
    //   path: '/typography'
    // },
    // {
    //   title: 'Icons',
    //   path: '/icons',
    //   icon: GoogleCirclesExtended
    // },
    // {
    //   title: 'Cards',
    //   icon: CreditCardOutline,
    //   path: '/cards'
    // },
    // {
    //   title: 'Tables',
    //   icon: Table,
    //   path: '/tables'
    // },
    // {
    //   icon: CubeOutline,
    //   title: 'Form Layouts',
    //   path: '/form-layouts'
    // }
  ]
}

export default navigation
