import { useState } from 'react'
import Grid from '../../Grid'
import Card from '../../Card'
import Input from '../../Input'
import Button from '../../Button'
import Text from '../../Text'
import { withNamespaces } from '../../../utils/i18n'
import * as Styled from './style'
import { MainInfoTypes } from './types'
import Heading from '../../Heading'
import { copyToClipboard } from '../../../utils/copyToClipboard'

function MainInfo({ t }) {
  const initialState: MainInfoTypes = {
    transaction: '2.5%',
    exchange: '1.9%',
    voting: '1.5%',
    votingLimit: '1000v',
    publicAddress: '0xFa6B8C282600f541ec23AE3c6C46EDC53FC82280'
  }

  const [values, setValue] = useState(initialState)
  const [disabled, handleToggleDisabled] = useState(true)

  const handleChange = (value: string, name: string) => {
    setValue({
      ...values,
      [name]: value
    })
  }

  const onFocus = ({ target: { name } }) => {
    let value: string

    if (name === 'votingLimit') {
      value = values[name].split('v')[0]
    } else {
      value = values[name].split('%')[0]
    }

    setValue({
      ...values,
      [name]: value && value
    })
  }

  const onBlur = ({ target: { name } }) => {
    let value

    if (name === 'votingLimit') {
      value = `${values[name].split('v')[0]}v`
    } else {
      value = `${values[name].split('%')[0]}%`
    }

    setValue({
      ...values,
      [name]: value && value
    })
  }

  return (
    <Grid layout="main-info">
      <Card>
        <Styled.InputGroup layout="mainInfo">
          <Input
            type="number"
            label={t('mainInfo.transaction.title')}
            name="transaction"
            value={values.transaction}
            onChange={handleChange}
            onBlur={onBlur}
            onFocus={onFocus}
            theme="transparent"
          />
          {values.transaction !== initialState.transaction && (
            <Button
              size="sm"
              theme="primary"
              transparent
              text={t('mainInfo.buttons.save')}
              onClick={() => {}}
            />
          )}
        </Styled.InputGroup>
      </Card>
      <Card>
        <Styled.InputGroup layout="mainInfo">
          <Input
            type="number"
            label={t('mainInfo.exchange.title')}
            name="exchange"
            value={values.exchange}
            onChange={handleChange}
            onBlur={onBlur}
            onFocus={onFocus}
            theme="transparent"
          />
          {values.exchange !== initialState.exchange && (
            <Button
              size="sm"
              theme="primary"
              transparent
              text={t('mainInfo.buttons.save')}
              onClick={() => {}}
            />
          )}
        </Styled.InputGroup>
      </Card>
      <Card>
        <Styled.InputGroup layout="mainInfo">
          <Input
            type="number"
            label={t('mainInfo.voting.title')}
            name="voting"
            value={values.voting}
            onChange={handleChange}
            onBlur={onBlur}
            onFocus={onFocus}
            theme="transparent"
          />
          {values.voting !== initialState.voting && (
            <Button
              size="sm"
              theme="primary"
              transparent
              text={t('mainInfo.buttons.save')}
              onClick={() => {}}
            />
          )}
        </Styled.InputGroup>
      </Card>
      <Card>
        <Styled.InputGroup layout="mainInfo">
          <Input
            type="number"
            label={t('mainInfo.votingLimit.title')}
            name="votingLimit"
            value={values.votingLimit}
            onChange={handleChange}
            onBlur={onBlur}
            onFocus={onFocus}
            theme="transparent"
          />
          {values.votingLimit !== initialState.votingLimit && (
            <Button
              size="sm"
              theme="primary"
              transparent
              text={t('mainInfo.buttons.save')}
              onClick={() => {}}
            />
          )}
        </Styled.InputGroup>
      </Card>
      <Card>
        <Heading.Two>{t('mainInfo.wallet.title')}</Heading.Two>
        <Styled.InputGroup layout="wallet">
          <Button
            icon="edit"
            theme="default"
            size="sm"
            onClick={() => handleToggleDisabled(!disabled)}
          />
          <div>
            <Text size="sm" color="text" weight="medium">
              {t('mainInfo.wallet.currentBalance')}
            </Text>
            <Heading.One>12,326.00 ETH</Heading.One>
            <Heading.Three>12,326.00 $</Heading.Three>
          </div>
          <div>
            <Input
              label={t('mainInfo.wallet.address')}
              name="publicAddress"
              value={values.publicAddress}
              onChange={handleChange}
              fluid
              disabled={disabled}
              addon={
                disabled ? (
                  <Button
                    theme="primary"
                    transparent
                    text={t('mainInfo.buttons.copy')}
                    onClick={() => copyToClipboard(values.publicAddress)}
                  />
                ) : (
                  <Button
                    theme="primary"
                    transparent
                    text={t('mainInfo.buttons.save')}
                    onClick={() => handleToggleDisabled(true)}
                  />
                )
              }
            />
          </div>
        </Styled.InputGroup>
      </Card>
    </Grid>
  )
}

export default withNamespaces('admin')(MainInfo)
