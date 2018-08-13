import * as Rax from "rax";
import {BaseProps} from "rax";

/**
 * component:video(视频播放)
 * document address(文档地址):
 * https://alibaba.github.io/rax/component/video
 */
export interface VideoProps extends BaseProps {

    /**
     * video playback address
     * (视频播放地址)
     */
    src: string;

    /**
     * auto play
     * (自动播放)
     */
    autoPlay?: boolean;

}

declare class Video extends Rax.Component<VideoProps, any> {

    render(): JSX.Element;
}

export default Video;
