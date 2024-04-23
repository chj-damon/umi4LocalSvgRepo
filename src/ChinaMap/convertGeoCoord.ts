import { geoCoordMap } from './geoCoordMap';

export const convertData = (
  _data: any[],
  adjustXMultiple = 8.2,
  adjustXConstant = -125,
  adjustYMultiple = 9.5,
  adjustYConstant = 750
) => {
  const res: any[] = [];
  for (let i = 0; i < _data.length; i++) {
    // ------------此处的值需要自己手动调节,直到匹配------------
    let geoCoord;
    try {
      geoCoord = [
        +(geoCoordMap[_data[i].name][0] * adjustXMultiple + adjustXConstant).toFixed(4),
        +(-geoCoordMap[_data[i].name][1] * adjustYMultiple + adjustYConstant).toFixed(4),
      ];
    } catch (e) {
      console.error(`首页地图存在识别不到的市名称，请查看network传输数据及name是否匹配
name:"${_data[i]?.name}"`);
    }

    // -------------------------------------------------------
    if (geoCoord) {
      res.push({
        symbol: _data[i].symbol,
        name: _data[i].name,
        value: geoCoord.concat(_data[i].value),
      });
    }
  }

  return res;
};
