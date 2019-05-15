import { Component } from 'react'
import * as Styled from './style'
import Heading from '../Heading'
import { withNamespaces, I18nTProps } from '../../utils/i18n'
import Card from '../Card'
import Media from '../Media'
import Select from '../Select'
import { colors } from '../../styles/colors'
import Button from '../Button'
import ModalSuccess from './ModalSuccess'
import ModalConfirm from './ModalConfirm'
import Input from '../Input'
import { ItemTypes } from '../Select/types'
import { bind } from '../../utils/bind'

export interface TokenTypes extends ItemTypes {}

interface ExchangeProps {
  tokens: TokenTypes[]
  t: I18nTProps
  disabled?: boolean
}

interface ExchangeState {
  give: TokenTypes
  receive: TokenTypes
  modalOpen: string
}

@withNamespaces('exchange')
export default class Exchange extends Component<ExchangeProps, ExchangeState> {
  public constructor(props: ExchangeProps) {
    super(props)

    const initialState = {
      id: props.tokens[0].id,
      label: props.tokens[0].label || null,
      image: props.tokens[0].image || null
    }

    this.state = {
      give: initialState,
      receive: initialState,
      modalOpen: null
    }
  }

  @bind private handleSelect(type: string, id: number) {
    if (type === 'give') {
      this.setState(({ give }) => ({
        give: { ...give, id, image: this.getImage(id) }
      }))
    } else if (type === 'receive') {
      this.setState(({ receive }) => ({
        receive: { ...receive, id, image: this.getImage(id) }
      }))
    }
  }

  @bind private getImage(id: number) {
    return this.props.tokens.find(item => id === item.id).image
  }

  @bind private reverseTokens() {
    this.setState(({ give, receive }) => ({
      give: { ...receive },
      receive: { ...give }
    }))
  }

  @bind private handleToggleModal(modalOpen: string) {
    this.setState({ modalOpen })
  }

  public render() {
    const { give, receive, modalOpen } = this.state
    const { t, tokens, disabled } = this.props

    const modalSuccessProps = {
      value: 100.0,
      from: {
        tokenName: 'Decred'
      },
      to: {
        tokenName: 'Huobi Token',
        tokenAddress: '0xf028adee51533b1b47beaa890feb54a457f51e89'
      }
    }

    const modalConfirmProps = {
      value: 100.0,
      from: {
        tokenName: 'Decred'
      },
      to: {
        tokenName: 'Huobi Token',
        tokenAddress: '0xf028adee51533b1b47beaa890feb54a457f51e89'
      }
    }

    return (
      <Styled.Wrapp>
        <Heading.One>{t('title')}</Heading.One>
        <Card>
          <Styled.Exchange>
            <div>
              <Media image={give.image} text={t('give')} size="lg" vertical />
              <Select
                addon={
                  <Input
                    onChange={() => {}}
                    type="number"
                    name=""
                    placeholder="0.00"
                    disabled={disabled}
                  />
                }
                items={tokens}
                selected={give.id}
                onSearch={() => {}}
                onSelect={id => this.handleSelect('give', id)}
              />
            </div>
            <Styled.ExchangeDivider onClick={this.reverseTokens}>
              <svg
                width="51"
                height="41"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M49.977 13.818L37.477 1.2a1.774 1.774 0 0 0-2.525 0 1.81 1.81 0 0 0-.523 1.275v5.407h-12.5c-.987 0-1.786.807-1.786 1.803 0 .995.8 1.802 1.785 1.802h14.287c.986 0 1.785-.807 1.785-1.802v-2.86l8.19 8.267L38 23.36v-2.86c0-.995-.8-1.802-1.785-1.802H16.57V13.29c0-.996-.8-1.803-1.786-1.802-.473 0-.927.19-1.262.527l-12.5 12.618a1.814 1.814 0 0 0 0 2.549l12.5 12.617a1.777 1.777 0 0 0 1.947.392 1.803 1.803 0 0 0 1.101-1.666v-5.407h12.5c.987 0 1.786-.808 1.786-1.803 0-.996-.8-1.803-1.785-1.803H14.786c-.987 0-1.786.807-1.786 1.803v2.859l-8.19-8.267L13 17.641V20.5c0 .995.8 1.802 1.786 1.802h19.643v5.408c0 .995.8 1.802 1.786 1.802.473 0 .927-.19 1.262-.528l12.5-12.617a1.815 1.815 0 0 0 0-2.55z"
                  fill={colors.primary}
                  opacity=".7"
                />
              </svg>
            </Styled.ExchangeDivider>
            <div>
              <Media
                image={receive.image}
                text={t('receive')}
                size="lg"
                vertical
              />
              <Select
                addon={
                  <Input
                    onChange={() => {}}
                    type="number"
                    name=""
                    placeholder="0.00"
                    disabled={disabled}
                  />
                }
                items={tokens}
                selected={receive.id}
                onSelect={id => this.handleSelect('receive', id)}
              />
            </div>
          </Styled.Exchange>
          <Button
            text={t('button')}
            onClick={() => this.handleToggleModal('modalConfirm')}
            theme="primary"
            size="lg"
            disabled={disabled}
          />
        </Card>

        <ModalConfirm
          open={modalOpen === 'modalConfirm'}
          onClose={() => this.handleToggleModal('modalSuccess')}
          {...modalConfirmProps}
        />
        <ModalSuccess
          open={modalOpen === 'modalSuccess'}
          onClose={() => this.handleToggleModal(null)}
          {...modalSuccessProps}
        />
      </Styled.Wrapp>
    )
  }
}
