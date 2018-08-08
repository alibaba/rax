import * as my from './api';

my.canIUse = api => api in my;

export default my;
