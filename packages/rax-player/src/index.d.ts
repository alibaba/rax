import * as Rax from "rax";
import {BaseProps} from "rax";


/**
 *视频播放器
 *文档地址 https://alibaba.github.io/rax/component/player
 */


// 备注:
//     style 中必须传入宽高
// weex环境下使用weex提供的video组件
// Android设备的weex暂时不提供全屏功能
// video的控制条控件由组件提供，无法控制和修改
// 关于web下控制条控件
// Android下默认使用原生控制条，在UC内核中可以通过在Url中添加 hardware=true 强制开启UC内核，这种情况下播放器的控制条是定制的，使用体验好一些
// iOS设备下额外实现了进度条，可以选择是否提供全屏功能
export interface PlayerProps extends BaseProps {

    /**
     *    视频地址（必填）
     */
    src: string;
    /**
     * 封面图地址（必填）
     */
    poster: string;
    /**
     * 如果出现该属性，则显示控制器控件（该控制项只在h5下生效）
     * 默认值：controls
     */
    controls: string;
    /**
     * 控制条是否带有全局播放按钮（该属性只对iOS-h5生效，Android-h5、iOS-weex默认带有，Android-weex没有全屏功能）
     * 默认值 true
     */
    hasFullScreen: boolean;
    /**
     * 是否强制使用原生全屏方法(该属性只对iOS-h5生效，Android-h5、iOS-weex使用默认全屏，Android-weex没有全屏功能)
     * 默认值：false
     */
    originFullscreen: boolean;

    /**
     * 如果出现该属性，则显示开始暂停button
     * 默认值：startBtn
     */
    startBtn: string;
    /**
     * 如果出现该属性，则视频在就绪后马上播放
     * 默认值：false
     */
    autoPlay: boolean;
    /**
     * video播放结束时间处理方法
     */
    onVideoFinish?: () => void;
    /**
     * video播放时的处理方法
     */
    onVideoPlay?: () => void;
    /**
     *    video暂停时的处理方法
     */
    onVideoPause?: () => void;
    /**
     * video播放失败时的处理方法
     */
    onVideoFail?: () => void;

}


declare class Player extends Rax.Component<PlayerProps, any> {


    render(): JSX.Element;


}


export default Player;
