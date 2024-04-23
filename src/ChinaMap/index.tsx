import { useEffect, useRef } from 'react';

import * as echarts from 'echarts';
import chinaSvg from './map/china.svg';

const ChinaMap = () => {
  const echartsRef = useRef<echarts.ECharts>();

  // 初始化地图
  useEffect(() => {
    window
      .fetch(chinaSvg)
      .then(res => {
        return res.text();
      })
      .then(e => {
        echarts.registerMap('chinaSvg', { svg: e });
        if (!echartsRef.current) {
          const echartsDom = document.getElementById('echartsMap')!;
          echartsRef.current = echarts.init(echartsDom);
        }
        echartsRef.current.setOption({
          animation: true,
          animationDuration: 1500,
          stateAnimation: {
            duration: 300,
            easing: 'cubicOut',
          },
          geo: {
            map: 'chinaSvg',
            show: true,
            aspectScale: 1,
            zoom: 3,
            roam: false,
            top: 200,

            label: {
              show: false,
            },
            itemStyle: {
              areaColor: '#00000020',
              borderColor: '#b9eaffa0', // 线
              borderWidth: 2,
            },
            emphasis: {
              label: {
                show: false,
              },
              itemStyle: {
                areaColor: '#C4F890',
                opacity: 0.4,
              },
            },
            regions: [],
          },
        });
      });
  }, []);

  // 屏幕大小改变时自动 resize
  useEffect(() => {
    const resize = () => {
      echartsRef.current?.resize();
    };
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  });

  return <div id="echartsMap" style={{ width: '100%', height: '100%' }} />;
};

export default ChinaMap;
