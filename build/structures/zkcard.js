const canvas = require('@napi-rs/canvas');
const colorFetch = require('../functions/colorFetch');

canvas.GlobalFonts.registerFromPath(`node_modules/zkcard/build/structures/fonts/circularstd-black.otf`, "circular-std");
canvas.GlobalFonts.registerFromPath(`node_modules/zkcard/build/structures/fonts/notosans-jp-black.ttf`, "noto-sans-jp");
canvas.GlobalFonts.registerFromPath(`node_modules/zkcard/build/structures/fonts/notosans-black.ttf`, "noto-sans");
canvas.GlobalFonts.registerFromPath(`node_modules/zkcard/build/structures/fonts/notoemoji-bold.ttf`, "noto-emoji");
canvas.GlobalFonts.registerFromPath(`node_modules/zkcard/build/structures/fonts/notosans-kr-black.ttf`, "noto-sans-kr");

class zkcard {
  constructor(options) {
    this.name = options?.name ?? null;
    this.author = options?.author ?? null;
    this.color = options?.color ?? null;
    this.theme = options?.theme ?? null;
    this.brightness = options?.brightness ?? null;
    this.thumbnail = options?.thumbnail ?? null;
    this.progress = options?.progress ?? null;
    this.starttime = options?.starttime ?? null;
    this.endtime = options?.endtime ?? null;
    this.requester = options?.requester ?? null;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  setAuthor(author) {
    this.author = author;
    return this;
  }

  setColor(color) {
    this.color = color;
    return this;
  }

  setTheme(theme) {
    this.theme = theme;
    return this;
  }

  setBrightness(brightness) {
    this.brightness = brightness;
    return this;
  }

  setThumbnail(thumbnail) {
    this.thumbnail = thumbnail;
    return this;
  }

  setProgress(progress) {
    this.progress = progress;
    return this;
  }

  setStartTime(starttime) {
    this.starttime = starttime;
    return this;
  }

  setEndTime(endtime) {
    this.endtime = endtime;
    return this;
  }

  setRequester(requester) {
    this.requester = `${requester}`;
    return this;
  }

  async build() {
    if (!this.name) throw new Error('Thiếu giá trị name');
    if (!this.author) throw new Error('Thiếu giá trị author');
    if (!this.requester) throw new Error('Thiếu giá trị requester');
    if (!this.color) this.setColor('ff0000'); // Màu mặc định nếu không có giá trị color(đỏ)
    if (!this.theme) this.setTheme('classic'); // Mặc định là theme classic
    if (!this.brightness) this.setBrightness(0); // Mặc định là độ sáng 0
    if (!this.thumbnail) this.setThumbnail('')
    if (!this.progress) throw new Error('');
    if (!this.starttime) throw new Error('');
    if (!this.endtime) throw new Error('');
  }
}