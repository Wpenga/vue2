function timestampToTime(times) {
    let time = times[1]
    let mdy = times[0]
    mdy = mdy.split('/')
    let month = parseInt(mdy[0]);
    let day = parseInt(mdy[1]);
    let year = parseInt(mdy[2])
    return year + '-' + month + '-' + day + ' ' + time
}
// function nowTime(){
// let time = new Date()
// let nowTime =  timestampToTime(time.toLocaleString('en-US',{hour12: false}).split(" "))
// }

export default timestampToTime