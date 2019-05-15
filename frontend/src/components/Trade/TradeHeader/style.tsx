import styled, { css } from 'styled-components'
import { colors } from '../../../styles/colors'
import { Button } from '../../Button/style'
import { getColor } from '../../../utils/colorByValue'
import Text from '../../Text'

export const Header = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const Title = styled('h3')`
  font-size: 1.375em;
  margin-bottom: 0;
  display: flex;
  flex: 1;
  font-weight: 600;

  ${({ align }: { align: string }) =>
    align &&
    css`
      align-items: ${align};
    `}

  @media (max-width: 1500px) {
    font-size: 1.25rem;
  }
`

export const Article = styled(
  ({
    title,
    text,
    sum,
    percent,
    ...rest
  }: {
    title: string
    text: string
    sum: string
    percent: string | number | null
  }) => (
    <article {...rest}>
      <h4>{title}</h4>
      <Text>
        {text} &nbsp;&nbsp;{!!sum && <span>${sum}</span>}
        {percent !== 0 && percent !== null && <span>{percent}</span>}
      </Text>
    </article>
  )
)<{ percent: string | null; sum: string | number }>`
  padding: 0 0.25rem;

  h4 {
    font-size: 0.875rem;
    color: ${colors.text};
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    font-weight: 500;
    margin-bottom: 0;
    font-size: 0.875em;
    color: ${({ percent, sum, theme }) => {
      if (theme === 'night') {
        return !sum ? `${getColor(percent)} !important` : colors.white
      } else {
        return !sum ? `${getColor(percent)} !important` : colors.dark
      }
    }};

    span {
      font-size: ${({ sum }) => (sum ? '0.75rem' : 'inherit')};
      color: ${({ percent, sum }) =>
        (!sum && getColor(percent)) || colors.text};
    }
  }
`

export const Row = styled('div')`
  display: flex;
  min-width: 60%;
  justify-content: space-between;
`

export const Controls = styled('div')`
  display: flex;
  flex-direction: column;
  margin-right: 1rem;

  ${Button} {
    &:first-child {
      transform: translateY(-10px);
    }
    &:last-child {
      transform: translateY(10px);
    }
  }
`
