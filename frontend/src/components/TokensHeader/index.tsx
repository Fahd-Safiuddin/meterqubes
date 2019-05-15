import isEmpty from 'lodash/isEmpty'
import * as Styled from './style'
import { getColor } from '../../utils/colorByValue'

type TokenTypes = {
  token: string
  lastPrice: string
  changeRate: string
}

export default ({ data }: { data: TokenTypes[] }) => {
  const per = data
    .filter(({ changeRate }) => changeRate.toString().match(/^-/g))
    .map(({ changeRate, ...rest }) => ({
      changeRate: changeRate.toString(),
      ...rest
    }))

  const absPer = data
    .filter(({ changeRate }) => !changeRate.toString().match(/^-/g))
    .map(({ changeRate, ...rest }) => ({
      changeRate: +changeRate !== 0 ? `+${changeRate}` : changeRate,
      ...rest
    }))

  const tokens = [...per, ...absPer].sort((a, b) => {
    if (a.token > b.token) {
      return 1
    }
    if (a.token < b.token) {
      return -1
    }
    return 0
  })

  if (!isEmpty(data)) {
    return (
      <Styled.Header>
        <Styled.Content>
          {[...tokens, ...tokens, ...tokens].map(
            ({ token, lastPrice, changeRate }, i: number) => (
              <Styled.Article key={i}>
                <Styled.Token>{token}</Styled.Token>
                <Styled.Price>${lastPrice}</Styled.Price>
                <Styled.Percentage color={getColor(changeRate)}>
                  {changeRate}%
                </Styled.Percentage>
              </Styled.Article>
            )
          )}
        </Styled.Content>
      </Styled.Header>
    )
  }

  return null
}
