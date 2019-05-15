import { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import Transition from 'react-transition-group/Transition'
import * as Styled from './style'
import Button from '../Button'
import { ModalProps, ModalStyleProps } from './types'
import { bind } from '../../utils/bind'

export default class Modal extends PureComponent<ModalProps & ModalStyleProps> {
  element = null

  public componentDidMount() {
    document.addEventListener('keydown', this.onEscape)
    this.setState(() => ({ isRendered: true }))
    this.element = this.props.portal
      ? document.querySelector(this.props.portal)
      : document.querySelector('body')
    this.forceUpdate()
  }

  public componentDidUpdate() {
    if (this.props.open && !this.props.portal) {
      this.element.classList.add('modal-open')
    }
  }

  public componentWillUnmount() {
    document.removeEventListener('keydown', this.onEscape)
  }

  @bind
  private onEscape({ keyCode }) {
    if (this.props.onClose && this.props.open && keyCode === 27) {
      this.onClose()
    }
  }

  @bind
  private onClose() {
    this.props.onClose && this.props.onClose()
    this.element.removeAttribute('class')
  }

  render() {
    const {
      open,
      title,
      onClose,
      children,
      portal,
      closeButton,
      ...rest
    } = this.props
    if (!this.element) return null
    return ReactDOM.createPortal(
      <Transition in={open} timeout={300}>
        {(state: string) =>
          state !== 'exited' && (
            <>
              <Styled.Modal state={state} {...rest}>
                {!portal && <Styled.Backdrop onClick={onClose} />}
                <Styled.Content>
                  {onClose && (
                    <Styled.ModalClose
                      icon="close"
                      onClick={this.onClose}
                      size="sm"
                      text=""
                    />
                  )}
                  <Styled.Title>{title}</Styled.Title>
                  {children}
                  {closeButton && (
                    <>
                      <br />
                      <br />
                      <Button
                        text={closeButton}
                        onClick={this.onClose}
                        theme="primary"
                      />
                    </>
                  )}
                </Styled.Content>
              </Styled.Modal>
              {portal && <Styled.Backdrop onClick={onClose} />}
            </>
          )
        }
      </Transition>,
      this.element
    )
  }
}

export { Styled as ModalStyled }
