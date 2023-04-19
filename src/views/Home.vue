<template>
  <div>
    <el-row :gutter="10" style="margin-bottom: 40px">
      <el-col :span="6">
        <el-card style="color: #409EFF;">
          <div style="font-weight: bolder"><i class="el-icon-user-solid"></i>用户总数</div>
          <div style="padding:10px 0; text-align: center;font-weight: bold">{{form.total}}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color: #E6A23C;">
          <div style="font-weight: bolder"><i class="el-icon-warning"></i>发烧人数</div>
          <div style="padding:10px 0; text-align: center;font-weight: bold">{{form.isFeverCount}}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color: #67C23A;">
          <div style="font-weight: bolder"><i class="el-icon-success"></i>已签到</div>
          <div style="padding:10px 0; text-align: center;font-weight: bold">{{form.signCount}}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color: #F56C6C;">
          <div style="font-weight: bolder"><i class="el-icon-error"></i>未签到</div>
          <div style="padding:10px 0; text-align: center;font-weight: bold">{{form.total - form.signCount}}</div>
        </el-card>
      </el-col>
    </el-row>
<!--    表格-->
    <el-row>
      <el-col :span="12">
        <div id="main" style="width: 500px;height: 400px"></div>
      </el-col>
      <el-col :span="12">
        <div id="pie" style="width: 500px;height: 400px"></div>
      </el-col>
    </el-row>


  </div>
</template>

<script>
import * as echarts from 'echarts';
import { getdata} from "@/api/echarts";
export default {
  name: "Home",
  data(){
    return {
      xAxisData:['0-6','6-12','12-18','18-24'],
      form:{ 
        total:0,      //用户总数
        signCount:0,  //签到总数
        isFeverCount:0,    //发烧总数
      }
      
    }
  },
  created(){
    //获取用户
      this.loading = true ;
      getdata().then(res => {
        const {total,signCount,isFeverCount} = res.data
        this.form = {total,signCount,isFeverCount} 
      })
  },
  mounted() {//页面元素渲染之后再触发
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      title: {
        text: '签到时间分布',
        subtext: '折线-柱状图',
        left: 'center'
      },
      xAxis: {
        type: 'category',
        data: this.xAxisData
      },
      yAxis: {
        type: 'value'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name:'签到',
          data: [],
          type: 'line'//折线图
        },
        {
          name:'签到',
          data: [],
          type: 'bar'//柱状图
        },
        // {
        //   name:'未签到',
        //   data: [],
        //   type: 'line'//折线图
        // },
        // {
        //   name:'未签到',
        //   data: [],
        //   type: 'bar'//柱状图
        // }
      ]
    };
    /*this.request.get("/echarts/example").then(res =>{
      option.xAxis.data = res.data.x
      option.series[0].data = res.data.y
      myChart.setOption(option);
    })*/


    //饼图
    var pieDom = document.getElementById('pie');
    var pieChart = echarts.init(pieDom);
    var pieoption = {
      title: {
        text: '饼图',
        subtext: '比例图',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '比例',
          type: 'pie',
          radius: '50%', //大小
          label:{               //饼图上显示具体比例
            normal:{
              show: true,
              position:'inner', //标签的位置
              textStyle:{
                fontWeight: 300,
                fontSize: 16,   //文字大小
                color: '#fff'
              },
              // formatter:'{d}%'
            }
          },
          data: [
            /*{ value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }*/
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    this.request.get("/echarts/members").then(res =>{
      console.log(res.data);
      //柱状图，折线图
      // option.xAxis.data = res.data
      option.series[0].data = res.data
      option.series[1].data = res.data
      // option.series[2].data = [5,10,14,20]
      // option.series[3].data = [5,10,14,20]
      myChart.setOption(option);

      //饼图
      pieoption.series[0].data=[
        { value: res.data[0], name: '凌晨' },
        { value: res.data[1], name: '早上' },
        { value: res.data[2], name: '下午' },
        { value: res.data[3], name: '晚上' }
      ]
      pieChart.setOption(pieoption)
    })

  }
}
</script>

<style scoped>

</style>