import { makeStyles, tokens } from '@fluentui/react-components'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AppToaster } from './AppToaster'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100%',
  },
  contentColumn: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minWidth: 0,
  },
  main: {
    flexGrow: 1,
    overflow: 'auto',
    padding: tokens.spacingHorizontalXL,
    backgroundColor: tokens.colorNeutralBackground3,
  },
})

export function PortalShell() {
  const [collapsed, setCollapsed] = useState(false)
  const styles = useStyles()

  return (
    <div className={styles.root}>
      <AppToaster />
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((value) => !value)} />
      <div className={styles.contentColumn}>
        <Header />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
