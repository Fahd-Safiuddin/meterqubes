import { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Echarts from 'echarts-for-react'
import NoSSR from 'react-no-ssr'
import Router from 'next/router'
import Card from '../../Card'
import * as Styled from './style'
import { colors } from '../../../styles/colors'
import { ChartTypes, ChartProps } from './types'
import Text from '../../Text'
import Button from '../../Button'
import Flex from '../../Flex'
import { bind } from '../../../utils/bind'
import Select from '../../Select'

function calculateMA(dayCount: number, data: number[][]) {
  var result = []
  for (var i = 0, len = data.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-')
      continue
    }
    var sum = 0
    for (var j = 0; j < dayCount; j++) {
      sum += data[i - j][1]
    }
    result.push((sum / dayCount).toFixed(2))
  }
  return result
}

@inject(
  ({
    themeStore: { theme },
    chartStore: { dates, values, volumes, getData }
  }) => ({ theme, dates, values, volumes, getData })
)
@observer
export default class Chart extends Component<ChartProps, ChartTypes> {
  periods = [
    {
      label: '1 day',
      value: 1,
      id: 1
    },
    {
      label: '10 days',
      value: 10,
      id: 2
    },
    {
      label: '30 days',
      value: 30,
      id: 3
    },
    {
      label: '60 days',
      value: 60,
      id: 4
    }
  ]
  state = {
    option: {},
    series: {
      ma3: true,
      ma5: true,
      ma10: true,
      ma20: true,
      candle: true,
      volumes: true
    },
    period: 30
  }

  public static getDerivedStateFromProps(
    { theme, dates, values, volumes, rtl },
    { series }
  ) {
    if (dates && values && volumes) {
      const iconSize = 28
      const colorList = [
        colors.text,
        colors.blue,
        colors.success,
        colors.primary,
        colors.text
      ]

      const maSeries = Object.keys(series)
        .filter(s => s.match(/ma/gi))
        .map((s: string, i: number) => ({
          name: s.toUpperCase(),
          type: 'line',
          data: series[s]
            ? calculateMA(Number(s.replace('ma', '')), values)
            : null,
          showSymbol: false,
          smooth: true,
          animation: false,
          lineStyle: {
            normal: {
              width: series[s] ? 1 : 0,
              color: colorList[i + 1]
            }
          },
          itemStyle: {
            normal: {
              opacity: series[s] ? 1 : 0,
              borderWidth: 6,
              color: colorList[i + 1]
            }
          },
          label: {
            show: false
          }
        }))

      const option = {
        color: colorList,
        backgroundColor: theme === 'night' ? colors.dark : colors.white,
        height: '100%',
        width: '100%',
        legend: {
          inactiveColor: colorList[2],
          textStyle: {
            color: colors.white,
            width: '0%'
          },
          itemWidth: iconSize,
          itemHeight: iconSize,
          right: '30px',
          data: []
        },
        tooltip: {
          backgroundColor: colors.bg,
          trigger: 'axis',
          padding: 15,
          axisPointer: {
            animation: true,
            type: 'cross'
          },
          textStyle: {
            color: colors.lightGrey
          }
        },
        toolbox: {
          itemSize: iconSize,
          itemGap: 15,
          showTitle: false,
          ...(rtl ? { left: 0 } : { right: 0 }),
          feature: {
            saveAsImage: {
              icon: `image:///static/img/chart/chart_save${
                theme === 'day' ? '_light' : ''
              }.svg`
            }
          }
        },
        xAxis: [
          {
            type: 'category',
            data: dates,
            scale: true,
            boundaryGap: false,
            axisLine: { lineStyle: { color: colorList[0] } },
            min: 'dataMin',
            max: 'dataMax',
            axisPointer: {
              label: {
                show: false
              },
              lineStyle: {
                color: colorList[0],
                width: 1
              }
            }
          },
          {
            type: 'category',
            gridIndex: 1,
            data: dates,
            scale: false,
            boundaryGap: false,
            axisLine: { lineStyle: { color: 'rgba(132,134,165,0.3)' } },
            axisTick: { show: false },
            splitLine: { show: false },
            axisLabel: { show: false },
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax',
            axisPointer: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            scale: true,
            axisLine: { lineStyle: { color: colorList[0] } },
            axisPointer: {
              label: {
                backgroundColor: colors.successLight,
                shadowBlur: 0,
                padding: [2, 5, 2, 5],
                shadowColor: colors.successLight,
                color: colors.white
              },
              lineStyle: {
                color: colors.successLight,
                width: 1
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(132,134,165,0.3)'
              }
            }
          },
          {
            type: 'value',
            scale: true,
            gridIndex: 1,
            axisLabel: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
            axisPointer: {
              show: false
            }
          }
        ],
        visualMap: {
          show: false,
          seriesIndex: 1,
          dimension: 2,
          pieces: [
            {
              value: 1,
              color: `${colors.successLight}40`,
              borderColor: `${colors.successLight}70`
            },
            {
              value: -1,
              color: `${colors.primaryLight}40`,
              borderColor: `${colors.primaryLight}70`
            }
          ]
        },
        grid: [
          {
            left: 40,
            right: 0,
            top: 50,
            height: '80%'
          },
          {
            left: 45,
            right: 0,
            height: 50,
            top: '80%'
          }
        ],
        dataZoom: [
          {
            type: 'inside'
          },
          {
            show: true,
            xAxisIndex: [0, 1],
            type: 'slider',
            top: '105%'
          }
        ],
        animation: true,
        series: [
          {
            name: 'Candle',
            type: 'candlestick',
            data: series.candle && values,
            itemStyle: {
              normal: {
                color: colors.primaryLight,
                color0: colors.successLight,
                borderColor: `${colors.primaryLight}50`,
                borderColor0: `${colors.successLight}50`
              }
            }
          },
          {
            name: 'Volumes',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: series.volumes && volumes
          },
          ...maSeries
        ]
      }

      return {
        option
      }
    }

    return null
  }

