import { withNamespaces } from '../../../utils/i18n'
import Card from '../../Card'
import Flex from '../../Flex'
import Heading from '../../Heading'
import { Table } from '../../Table'
import Tabs from '../../Tabs'
import * as Styled from './style'

type ITransaction = {
  pair: string
  type: string
  price: string
  amount: string
  dateTime: string
}

function Transactions({ t }) {
  const transactions: ITransaction[] = [
    {
      pair: 'XMX-ETH',
      type: 'BUY',
      price: '0.0000466821',
      amount: '100.00',
      dateTime: '02/07/2018  11:47'
    },
    {
      pair: 'XMX-ETH',
      type: 'SELL',
      price: '0.0000466821',
      amount: '100.00',
      dateTime: '02/07/2018  11:47'
    }
  ]

  const width = ['25%', '15%', '20%', '20%', '20%']

  const renderTabContent = (body: ITransaction[]) => {
    return (
      <Table
        head={t('transactions.table.rows', { returnObjects: true })}
        width={width}
        body={body}
        layout="admin"
      />
    )
  }

  const tabs = t('transactions.tabs', { returnObjects: true })

  return (
    <Card>
      <Styled.Wrapper>
        <Flex justify="space-between">
          <Heading.Two>{t('transactions.title')}</Heading.Two>
        </Flex>

        <Tabs
          defaultTab="all"
          tabLink={
            Array.isArray(tabs) &&
            tabs.map((label: string) => ({
              name: label.toLowerCase().replace(' ', '_'),
              label
            }))
          }
          tabContent={[
            {
              name: 'sell',
              content: renderTabContent(
                transactions.filter(({ type }) => type === 'SELL')
              )
            },
            {
              name: 'buy',
              content: renderTabContent(
                transactions.filter(({ type }) => type === 'BUY')
              )
            },
            {
              name: 'exchange',
              content: renderTabContent(
                transactions.filter(({ type }) => type === 'EXCHANGE')
              )
            },
            {
              name: 'all',
              content: renderTabContent(transactions)
            }
          ]}
        />
      </Styled.Wrapper>
    </Card>
  )
}

export default withNamespaces('admin')(Transactions)
