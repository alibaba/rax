export default (velocity, directionalChange, velocityThreshold, changeThreshold) => {
  return Math.abs(velocity) > velocityThreshold && Math.abs(directionalChange) < changeThreshold;
};