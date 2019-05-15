import { useState } from 'react'
import Card from '../../Card'
import Input from '../../Input'
import Button from '../../Button'
import Text from '../../Text'
import { withNamespaces } from '../../../utils/i18n'
import * as Styled from './style'
import { AddTokenTypes } from './types'
import Heading from '../../Heading'

function AddToken({ t }) {
  const initialState: AddTokenTypes = {
    tokenName: '',
    logo: '',
    smartContract: '',
    decimals: ''
  }

  const [values, setValue] = useState(initialState)

  const handleChange = (value: string, name: string) => {
    setValue({
      ...values,
      [name]: value
    })
  }

  return (
    <Card>
      <Heading.Two>{t('addToken.title')}</Heading.Two>
      <Styled.Wrapp>
        <Text size="sm">{t('addToken.description')}</Text>
        <div>
          {Object.keys(initialState).map(k => {
            if (k === 'logo') {
              return (
                <Styled.InputGroup key={k}>
                  <Input
                    type="file"
                    label={t(`addToken.form.${k}`)}
                    name={k}
                    icon="photo"
                    value={values[k]}
                    onChange={handleChange}
                    fluid
                  />
                  <Input
                    type="number"
                    label="&nbsp;"
                    name={k}
                    value={values[k]}
                    onChange={handleChange}
                    fluid
                  />
                </Styled.InputGroup>
              )
            }
            return (
              <Input
                key={k}
                type="number"
                label={t(`addToken.form.${k}`)}
                name={k}
                value={values[k]}
                onChange={handleChange}
                fluid
              />
            )
          })}
        </div>
        <Button
          theme="primary"
          size="lg"
          text={t('addToken.form.button')}
          onClick={() => {}}
        />
      </Styled.Wrapp>
    </Card>
  )
}

export default withNamespaces('admin')(AddToken)
