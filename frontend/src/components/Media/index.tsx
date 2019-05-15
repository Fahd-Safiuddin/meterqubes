import { memo, ReactElement } from 'react'
import * as Styled from './style'
import Button from '../Button'
import { ButtonProps } from '../Button/types'

// Media component types
export type MediaProps = {
  title?: string
  text?: string | ReactElement
  image?: string
  object?: ReactElement
  align?: string
  style?: object
  size?: string
  rtl?: boolean
  vertical?: boolean
  button?: { text: string } & ButtonProps
}

/**
 * Render styled Media component with React.memo()
 *
 * @param {Title} title (optional)
 * @param {String} text (optional)
 * @param {String} image (optional)
 * @param {Object} button (optional) / require 2 keys: text: string; action: Function
 * @return {Component} React.ReactNode
 */

const Media = memo(
  ({ title, text, image, object, button, rtl, ...rest }: MediaProps) => (
    <Styled.Media {...rest} rtl={rtl}>
      {image && <Styled.MediaObject image={image} />}
      {object && <Styled.MediaObject object={object} />}
      <Styled.MediaBody>
        {title && <Styled.MediaHeading>{title}</Styled.MediaHeading>}
        {typeof text === 'string' ? (
          <Styled.MediaText>{text}</Styled.MediaText>
        ) : (
          text
        )}
        {button && (
          <Button
            text={button.text}
            size={button.size}
            theme={button.theme}
            onClick={button.onClick}
          />
        )}
      </Styled.MediaBody>
    </Styled.Media>
  )
)
export default Media
