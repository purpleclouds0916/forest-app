/* eslint-disable no-param-reassign */
/* eslint-disable func-style */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/no-this-in-sfc */

import { useEffect, VFC } from 'react';
import * as d3 from 'd3';

import './LineChart.css';
import { inputValuesTs } from '../../models/InputValues';

interface IBasicLineChartProps {
  top: number;
  bottom: number;
  left: number;
  right: number;
  className: string;
  idName: string;
  timingOfLogging: 'thinning' | 'clearCut';
  data: number[][];
  inputValues: inputValuesTs;
  setInputValue: React.Dispatch<React.SetStateAction<inputValuesTs>>;
}

const LineChart: VFC<IBasicLineChartProps> = (props) => {
  const {
    top,
    bottom,
    left,
    right,
    className,
    idName,
    inputValues,
    setInputValue,
    data,
    timingOfLogging,
  } = props;

  useEffect(() => {
    d3.select(`#${idName}`).selectAll('*').remove();

    const width =
      parseInt(d3.select(`#${idName}`).style('width'), 10) - left - right;
    const height =
      parseInt(d3.select(`#${idName}`).style('height'), 10) - top - bottom;

    const svg = d3
      .select(`#${idName}`)
      .append('svg')
      .attr('width', width + left + right + 20)
      .attr('height', height + top + bottom)
      .append('g')
      .attr('transform', `translate(${left},${top})`);

    // x axis scale
    const x = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, () =>
          Math.max(...data.map((dt) => (dt as unknown as number[])[0]), 0),
        ),
      ] as number[])
      .range([0, width]);

    const maxY = Number(d3.max(data, (d: number[]) => d[1]));

    const y = d3
      .scaleLinear()
      .domain([0, maxY + 10000])
      .range([height, 0]);

    const xAxis = d3.axisBottom(x).ticks(8);
    const yAxis = d3.axisLeft(y).ticks(7);

    const line = d3
      .line()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]));

    const focus = svg.append('g');

    focus
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      // @ts-ignore
      .attr('d', line);

    focus
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    focus.append('g').attr('class', 'axis axis--y').call(yAxis);

    const tooldiv = d3
      .select(`#${idName}`)
      .append('div')
      .attr('class', 'tooltip')
      .style('visibility', 'hidden')
      .style('position', 'absolute');

    const xValue = (d: number[]) => d[0];
    const yValue = (d: number[]) => d[1];

    focus
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('r', 5.0)
      .attr('cx', (d: Array<number>) => x(d[0]))
      .attr('cy', (d: Array<number>) => y(d[1]))
      .style('cursor', 'pointer')
      .style('fill', 'steelblue')
      .attr('id', (_d, i: number): string => `${i}`)
      .classed('cirStyle', true)
      .on('mouseover', (_e: MouseEvent, d: Array<number>) => {
        tooldiv
          .style('visibility', 'visible')
          .html(
            `胸高直径:${Math.round(d[0])}cm<br>金額:${
              Math.round(d[1] / 100) * 100
            }円`,
          )
          .style('top', `${y(yValue(d)) - 50}px`)
          .style('left', `${x(xValue(d)) - 50}px`);
      })
      .on('mousemove', () => undefined)
      .on('mouseout', () => {
        tooldiv.style('visibility', 'hidden');
      });

    const dragstarted = () => {
      tooldiv.style('visibility', 'visible');
    };
    // @ts-ignore
    function dragged(this: SVGCircleElement, e: DragEvent, d: Array<number>) {
      // @ts-ignore
      focus.select('path').attr('d', line);

      d3.select(this).classed('dragging', true);

      const id = Number(this.id);

      // dragの範囲を要素ごとに制限  xは0よりも大きく、次の要素よりも小さい値で前の要素よりも大きい値
      if (id === 0) {
        d[0] = Math.max(0, Math.min(x.invert(e.x), data[id + 1][0]));
      } else if (id === data.length - 1) {
        d[0] = Math.max(data[id - 1][0], x.invert(e.x));
      } else {
        d[0] = Math.max(
          data[id - 1][0],
          Math.min(x.invert(e.x), data[id + 1][0]),
        );
      }

      d[1] = Math.max(0, Math.min(y.invert(e.y), 500000));
      d3.select(this).attr('cx', x(d[0])).attr('cy', y(d[1]));

      tooldiv
        .html(
          `胸高直径:${Math.round(d[0])}cm<br>金額:${
            Math.round(d[1] / 100) * 100
          }円`,
        )
        .style('visibility', 'visible')
        .style('top', `${y(yValue(d)) - 50}px`)
        .style('left', `${x(xValue(d)) - 50}px`)
        .style('background-color', 'tomato');
    }
    // @ts-ignore
    function dragended(
      this: SVGCircleElement,
      _e: DragEvent,
      d: Array<number>,
    ) {
      tooldiv.style('visibility', 'hidden');
      d3.select(this).classed('dragging', false);

      const id = Number(this.id);

      setInputValue({
        ...inputValues,
        [`${timingOfLogging}Price`]: data.map((price, index) =>
          index === id ? Math.round(d[1] / 100) * 100 : price[1],
        ),
        [`${timingOfLogging}Diamter`]: data.map((diamter, index) =>
          index === id ? Math.round(d[0]) : diamter[0],
        ),
      });
    }

    const drag = d3
      .drag()
      .on('start', dragstarted)
      // @ts-ignore
      .on('drag', dragged)
      // @ts-ignore
      .on('end', dragended);

    // @ts-ignore
    focus.selectAll('circle').call(drag);

    const makeXGridlines = () => d3.axisBottom(x).ticks(5);

    const makeYGridlines = () => d3.axisLeft(y).ticks(5);

    // x軸のグリッドラインの追加
    svg
      .append('g')
      .attr('class', 'grid')
      .attr('transform', 'translate(0,' + height + ')') // eslint-disable-line

      .call(
        makeXGridlines()
          .tickSize(-height)
          // @ts-ignore
          .tickFormat(''),
      );
    // Y軸のグリッドラインの追加
    svg
      .append('g')
      .attr('class', 'grid')

      .call(
        makeYGridlines()
          .tickSize(-width)
          // @ts-ignore
          .tickFormat(''),
      );
  }, [
    bottom,
    className,
    data,
    idName,
    left,
    right,
    top,
    setInputValue,
    inputValues,
    timingOfLogging,
  ]);

  return <div className="line-chart" id={idName} />;
};

export default LineChart;
