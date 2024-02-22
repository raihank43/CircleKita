function formatTime(value) {
  var tanggalDanWaktu = new Date(value);
  var tahun = tanggalDanWaktu.getFullYear();
  var bulan = tanggalDanWaktu.getMonth() + 1;
  var tanggal = tanggalDanWaktu.getDate();
  var jam = tanggalDanWaktu.getHours();
  var menit = tanggalDanWaktu.getMinutes();
  var detik = tanggalDanWaktu.getSeconds();
  var formatWaktu = tahun + "-" + padZero(bulan) + "-" + padZero(tanggal) + " " + padZero(jam) + ":" + padZero(menit);
  function padZero(number) {
    return number < 10 ? "0" + number : number;
  }
  return formatWaktu;
}

module.exports = formatTime;

// console.log(formatTime("Thu Feb 22 2024 15:37:33 GMT+0700 (Western Indonesia Time)"));
