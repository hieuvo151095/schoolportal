import {
  Button,
  NavDrawer,
  NavDrawerBody,
  NavDrawerFooter,
  NavDrawerHeader,
  NavItem,
  Text,
  Tooltip,
  makeStyles,
  tokens,
  type OnNavItemSelectData,
} from '@fluentui/react-components'
import { ChevronLeftRegular, ChevronRightRegular } from '@fluentui/react-icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { navTree } from '../routes/routeConfig'

const COLLAPSED_WIDTH = 64
const EXPANDED_WIDTH = 260

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    height: '48px',
    paddingLeft: tokens.spacingHorizontalM,
    overflow: 'hidden',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
})

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const styles = useStyles()
  const navigate = useNavigate()
  const currentPath = useLocation().pathname

  function handleNavItemSelect(_: unknown, data: OnNavItemSelectData) {
    if (typeof data.value === 'string' && data.value.startsWith('/')) {
      navigate(data.value)
    }
  }

  return (
    <NavDrawer
      open
      type="inline"
      selectedValue={currentPath}
      onNavItemSelect={handleNavItemSelect}
      style={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH, flexShrink: 0 }}
    >
      <NavDrawerHeader>
        <div className={styles.header}>
          {!collapsed && <Text weight="semibold">Portal Nhập liệu Nhà trường</Text>}
        </div>
      </NavDrawerHeader>
      <NavDrawerBody>
        {navTree.map((entry) => (
          <Tooltip key={entry.path} content={entry.label} relationship="label">
            <NavItem value={entry.path} icon={<entry.icon />}>
              {collapsed ? '' : entry.label}
            </NavItem>
          </Tooltip>
        ))}
      </NavDrawerBody>
      <NavDrawerFooter>
        <div className={styles.footer}>
          <Tooltip content={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'} relationship="label">
            <Button
              appearance="subtle"
              icon={collapsed ? <ChevronRightRegular /> : <ChevronLeftRegular />}
              onClick={onToggleCollapse}
              aria-label={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
              aria-pressed={!collapsed}
            />
          </Tooltip>
        </div>
      </NavDrawerFooter>
    </NavDrawer>
  )
}
