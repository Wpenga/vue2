<template>
  <div>
    <!--疫情情况-->
    <div>
      <el-row :gutter="10" style="margin-bottom: 40px">
        <el-col :span="6">
          <el-card style="color: #409EFF;">
            <div style="font-weight: bolder"><i class="el-icon-warning"></i>全球累计确诊人数</div>
            <div style="padding:10px 0; text-align: center;font-weight: bold">{{form.gntotal}}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card style="color: #67C23A;">
            <div style="font-weight: bolder"><i class="el-icon-user-solid"></i>全球累计治愈人数</div>
            <div style="padding:10px 0; text-align: center;font-weight: bold">{{form.curetotal}}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card style="color: #E6A23C;">
            <div style="font-weight: bolder"><i class="el-icon-message-solid"></i>全球现有确诊人数</div>
            <div style="padding:10px 0; text-align: center;font-weight: bold">{{form.econNum}}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card style="color: #F56C6C;">
            <div style="font-weight: bolder"><i class="el-icon-location"></i>境外输入人数</div>
            <div style="padding:10px 0; text-align: center;font-weight: bold">{{form.jwsrNum}}</div>
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
            prop="addConfirm"
            label="累计确诊">
        </el-table-column>
        <el-table-column
            prop="addheal"
            label="累计治愈">
        </el-table-column>
        <el-table-column
            prop="confirm"
            label="现有确诊">
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
    // link:"https://blog.csdn.net/image_fzx",
    subtext:"时间",
    // sublink:"https://blog.csdn.net/image_fzx"
  },
// ----------   series：地图数据可视化，添加data数据    ---------------------

  series:[{
    name:"确诊人数",
    type:'map', // 渲染类型：地图
    map:'china',// 渲染位置：中国地图
    label:{    // 控制对应地区的汉字
      show:true,
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
      {min:1000,max:9999},
      {min:100,max:999},
      {min:10,max:99},
      {min:1,max:9}
    ],
    // align:'right',// 默认left
    // orient:'horizontal' 默认竖直
    // left right 这些属性控制 分段坐在的位置
    // showLabel:false
    // textStyle:{}
    inRange:{
      symbol:'rect',
      color:['#ffc0b1','#9c0505']   //   浅红~~深红色
    },
    itemWidth:20,
    itemHeight:10
  }],

//-------------------------------------------------------------------
  tooltip:{
    trigger:'item'
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
    this.getData();// 为什么不再created
    this.mychart = echarts.init(this.$refs.mapbox);
    this.mychart.setOption(option)
  },

  created() {
    // this.getCount()
  },
  methods: {
    //获取数据
    // async getCount(){
    //   const filldata=this.$formart(new Date())
    //
    //   const res1 =await getUserfever({filldata})
    //   const res2 =await gorisk({filldata})
    //   const res3 =await getfill({filldata})
    //
    //   this.count.fever=res1.count
    //   this.count.risk=res2.count
    //   this.count.fill=res3.count
    // },
    setRowStyle({row, column}){
      if(column.label=='累计治愈'){
        return 'color:green'
      }
    },

    // 获取疫情地图数据
    getData(){
      jsonp('https://interface.sina.cn/news/wap/fymap2020_data.d.json?_=1580892522427',{},(err,data)=>{
        if(!err){
          this.alldata = data.data
          const { times, gntotal, curetotal, econNum, jwsrNum } = data.data;
          this.form = { times, gntotal, curetotal, econNum, jwsrNum };
          // let arr=[]         
          // // const guangdong = data.data.list.find(item => item.name === "广东");
          // const province = data.data.list.find(item => item.name === this.province.slice(0,-1));
          // const res = province.city //拿到省各市区的数据
          // res.map(item=>{
          //   let obj={
          //     city:item.name,
          //     addConfirm:item.conNum,  //累计确诊
          //     confirm:item.econNum,    //现有确诊
          //     addheal:item.cureNum     //累计治愈
          //   }
          //   arr.push(obj)
          // })
          // this.tableData=arr
          this.getList(this.province)
          let list = data.data.list.map(item=>({name:item.name,value:item.value}))
          option.title.subtext = this.form.times
          option.series[0].data = list;
          this.mychart.setOption(option);
          // 这行代码能执行的前提是 DOM已经渲染完成，只有DOM渲染完成才能够执行 echarts初始化
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
          const res = province.city //拿到省各市区的数据
          res.map(item=>{
            let obj={
              city:item.name,
              addConfirm:item.conNum,  //累计确诊
              confirm:item.econNum,    //现有确诊
              addheal:item.cureNum     //累计治愈
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