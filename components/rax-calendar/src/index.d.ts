import * as Rax from "rax";
import {BaseProps} from "rax";
import {Requireable} from "react";


/**
 * component：calendar (日历)
 * document address(文档地址):
 * https://alibaba.github.io/rax/component/calendar
 */
export interface CalendarProps extends BaseProps {

    /**
     * optional start time (可选的起始时间)
     * format(格式):yyyy-MM-dd
     */
    startDate?: string;

    /**
     * optional end time (可选的结束时间)
     * format(格式) yyyy-MM-dd
     */
    endDate?: string;

    /**
     * Event date list (活动日期列表)
     * example(示例):['2017-01-02', '2017-01-05', '2017-01-28', '2017-01-30']
     */
    eventDates?: Array<string>;

    /**
     * month's rendering format (月份的渲染格式)
     * default(默认): MMMM YYYY
     */
    titleFormat?: string;

    /**
     * date format returned (返回的日期格式)
     * default(默认): YYYY-MM-DD
     */
    dateFormat?: string;

    /**
     * let the weekday be the beginning of a week (把周几作为一个星期的开始)
     * default(默认)：1 (on monday)
     */
    weekStart?: number;

    /**
     * switch to last month button to display text (切换到上一个月按钮显示文字)
     */
    prevButtonText?: string;
    /**
     * Switch to next month button to show text (Switch to next month button to show text)
     */
    nextButtonText?: string;

    /**
     * select a date (选中某个日期)
     * @param {string} dateText Expected date selected (期望选中的日期) example: 2017-09-22
     */
    onDateSelect?: (dateText: string) => void;

    /**
     * switch to the previous month (切换到上一个月)
     * @param {number} month
     */
    onTouchPrev?: (month?: number) => void;

    /**
     * switch to the next month (切换到下一个月)
     */
    onTouchNext?: (month?: number) => void;

}

declare class Calendar extends Rax.Component<CalendarProps, any> {
    static propTypes: {
        customStyle: Requireable<any>,
        dayHeadings: Requireable<any>,
        eventDates: Requireable<any>,
        monthNames: Requireable<any>,
        nextButtonText: Requireable<any>,
        onDateSelect: Requireable<any>,
        onSwipeNext: Requireable<any>,
        onSwipePrev: Requireable<any>,
        onTouchNext: Requireable<any>,
        onTouchPrev: Requireable<any>,
        prevButtonText: Requireable<any>,
        selectedDate: Requireable<any>,
        showControls: Requireable<any>,
        startDate: Requireable<any>,
        endDate: Requireable<any>,
        titleFormat: Requireable<any>,
        dateFormat: Requireable<any>,
        today: Requireable<any>,
        weekStart: Requireable<any>,
    };

    render(): JSX.Element;
}

export default Calendar;
