import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * component: image(图片)
 * document address(文档地址)：
 * https://alibaba.github.io/rax/component/image
 */

export interface ImageSource {

    uri: string;

    width?: number

    height?: number
}


export interface ImageProps extends BaseProps {


    /**
     * image source
     */
    source: ImageSource;


    /**
     * Decide how to adjust the size of the picture when the component size and picture size are out of proportion,
     * Please refer to the resizeMode definition in the component
     * (决定当组件尺寸和图片尺寸不成比例的时候如何调整图片的大小，请参照组件中的resizeMode定义)
     */
    resizeMode?: string;


    /**
     * the load event is fired when the picture specified by src is loaded.
     * (当加载完成 src 指定的图片时，load事件将被触发)
     * @param {ImageLoadEvent} event
     */
    load?: (event: ImageLoadEvent) => void;


}

/**
 * reference documents(参考文档):https://weex.apache.org/cn/references/components/image.html
 */
interface ImageLoadEvent {

    /**
     * Whether the tag image was loaded successfully.
     * (标记图片是否成功加载。)
     */
    readonly success: boolean;

    /**
     * loaded image size object, property list
     * (加载的图片大小对象，属性列表)
     */
    readonly size: {
        /**
         * the width of the picture, 0 if the picture fails to load.
         * (图片宽度，如果图片加载失败则为0)
         */
        readonly  naturalWidth: number,

        /**
         * image height, 0 if the image failed to load
         * (图片高度，如果图片加载失败则为0)
         */
        readonly naturalHeight: number
    }
}


declare class Image extends Rax.Component<ImageProps, any> {

    static resizeMode: {


        /**
         * scale the picture to fully fit in the <image> area. It is possible that the background area is partially blank.
         * (缩放图片以完全装入<image>区域，可能背景区部分空白。)
         */
        contain: 'contain',

        /**
         * scale the picture to completely cover the <image> area, possibly invisible part of the picture
         * (缩放图片以完全覆盖<image>区域，可能图片部分看不见)
         */
        cover: 'cover',

        /**
         * scale the picture according to the width and height of the <image> area
         * 按照<image>区域的宽高比例缩放图片
         */
        stretch: 'stretch',

        /**
         * centered
         * (居中)
         */
        center: 'center',

        /**
         * tiled horizontally and vertically
         * (在横向和纵向平铺)
         */
        repeat: 'repeat',
    };


    render(): JSX.Element;

    /**
     * save image content to a local file or album. This may require device-related permissions.
     * (保存图片内容到本地文件或相册，此操作可能需要设备相关权限。)
     */
    save: (callback: (result: {

        /**
         * whether the tag image has been written
         * (标记图片是否已写入完成)
         */
        readonly success: boolean;

        /**
         * if the image was not successfully written, the string contains a detailed description of the error
         * (如果图像没有成功写入，该字符串包含了详细的错误描述)
         */
        readonly errorDesc: string;
    }) => void) => void;
}

export default Image;
