// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

/**
 ** Icons Imports:
 * ! You need to import all the icons which come from the API or from your server and then add these icons in 'icons' variable.
 * ! If you need all the icons from the library, use "import * as Icon from 'mdi-material-ui'"
 * */
import Abacus from 'mdi-material-ui/Abacus'
import { Zalo as Zalo } from 'src/utils/icons/zalo';
import { AcademicCap as AcademicCap } from 'src/utils/icons/academic-cap';
import { Adjustments as Adjustments } from 'src/utils/icons/adjustments';
import { Archive as Archive } from 'src/utils/icons/archive';
import { ArrowLeft as ArrowLeft } from 'src/utils/icons/arrow-left';
import { ArrowNarrowLeft as ArrowNarrowLeft } from 'src/utils/icons/arrow-narrow-left';
import { ArrowNarrowRight as ArrowNarrowRight } from 'src/utils/icons/arrow-narrow-right';
import { ArrowRight as ArrowRight } from 'src/utils/icons/arrow-right';
import UserLayout from 'src/layouts/UserLayout'

const icons = {
  Abacus,
  AcademicCap,
  Adjustments,
  Archive,
  ArrowLeft,
  ArrowNarrowLeft,
  ArrowNarrowRight,
  ArrowRight,
  Zalo
}

const Icons = () => {
  const renderIconGrids = () => {
    return Object.keys(icons).map(key => {
      const IconTag = icons[key]

      return (
        <Grid item key={key}>
          <Tooltip arrow title={key} placement='top'>
            <Card>
              <CardContent sx={{ display: 'flex' }}>
                <IconTag />
              </CardContent>
            </Card>
          </Tooltip>
        </Grid>
      )
    })
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link href='https://materialdesignicons.com/' target='_blank'>
            Material Design Icons
          </Link>
        </Typography>
        <Typography variant='body2'>Material Design Icons from the Community</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={6}>
          {renderIconGrids()}
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ textAlign: 'center' }}>
        <Button
          target='_blank'
          rel='noreferrer'
          component={Link}
          variant='contained'
          href='https://materialdesignicons.com/'
        >
          View All Material Design Icons
        </Button>
      </Grid>
    </Grid>
  )
}
Icons.getLayout = page => <UserLayout>{page}</UserLayout>

export default Icons
