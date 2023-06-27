// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'

// ** Config Imports
import themeConfig from 'src/configs/themeConfig'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import '../../styles/globals.css'
import 'src/assets/css/styles.scss'
import { useState } from 'react'
import 'swiper/swiper.scss'
import 'rc-slider/assets/index.css'
import 'react-rater/lib/react-rater.css'
import AuthContextProvider from '../@core/context/AuthContext'
import { wrapper } from 'store'
import { Toaster } from 'react-hot-toast';

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  // const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)
  const customRole = Component.customRole || 'admin'
  const getLayout = Component.getLayout ?? (page => page)

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{`${themeConfig.templateName} - Material Design React Admin Template`}</title>
        <meta
          name='description'
          content={`${themeConfig.templateName} – Material Design React Admin Dashboard Template – is the most developer friendly & highly customizable Admin Dashboard Template based on MUI v5.`}
        />
        <meta name='keywords' content='Material Design, MUI, Admin Template, React Admin Template' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <AuthContextProvider>
        <SettingsProvider>
          <SettingsConsumer>
            {({ settings }) => {
              return (
                <ThemeComponent settings={settings}>
                  <Toaster position='top-center' />
                  {getLayout(<Component customRole={customRole} {...pageProps} />)}
                </ThemeComponent>
              )
            }}
          </SettingsConsumer>
        </SettingsProvider>
      </AuthContextProvider>
    </CacheProvider>
  )
}

export default wrapper.withRedux(App)
