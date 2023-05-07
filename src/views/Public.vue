<template>
  <div>
    <!--疫情情况-->
    <div>
      <el-row :gutter="10" style="margin-bottom: 40px;display: flex; flex-wrap: wrap;">
        <el-col :span="5"  style="flex-basis: 20%;">
          <el-card style="color: #409EFF;">
            <div style="font-weight: bolder"><i class="el-icon-warning"></i>累计确诊人数</div>
            <div style="padding:10px 0; text-align: center;font-weight: bold">{{form.gntotal}}</div>
          </el-card>
        </el-col>
        <el-col :span="5" style="flex-basis: 20%;">
          <el-card style="color: #67C23A;">
            <div style="font-weight: bolder"><i class="el-icon-user-solid"></i>累计治愈人数</div>
            <div style="padding:10px 0; text-align: center;font-weight: bold">{{form.curetotal}}</div>
          </el-card>
        </el-col>
        <el-col :span="5" style="flex-basis: 20%;">
          <el-card style="color: #E6A23C;">
            <div style="font-weight: bolder"><i class="el-icon-message-solid"></i>现存确诊人数</div>
            <div style="padding:10px 0; text-align: center;font-weight: bold">{{form.econNum}}</div>
          </el-card>
        </el-col>
        <el-col :span="5" style="flex-basis: 20%;">
          <el-card style="color: #F56C6C;">
            <div style="font-weight: bolder"><i class="el-icon-location"></i>境外输入人数</div>
            <div style="padding:10px 0; text-align: center;font-weight: bold">{{form.jwsrNum}}</div>
          </el-card>
        </el-col>

        <el-col :span="5" style="flex-basis: 20%;">
          <el-card style="color:rgb(102,102,102);">
            <div style="font-weight: bolder"><i class="el-icon-s-opportunity"></i>累计死亡</div>
            <div style="padding:10px 0; text-align: center;font-weight: bold">{{form.deathtotal}}</div>
          </el-card>
        </el-col>
      </el-row>
  </div>
    <div class="yq" > 
      <!-- 疫情地图 -->
      <div>
        <!-- 初始化echarts 设定地图占位大小 -->
        <div ref='mapbox' style='height:400px;width:600px'></div>
      </div>
      <!-- 列表 -->
    <div >
      <el-col style="margin-bottom: 10px;">
        <span style="line-height:28px">省份 </span>
          <el-select v-model="province" placeholder="请选择" clearable  filterable @change="getList">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-col>

      <el-table max-height='400' stripe
                :cell-style="setRowStyle"
                :data="tableData"
                :loading="loading"
                style="width: 100%">
        <el-table-column
            prop="city"
            label="市区"
            height='120'
        >
        </el-table-column>

        <el-table-column
            prop="conNum"
            label="累计确诊">
            <template slot-scope="scope">
              <div  style="color: #409EFF;;font-weight:bolder ;">  {{scope.row.conNum}}</div>
            </template>
        </el-table-column>
        <el-table-column
            prop="cureNum"
            label="累计治愈">
            <template slot-scope="scope">
              <div  style="color: #67C23A;font-weight:bolder ;">  {{scope.row.cureNum}}</div>
            </template>
        </el-table-column>
        <el-table-column
            prop="econNum"
            label="现存确诊">
            <template slot-scope="scope">
              <!-- <el-tag type="warning" > -->
              <div  style="color: #E6A23C;font-weight:bolder ;">  {{scope.row.econNum}}</div>
              <!-- </el-tag> -->
            </template>
        </el-table-column>
        <el-table-column
            prop="econNum"
            label="累计死亡">
            <template slot-scope="scope">
              <!-- <el-tag type="warning" > -->
              <div  style="color:rgb(102,102,102);font-weight:bolder ;">  {{scope.row.deathNum}}</div>
              <!-- </el-tag> -->
            </template>
        </el-table-column>
      </el-table>
    </div>
</div>

  </div>
</template>

