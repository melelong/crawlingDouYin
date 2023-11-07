/*
 * 2023-10-29 22:26:23
 * @Github: https://github.com/melelong
 * custom_string_obkoro1~custom_string_obkoro100都可以输出自定义信息
 * @Author: melelong
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 * @LastEditors: 可以输入预定的版权声明、个性签名、空行等
 */
const getRandomNum = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
export default getRandomNum;
