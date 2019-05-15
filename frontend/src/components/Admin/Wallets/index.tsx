import { withNamespaces } from '../../../utils/i18n'
import Card from '../../Card'
import Flex from '../../Flex'
import Heading from '../../Heading'
import { Table } from '../../Table'

function Wallets({ t }) {
  const wallets = [
    { publicAddress: '0xFa6B8C282600f541ec23AE3c6C46EDC53FC82280' },
    { publicAddress: '1CWw3c12b5jYgw17u9BGxnpGDH5nzLNZy85FghTyH' },
    { publicAddress: '162N8onGgWtktqM4eWoYRo2qZjfw2UjiCxfGeretG8' },
    { publicAddress: '15ourr4ZfxUpuSBuet1kYgUpcCQiGkFKZsFGh89Jhg9' },
    { publicAddress: '1EktHUuqrNx4TGbntztC33d2f7bg8JkmpVfRt56vbt6' },
    { publicAddress: '5JqHM3PSTskSDgAsGEWpzCWQoqHwVkgLJWhYV' },
    { publicAddress: '162N8onGgWtktqM4eWoYRo2qZjfw2UjiCxfGeretG8' }
  ]

  return (
    <Card>
      <Flex justify="space-between">
        <Heading.Two>{t('wallets.title')}</Heading.Two>
      </Flex>
      <Table
        head={[t('wallets.table.rows', { returnObjects: true })]}
        width={['100%']}
        body={wallets}
        layout="admin"
      />
    </Card>
  )
}

export default withNamespaces('admin')(Wallets)
