import * as Rax from "rax";
import {BaseProps} from "rax";


/**
 * component:player(视频播放器)
 * document address(文档地址):
 * https://alibaba.github.io/rax/component/player
 */


/**
 * note: width and height must be passed in style
 * weex environment using video components provided by weex:
 *     weex for Android devices does not provide full-screen functionality temporarily. The video control bar controls are provided by the component and cannot be controlled or modified.
 * wbout web under control bar controls:
 *    android uses the native control bar by default. In the UC kernel, the UC kernel can be forcibly enabled by adding hardware=true to the Url. In this case, the player's control bar is customized and the experience is better.
 *    extra progress bar under iOS device, you can choose whether to provide full-screen function
 */

/**
 * 备注：style 中必须传入宽高
 * weex环境下使用weex提供的video组件
 *    Android设备的weex暂时不提供全屏功能 video的控制条控件由组件提供，无法控制和修改
 * 关于web下控制条控件 :
 *    Android下默认使用原生控制条，在UC内核中可以通过在Url中添加 hardware=true 强制开启UC内核，这种情况下播放器的控制条是定制的，使用体验好一些
 *    iOS设备下额外实现了进度条，可以选择是否提供全屏功能
 */
export interface PlayerProps extends BaseProps {

    /**
     * video address (视频地址)
     */
    src: string;

    /**
     * cover page address(封面图地址)
     */
    poster: string;

    /**
     * if this property appears, the controller controls are displayed (this control only works under h5)
     * (如果出现该属性，则显示控制器控件（该控制项只在h5下生效）)
     * default(默认值)：controls
     */
    controls: string;

    /**
     * whether the control bar has a global play button (this property is only valid for iOS-h5, Android-h5, iOS-weex by default, Android-weex does not have full-screen function)
     * (控制条是否带有全局播放按钮（该属性只对iOS-h5生效，Android-h5、iOS-weex默认带有，Android-weex没有全屏功能）)
     * default(默认值)：true
     */
    hasFullScreen: boolean;
    /**
     * whether to force the use of native full-screen method (this property only applies to iOS-h5, Android-h5, iOS-weex use the default full-screen, Android-weex does not have full-screen function)
     * (是否强制使用原生全屏方法(该属性只对iOS-h5生效，Android-h5、iOS-weex使用默认全屏，Android-weex没有全屏功能))
     * default(默认值)：false
     */
    originFullscreen: boolean;

    /**
     * if this property appears, the display pause button
     * (如果出现该属性，则显示开始暂停button)
     * default(默认值)：startBtn
     */
    startBtn: string;

    /**
     * if this property appears, the video plays right after it is ready
     * (如果出现该属性，则视频在就绪后马上播放)
     * default(默认值)：false
     */
    autoPlay: boolean;

    /**
     * video playback end time processing method
     * (video播放结束时间处理方法)
     */
    onVideoFinish?: () => void;

    /**
     * video processing method
     * (video播放时的处理方法)
     */
    onVideoPlay?: () => void;

    /**
     * video pause processing method
     * (video暂停时的处理方法)
     */
    onVideoPause?: () => void;

    /**
     * how to handle video playback failure
     * (video播放失败时的处理方法)
     */
    onVideoFail?: () => void;

}


declare class Player extends Rax.Component<PlayerProps, any> {


    render(): JSX.Element;

}


export default Player;
