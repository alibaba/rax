
// 当前手势速度 > 临界值 && 当前手势在某一方向的改变距离 < 当前方向的临界值
export default (velocity, directionalChange, velocityThreshold, changeThreshold) => {
  return Math.abs(velocity) > velocityThreshold && Math.abs(directionalChange) < changeThreshold;
};