import { useState, ReactNode, Fragment } from 'react'
import * as Styled from './style'

export type TabLinkProps = {
  name: string
  label: string
  active?: boolean
  onClick?: () => void
}

type TabContentProps = { name: string; content: ReactNode }

type TabsProps = {
  tabLink: TabLinkProps[]
  tabContent: TabContentProps[]
  defaultTab?: string
}

const Tabs = ({
  tabLink,
  tabContent,
  defaultTab,
  layout
}: TabsProps & { layout?: string }) => {
  const [activeTab, toggleTab] = useState(defaultTab || tabLink[0].name)
  return (
    <Styled.Tabs layout={layout}>
      <Styled.TabLinkRow>
        {Array.isArray(tabLink) &&
          tabLink.map(({ name, label }: TabLinkProps, i: number) => (
            <Styled.TabLink
              key={i}
              active={name === activeTab}
              onClick={() => toggleTab(name)}
            >
              {label}
            </Styled.TabLink>
          ))}
      </Styled.TabLinkRow>
      <Styled.TabContent>
        {tabContent.map(
          ({ name, content }: TabContentProps, i: number) =>
            name === activeTab && <Fragment key={i}>{content}</Fragment>
        )}
      </Styled.TabContent>
    </Styled.Tabs>
  )
}

export default Tabs