  public componentDidMount() {
    const { query, getData } = this.props
    const { period } = this.state
    getData(query && +query.market, period)
  }

  public componentDidUpdate(np: ChartProps) {
    const { getData, query } = this.props
    const { period } = this.state

    if (query) {
      if (np.query.market !== query.market) {
        getData(query && +query.market, period)
      } else if (np.query.period !== query.period) {
        getData(query && +query.market, period)
      }
    }
  }

  @bind
  private onToggleChartSeries(name: string) {
    this.setState(({ series }) => ({
      series: {
        ...series,
        [name]: !series[name]
      }
    }))
  }

  @bind private onChangePeriod(id: number) {
    const value = this.periods.find(item => item.id === id).value
    this.setState({ period: value })
    Router.replace(`/trade?market=${this.props.query.market}&period=${value}`)
  }

  @bind
  private renderButtons() {
    const { series, period } = this.state
    const { theme } = this.props
    const selected = this.periods.find(item => item.value === period).id

    return (
      <>
        <Select
          items={this.periods}
          onSelect={this.onChangePeriod}
          selected={selected}
          search={false}
          size="sm"
        />
        {series &&
          Object.keys(series).map((name, i: number) => {
            let buttonProps: { icon: string; text?: string }

            if (name === 'candle') {
              buttonProps = {
                icon: '/static/img/chart/chart_candle.svg'
              }
            } else if (name === 'volumes') {
              buttonProps = {
                icon: '/static/img/chart/chart_bar.svg'
              }
            } else {
              buttonProps = {
                icon: '/static/img/chart/chart_line.svg',
                text: name.toLocaleUpperCase()
              }
            }

            let buttonTheme: string

            if (!!Object.values(series)[i] && theme === 'night') {
              buttonTheme = 'chart'
            } else if (!!Object.values(series)[i] && theme === 'day') {
              buttonTheme = 'chart-day'
            } else {
              buttonTheme = 'transparent'
            }

            return (
              <Button
                key={i}
                {...buttonProps}
                theme={buttonTheme}
                onClick={() => this.onToggleChartSeries(name.toLowerCase())}
              />
            )
          })}
      </>
    )
  }

  render() {
    const { theme } = this.props
    return (
      <Styled.Wrapp theme={theme}>
        <Card>
          <NoSSR>
            <Styled.Chart id="chart">
              <Styled.Toolbar rtl={this.props.rtl}>
                <Flex justify="space-between">
                  <Flex>
                    <div>
                      <Text size="xs" weight="semibold" inline color="text">
                        O:
                      </Text>{' '}
                      <Text
                        size="xs"
                        weight="semibold"
                        inline
                        color="successLight"
                      >
                        O.125251212
                      </Text>
                    </div>
                    <div>
                      <Text size="xs" weight="semibold" inline color="text">
                        O:
                      </Text>{' '}
                      <Text
                        size="xs"
                        weight="semibold"
                        inline
                        color="successLight"
                      >
                        O.125251212
                      </Text>
                    </div>
                    <div>
                      <Text size="xs" weight="semibold" inline color="text">
                        O:
                      </Text>{' '}
                      <Text
                        size="xs"
                        weight="semibold"
                        inline
                        color="successLight"
                      >
                        O.125251212
                      </Text>
                    </div>
                  </Flex>
                  <Styled.ToolbarButtons>
                    {this.renderButtons()}
                  </Styled.ToolbarButtons>
                </Flex>
              </Styled.Toolbar>
              <Echarts option={this.state.option} />
            </Styled.Chart>
          </NoSSR>
        </Card>
      </Styled.Wrapp>
    )
  }
}
