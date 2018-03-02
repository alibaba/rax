import { isWeex, isWeb } from 'universal-env';
import Dimension from '../../mods/dimensions';

const { height } = Dimension.get('window');
import {
  percent
} from '../../mods/commonStyle';


const SPRING_CUT_POINT = 130; // 65 * 2
const TAB_BAR_HEIGHT = 98; // 49 * 2

export default {
  app: {
    width: percent(100),
    height: height - TAB_BAR_HEIGHT,
    alignItems: 'flex-start',
    backgroundColor: '#f5f5f5',
    marginTop: isWeex ? SPRING_CUT_POINT : 0,
    paddingTop: isWeb ? SPRING_CUT_POINT : 0
  },
  wrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
};
