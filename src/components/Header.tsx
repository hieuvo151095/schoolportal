import {
  Avatar,
  Breadcrumb,
  BreadcrumbButton,
  BreadcrumbDivider,
  BreadcrumbItem,
  Button,
  Menu,
  MenuDivider,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import { SignOutRegular } from '@fluentui/react-icons'
import { Fragment } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getBreadcrumbTrail } from '../routes/routeConfig'
import { getSession, logout } from '../storage/session'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '56px',
    flexShrink: 0,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalM,
  },
  avatarButton: {
    minWidth: 0,
    padding: 0,
  },
})

export function Header() {
  const styles = useStyles()
  const navigate = useNavigate()
  const trail = getBreadcrumbTrail(useLocation().pathname)
  const session = getSession()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className={styles.root}>
      <Breadcrumb>
        {trail.map((item, index) => (
          <Fragment key={item.label}>
            <BreadcrumbItem>
              {item.path && index < trail.length - 1 ? (
                <BreadcrumbButton onClick={() => navigate(item.path!)}>{item.label}</BreadcrumbButton>
              ) : (
                <BreadcrumbButton current>{item.label}</BreadcrumbButton>
              )}
            </BreadcrumbItem>
            {index < trail.length - 1 && <BreadcrumbDivider />}
          </Fragment>
        ))}
      </Breadcrumb>

      <div className={styles.right}>
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <Button appearance="subtle" className={styles.avatarButton}>
              <Avatar name={session?.tenTruong ?? 'Trường'} color="colorful" />
            </Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem disabled>{session?.tenTruong ?? ''}</MenuItem>
              <MenuDivider />
              <MenuItem icon={<SignOutRegular />} onClick={handleLogout}>
                Đăng xuất
              </MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>
    </header>
  )
}
