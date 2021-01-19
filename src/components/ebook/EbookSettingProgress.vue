<template>
  <transition name="slide-up">
    <!-- 进度条 -->
    <div class="setting-wrapper" v-show="menuVisible && settingVisible===2">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <span class="read-time-text">{{readTime}}</span>
          <span class="icon-forward"></span>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper" @click="prevSection">
            <span class="icon-back"></span>
          </div>
          <input
            class="progress"
            type="range"
            max="100"
            min="0"
            step="1"
            @change="onProgressChange($event.target.value)"
            @input="onProgressInput($event.target.value)"
            :value="progress"
            :disabled="!bookAvailable"
            :style="{'background-size':`${progress}% 100% !important`}"
          />
          <div class="progress-icon-wrapper" @click="nextSection">
            <span class="icon-forward"></span>
          </div>
        </div>
        <div class="text-wrapper">
          <span class="progress-section-text">{{useGetSectionName}}</span>
          <span class="progress-section-precentage">({{bookAvailable ? progress + '%' : '加载中...'}})</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import useBookStore from '@/hooks/useBookStore'
import { onMounted, ref, getCurrentInstance } from 'vue'
import useDisplay from '@/hooks/useDisplay'
import useGetReadTimeText from '@/hooks/useGetReadTimeText'
import useGetSectionName from '@/hooks/useGetSectionName'

export default {
  name: 'EbookSettingProgress',
  setup() {
    const {
      menuVisible,
      settingVisible,
      bookAvailable,
      progress,
      _setProgress,
      currentBook,
      section,
      _setSection
    } = useBookStore()
    const { ctx } = getCurrentInstance()
    // 阅读时间
    const readTime = ref(0)
    // 根据进度条百分比获取cfi 渲染
    const displayProgress = () => {
      const progressNum = progress.value
      const cfi = currentBook.value.locations.cfiFromPercentage(
        progressNum / 100
      )
      useDisplay(cfi)
    }
    // 通过章节书获取章节信息
    const displaySection = () => {
      // 获取章节信息
      const sectionInfo = currentBook.value.section(section.value)
      if (sectionInfo && sectionInfo.href) {
        // 通过href(href 对应一个html文件) 渲染
        useDisplay(sectionInfo.href)
      }
    }

    // 上一章
    const prevSection = () => {
      if (section.value > 0 && bookAvailable.value) {
        const sectionNum = section.value
        _setSection(sectionNum - 1).then(() => {
          displaySection()
        })
      }
    }
    // 下一章
    const nextSection = () => {
      if (
        section.value < currentBook.value.spine.length - 1 &&
        bookAvailable.value
      ) {
        const sectionNum = section.value
        _setSection(sectionNum + 1).then(() => {
          displaySection()
        })
      }
    }
    const onProgressChange = progress => {
      _setProgress(progress).then(() => {
        displayProgress()
      })
    }
    const onProgressInput = progress => {
      _setProgress(progress)
    }
    // // 获取章节名称
    // const getSectionName = computed(() => {
    //   // if (section.value) {
    //   //   // 通过章节数(第几章)获取章节信息
    //   //   const sectionInfo = currentBook.value.section(section.value)
    //   //   if (
    //   //     sectionInfo &&
    //   //     sectionInfo.href &&
    //   //     currentBook.value &&
    //   //     currentBook.value.navigation
    //   //   ) {
    //   //     // 通过当前章节的href获取目录信息   navigation 电子书目录
    //   //     const title = currentBook.value.navigation.get(sectionInfo.href)
    //   //     return `${section.value}. ${title.label}`
    //   //   }
    //   // }
    //   // 通过章节(数) 从目录中获取对应章节的标题
    //   if (navigation.value) {
    //     return section.value ? navigation.value[section.value].label : ''
    //   }
    // })
    onMounted(() => {
      readTime.value = useGetReadTimeText(ctx)
    })
    return {
      readTime,
      menuVisible,
      settingVisible,
      prevSection,
      nextSection,
      bookAvailable,
      progress,
      onProgressChange,
      onProgressInput,
      useGetSectionName
    }
  }
}
</script>

<style lang='scss' scoped>
@import '@/assets/css/global.scss';
.setting-wrapper {
  position: absolute;
  bottom: px2rem(48);
  left: 0;
  width: 100%;
  height: px2rem(90);
  z-index: 165;
  background: white;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
  .setting-progress {
    position: relative;
    width: 100%;
    height: 100%;
    .read-time-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: px2rem(40);
      font-size: px2rem(12);
      @include center;
    }
    .progress-wrapper {
      width: 100%;
      height: 100%;
      @include center;
      padding: 0 px2rem(20);
      box-sizing: border-box;
      .progress-icon-wrapper {
        font-size: px2rem(20);
      }
      .progress {
        width: 100%;
        -webkit-appearance: none;
        height: px2rem(2);
        margin: 0 px2rem(15);
        &:focus {
          outline: none;
        }
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: px2rem(20);
          width: px2rem(20);
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.15);
          border: px2rem(1) solid #ddd;
        }
      }
    }
    .text-wrapper {
      position: absolute;
      left: 0;
      bottom: px2rem(10);
      width: 100%;
      color: #333;
      font-size: px2rem(12);
      padding: 0 px2rem(25);
      box-sizing: border-box;
      display: flex;
      .progress-section-text {
        flex: 5;
        @include ellipsis;
        box-sizing: border-box;
        text-align: center;
      }
      .progress-section-precentage {
        flex: 1;
        @include right;
      }
    }
  }
}
</style>
