import { TextToCode,CodeToText} from 'element-china-area-data';
//区域码
export function getCodeAddress(address){
    let arraddress = address.split(" ");
    let province = TextToCode[arraddress[0]].code;
    let city = TextToCode[arraddress[0]][arraddress[1]].code;
    let town = TextToCode[arraddress[0]][arraddress[1]][arraddress[2]].code;
    return [province, city, town];
}
//中文地址
export function getTextAderess(addressSelections){
    //使用对象解构 根据区域码获取具体的地区名
    const {0: province, 1: city, 2: town} = addressSelections.map(code => CodeToText[code]);
    return `${province} ${city} ${town}`;
}
