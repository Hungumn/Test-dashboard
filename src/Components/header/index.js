import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import Logo from '../../assets/icons/logo'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { RootState } from 'store'
import useOnClickOutside from 'use-onclickoutside'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import { useAuth } from 'src/@core/hooks/use-auth'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import LoginIcon from '@mui/icons-material/Login';
import { useUsersAdminFunc } from 'src/@core/hooks/use-user-admin'

const path = process.env.NEXT_PUBLIC_S3_URL

const Header = ({ isErrorPage }) => {
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)
  const { cartItems } = useSelector(state => state.cart)
  const arrayPaths = ['/']
  const user = useAuth()
  const userId = user?.user?.id
  const [userDetailAdmin, setUserDetailAdmin] = useState()
  const { detailUserAdminFunc } = useUsersAdminFunc()

  const [onTop, setOnTop] = useState(!arrayPaths.includes(router.pathname) || isErrorPage ? false : true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const navRef = useRef(null)
  const searchRef = useRef(null)

  const headerClass = () => {
    if (window.pageYOffset === 0) {
      setOnTop(true)
    } else {
      setOnTop(false)
    }
  }

  useEffect(() => {
    if (!arrayPaths.includes(router.pathname) || isErrorPage) {
      return
    }

    headerClass()
    window.onscroll = function () {
      headerClass()
    }
  }, [])

  useEffect(async () => {
    if (user.user?.id) {
      setIsAuth(true)
    }
    const userDetailAdmin = await detailUserAdminFunc(userId)
    if (userId) {
      console.log('header admin',userId);
      setUserDetailAdmin(userDetailAdmin)
    }
  }, [userId])


  const closeMenu = () => {
    setMenuOpen(false)
  }

  const closeSearch = () => {
    setSearchOpen(false)
  }

  // on click outside
  useOnClickOutside(navRef, closeMenu)
  useOnClickOutside(searchRef, closeSearch)

  return (
    <header className={`site-header ${!onTop ? 'site-header--fixed' : ''}`}>
      <div className='container'>
        <Link href='/home-page'>
          <a>
            <h1 className='site-logo'>
              <Logo />
              E-Shop
            </h1>
          </a>
        </Link>
        <nav ref={navRef} className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`}>
          <Link href='/products'>
            <a>Products</a>
          </Link>
          <a href='#'>Inspiration</a>
          <a href='#'>Rooms</a>
          <button className='site-nav__btn'>
            <p>Account</p>
          </button>
        </nav>

        <div className='site-header__actions'>
          <button ref={searchRef} className={`search-form-wrapper ${searchOpen ? 'search-form--active' : ''}`}>
            <form className={`search-form`}>
              <i className='icon-cancel' onClick={() => setSearchOpen(!searchOpen)}></i>
              <input type='text' name='search' placeholder='Enter the product you are looking for' />
            </form>
            <i onClick={() => setSearchOpen(!searchOpen)} className='icon-search'></i>
          </button>
          <Link href='/cart'>
            <button className='btn-cart'>
              <i className='icon-cart'></i>
              {cartItems.length > 0 && <span className='btn-cart__count'>{cartItems.length}</span>}
            </button>
          </Link>
          {isAuth ? (
            <UserDropdown user={userDetailAdmin} />
          ) : (
            <>
              <Link href='pages/register'>
                <button className='site-header__btn-avatar' style={{ fontSize: '35px' }}>
                  <AccountPlusOutline sx={{ fontSize: '26px' }} />
                </button>
              </Link>
              <Link href='pages/login'>
                <button className='site-header__btn-avatar' style={{ fontSize: '35px' }}>
                  <LoginIcon sx={{ fontSize: '26px' }} />
                </button>
              </Link>
            </>
          )}

          <button onClick={() => setMenuOpen(true)} className='site-header__btn-menu'>
            <i className='btn-hamburger'>
              <span></span>
            </i>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
