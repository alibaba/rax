import * as Rax from "rax";
import {BaseProps} from "rax";
import {ImageSource} from "rax-image";

/**
 * component:picture(图片)
 * document address(文档地址):
 * https://alibaba.github.io/rax/component/picture
 */


/**
 * resizeMode available values (可用值)：
 *
 * cover: the image is scaled while maintaining the aspect ratio of the image until the width and height are greater than or equal to
 * the size of the container view (if the container has a padding line, subtract it accordingly. Only Android works).
 * Annotation: This image completely covers or even exceeds the container, leaving no space in the container.
 * (在保持图片宽高比的前提下缩放图片，直到宽度和高度都大于等于容器视图的尺寸（如果容器有padding内衬的话，则相应减去，仅安卓有效）。译注：这样图片完全覆盖甚至超出容器，容器中不留任何空白。)
 *
 * contain: scale the image to maintain the aspect ratio of the image until both the width and height are less than or equal to the size of the container view
 * (if the container has a padding liner, subtract it accordingly. Only Android works). Annotation: This image is completely wrapped in the container, the container may leave blank
 * (在保持图片宽高比的前提下缩放图片，直到宽度和高度都小于等于容器视图的尺寸（如果容器有padding内衬的话，则相应减去，仅安卓有效）。译注：这样图片完全被包裹在容器中，容器中可能留有空白)
 *
 *  stretch:stretch the picture without maintaining the aspect ratio until the height is just enough to fill the container.
 *  (拉伸图片且不维持宽高比，直到宽高都刚好填满容器。)
 */
export type PictureResizeMode = "cover" | "contain" | "stretch";

export interface PictureProps extends BaseProps {

    /**
     * image source
     */
    source: ImageSource;

    /**
     * style, you must set style.width , you don't need to set style.height when the actual width and height of the image
     * are known, and let rax-pictrue calculate the true width of your image (required).
     * (样式，必须设置 style.width ，在已知图像真实宽高时可不设置 style.height ，让 rax-pictrue 根据的你的图像真实宽高进行计算)
     */
    // style: object;

    /**
     * decide how to adjust the size of the picture when the component size and picture size are out of proportion
     * 决定当组件尺寸和图片尺寸不成比例的时候如何调整图片的大小。
     * default(默认值):stretch
     */
    resizeMode?: PictureResizeMode;

    /**
     * picture is a PureComponent whose shouldComponentUpdate determines if and only if porps.source.uri changes. If you want to ignore its shouldComponentUpdate, pass in forceUpdate={true}
     * (Picture 是一个 PureComponent ，它的 shouldComponentUpdate 决定了当且仅当 porps.source.uri 有变化时才会重新 render。如果你想忽略它的 shouldComponentUpdate，则传入 forceUpdate={true})
     *  default(默认值):false
     */
    forceUpdate?: boolean;

    /**
     * real width of picture, unit px
     * (图片真实宽度，单位 px)
     */
    width: number;

    /**
     * real height of picture, unit px
     * (图片真实高度，单位 px)
     */
    height: number;

    /**
     * (web-side valid) The web side needs to import the framework.web.js script,
     * depending on whether the image is lazily loaded within the visible range.
     * (web端有效，根据图像是否在可视范围内延迟加载图像，Web 端需引入 framework.web.js 脚本)
     * default(默认值):false
     */
    lazyload?: boolean;

    /**
     * (web side valid) Use double image at high resolution
     * (web端有效，在高分辨率下使用二倍图)
     * default(默认值):true
     */
    autoPixelRatio?: boolean;

    /**
     * the URL of the background image displayed when lazyload is enabled on the web side cannot be set at the same time with an unexpected effect.
     * (web端有效,lazyload 时显示的背景图 URL, 不能同时设置 resizeMode，会有意想不到的效果)
     */
    placeholder?: string;

    /**
     * (web side is valid) image URL auto-delete protocol header
     * (web端有效,图像 URL 自动删除协议头)
     * default(默认值):true
     */
    autoRemoveScheme?: boolean;

    /**
     * (web side is valid) image URL domain is replaced with gw.alicdn.com
     * (web端有效 图像 URL 域名替换成 gw.alicdn.com)
     * default(默认值):true
     */
    autoReplaceDomain?: boolean;

    /**
     * (Web side is valid) Adding scaling suffix for image URL will add scaling suffix according to width property in style
     * (web端有效, 为图像 URL 添加缩放后缀，将会根据 style 内的 width 属性添加缩放后缀)
     *default(默认值):true
     */
    autoScaling?: boolean;

    /**
     * (web side is valid) Add webp suffix
     * (web端有效，添加 webp 后缀)
     *default(默认值):true
     */
    autoWebp?: boolean;

    /**
     * (web side is valid) Add mass compression suffix
     * (web端有效, 添加质量压缩后缀)
     * default(默认值):true
     */
    autoCompress?: boolean;

    /**
     * (web side effective) Image quality compression suffix rule
     * (web端有效, 图像质量压缩后缀规则)
     * default(默认值):['q75', 'q50']
     */
    compressSuffix?: Array<string>;

    /**
     * (Web side is valid) Use high quality compressed suffix
     * (web端有效， 使用高质量的压缩后缀)
     * default(默认值):true
     */
    highQuality?: boolean;

    /**
     * (web side is valid) Whether the optimization of all URLs ignores images in gif format and ignores them by default
     * (web端有效，所有针对 URL 的优化是否忽略 gif 格式的图像，默认忽略)
     * default(默认值):true
     */
    ignoreGif?: boolean;


}


declare class Picture extends Rax.Component<PictureProps, any> {


    render(): JSX.Element;


}


export default Picture;