<script>
// import {getUserfever,gorisk,getfill} from '../api/user'
import * as echarts from 'echarts'
import '@/utils/china.js'  //地图
import jsonp from 'jsonp'
import { CodeToText,TextToCode} from 'element-china-area-data';
const option = {
  title:{
    text:"全国疫情概览",
    subtext:"时间",
  },
// ----------   series：地图数据可视化，添加data数据    ---------------------
  // legend: {
  //   bottom:'5%',
  //   left: 'center'
  // },
  series:[{
    name:"累计确诊",
    type:'map', // 渲染类型：地图
    map:'china',// 渲染位置：中国地图
    label:{    // 控制对应地区的汉字
      show:true, //显示下载
      color:'#333',// 控制地区名的字体颜色---黑色，省名字
      fontSize:10
    },
    itemStyle:{      // 地图板块的颜色和边框---灰色，各个省界线
      areaColor:'#eee',
      // borderColor:'blue'
    },
    roam:true,
    zoom:1.2,// 控制地图的放大和缩小
    emphasis:{    // 控制鼠标滑过之后的背景色和字体颜色--白色
      label:{
        color:'#fff',
        fontSize:12
      },
      itemStyle:{
        areaColor:'#83b5e7'   //  滑动到哪个地区就显示蓝色
      }
    },
    data:[]    // 用来展示后台给的数据的 {name:xx,value:xxx}
  }],

//-----------    visualMap：视觉映射，每个颜色代表什么含义   -----------------------------
  visualMap:[{
    type:'piecewise',
    show:true,
    // splitNumber:4
    pieces:[           // 分段
      {min:10000},
      {min:7000,max:9999},
      {min:4000,max:6999},
      {min:1000,max:3999},
      {min:1,max:999}
    ],
    inRange:{
      symbol:'rect',
      color:['#ffc0b1','#9c0505']   //取值范围的颜色浅红~~深红色
    },
    itemWidth:20,
    itemHeight:10
  }],

//-------------------------------------------------------------------
  tooltip:{
    trigger:'item',
    formatter: function(params){
      return '<b>' + params.name + '</b>' + '<br/>' +
      '累计确诊: ' + params.value + '<br/>' +
      '累计治愈：' + params.data.cureNum+ '<br/>' +
      '现存确诊：' + params.data.econNum+ '<br/>' +
      '累计死亡: ' + params.data.deathNum;
      
    }
    // '{a}<br/>{b} : {c} '
  },
  toolbox: {
    show: true,
    orient: 'vertical',
    left: 'right',
    top: 'center',
    feature: {
      // dataView: {readOnly: false},
      // restore: {},
      saveAsImage: {}
    }
  },
};

export default {
  data () {
    return {
      loading:false,
      count:{
        fever:'',
        risk:'',
        fill:''
      },
      form:{
          times:"",     //统计时间点
          gntotal:"",   //全球累计确诊人数
          curetotal:"", //全球累计治愈人数
          econNum:"",   //全球现有确诊人数
          jwsrNum:""    //境外输入人数
      },
      alldata:{},
      province:TextToCode['广东省'].code,
      options:this.regionData,
      tableHeight:100,
      tableData: []
    }
  },

  mounted() {
    // this.getData();
    this.mychart = echarts.init(this.$refs.mapbox);
    this.getData();
    this.mychart.setOption(option)
  },

  created() {
    // this.getCount()
  },
  methods: {
    setRowStyle({row, column}){
      if(column.label=='累计治愈'){
        return 'color:green'
      }
    },

    // 获取疫情地图数据
    getData(){
      jsonp('https://interface.sina.cn/news/wap/fymap2020_data.d.json',{},(err,data)=>{
        if(!err){
          this.alldata = data.data
          const { times, gntotal, curetotal, econNum, jwsrNum,deathtotal } = this.alldata;
          this.form = { times, gntotal, curetotal, econNum, jwsrNum,deathtotal };
          this.getList(this.province)
          let list = this.alldata.list.map(item=>({
            name:item.name,   //省份
            value:item.value, //累计确诊
            deathNum:item.deathNum,
            cureNum:item.cureNum,    //累计治愈
            econNum:item.econNum,    //现存确诊
          }))
          option.title.subtext = this.form.times
          option.series[0].data = list;
          this.mychart.setOption(option);
        }
      })
    },
    
    //获取省份数据
    getList(selectedValue){
        if(selectedValue){   //判断有值才搜索
          this.loading = true;
          //获取中文地址
          let addressText = CodeToText[selectedValue];
          let arr=[]         
          // const guangdong = data.data.list.find(item => item.name === "广东");
          const province = this.alldata.list.find(item => item.name === addressText.slice(0,-1));
          const cities = province.city //拿到省下的各市区的数据
          cities.map(item=>{
            let obj={
              city:item.name,           //市区
              conNum:item.conNum,  //累计确诊
              cureNum:item.cureNum,    //累计治愈
              econNum:item.econNum,    //现存确诊
              deathNum:item.deathNum   //累计死亡
            }
            arr.push(obj)
          })
          this.tableData=arr
          this.loading = false
        }
      }
  },
}
</script>

<style lang="less" scoped>
//
.yq{
  display: flex;

}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  .main-content {
    padding: 15px ;
    .left{
      display: flex;flex-direction: column;
      .top{font-size: 24px;}
      span{color: white;}
    }
    .right{
      font-size: 40px;
    }
    display: flex;
    justify-content: space-between;
  }
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple1 {
  background: #0a97bb;
}
.bg-purple2 {
  background: #1d9442;
}
.bg-purple3 {
  background: #e94542;
}
.bg-purple4 {
  background: #ffbc00;
}
.grid-content {
  border-radius: 4px;
  min-height: 100px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

//
</style>