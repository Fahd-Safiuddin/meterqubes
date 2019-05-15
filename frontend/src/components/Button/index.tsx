import { memo } from 'react'
import * as Styled from './style'
import { ButtonWithIconProps, ButtonWithTextProps } from './types'

/**
 * Render styled Button component with React.memo()
 *
 * @param {String} text
 * @param {String} icon (optional)
 * @param {String} theme (optional)
 * @param {String} className (optional)
 * @param {Boolean} fluid (optional)
 * @param {Boolean} round (optional)
 * @param {Boolean} outlined (optional)
 * @param {Boolean} transparent (optional)
 * @param {Boolean} disabled (optional)
 * @param {Function} onClick (optional)
 * @return {ReactNode} React.ReactNode
 */

function Button({
  text,
  icon,
  round,
  ...rest
}: ButtonWithIconProps | ButtonWithTextProps) {
  if (round) {
    return (
      <Styled.ButtonRound {...rest}>
        {icon && !!icon.match(/static\/img/gi) ? (
          <img src={icon} alt="" />
        ) : (
          <i className="material-icons">{icon}</i>
        )}
        {text && <span>{text}</span>}
      </Styled.ButtonRound>
    )
  }
  return (
    <Styled.Button {...rest}>
      {icon && !!icon.match(/static\/img/gi) ? (
        <img src={icon} alt="" />
      ) : (
        <i className="material-icons">{icon}</i>
      )}
      {text && <span>{text}</span>}
    </Styled.Button>
  )
}

export default memo(Button)
