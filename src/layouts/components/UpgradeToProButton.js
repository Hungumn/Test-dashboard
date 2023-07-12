// ** React Import
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import SaveIcon from '@mui/icons-material/Save'
import PrintIcon from '@mui/icons-material/Print'
import ShareIcon from '@mui/icons-material/Share'
import { Zalo as Zalo } from 'src/utils/icons/zalo'
import PhoneIcon from '@mui/icons-material/Phone'

// ** Third Party Imports
import { usePopper } from 'react-popper'

const actions = [
  { icon: <Zalo />, name: 'Zalo' },
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' }
]

const BuyNowButton = () => {
  // ** States
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      className='upgrade-to-pro-button mui-fixed'
      sx={{ right: theme => theme.spacing(20), bottom: theme => theme.spacing(10), zIndex: 11, position: 'fixed' }}
    >
      <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
        <SpeedDial
          ariaLabel='SpeedDial controlled open example'
          sx={{
            position: 'relative',
            bottom: 30,
            right: -50,
            zIndex: 1,
            color: '#ff3e1d',
            '& .MuiFab-primary': {
              boxShadow: '0 1px 20px 1px #ff3e1d !important',
              backgroundColor: '#ff3e1d !important',
            }
            // boxShadow: '0 1px 20px 1px #ff3e1d',
          }}
          icon={<PhoneIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
        >
          {actions.map(action => (
            <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} onClick={handleClose} />
          ))}
        </SpeedDial>
      </Box>
    </Box>
  )
}

export default BuyNowButton
