import Vue from "vue";
import dayjs from "dayjs";

Vue.filter("format", (val, format = "MMM D, YYYY") => {
  return dayjs(val).format(format);
});
