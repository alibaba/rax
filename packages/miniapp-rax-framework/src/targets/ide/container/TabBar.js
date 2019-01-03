import { createElement } from 'rax';

export default function TabBar(props) {
  function handleTabBarItemClick(evt) {
    const { pageName } = evt.currentTarget.dataset;
    if (!pageName) return;
    props.changeCurrentPage(pageName);
  }

  return (
    <div className="tabBar" style={styles.tabBar}>
      {props.tabBarList && props.tabBarList.map(item => (
        <div
          className="tabBarItem"
          style={styles.tabBarItem}
          data-page-name={item.pageName}
          onClick={handleTabBarItemClick}
        >
          <img
            src={props.activePageName === item.pageName ? item.selectedIconPath : item.iconPath}
            className="icon"
            aria-hidden="true"
            style={styles.icon}
          />
          <div className="tabBarItemText" style={styles.tabBarItemText}>{item.text}</div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  tabBar: {
    width: '100%',
    height: '12.8vw',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    left: '0',
    bottom: '0',
    borderTop: '1px solid #eee',
  },
  tabBarItem: {
    textAlign: 'center',
  },
  tabBarItemText: {
    fontSize: 16,
    color: '#686868',
    whiteSpace: 'nowrap',
    lineHeight: '1em',
  },
  icon: {
    width: 32,
  },
};
