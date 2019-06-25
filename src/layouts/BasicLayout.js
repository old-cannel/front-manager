import React, { Suspense } from 'react';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import Media from 'react-media';
import logo from '../assets/logo.svg';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import SiderMenu from '@/components/SiderMenu';
import getPageTitle from '@/utils/getPageTitle';
import styles from './BasicLayout.less';

// lazy load SettingDrawer
const SettingDrawer = React.lazy(() => import('@/components/SettingDrawer'));

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.Component {
  componentDidMount() {
    const {
      dispatch,
      route: { routes, path, authority },
    } = this.props;
    // 加载用户登录后信息
    dispatch({ type: 'user/loadForLogin' });
    // 加载字典
    dispatch({ type: 'global/queryDict' });
    dispatch({
      type: 'setting/getSetting',
    });
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, path, authority },
    });
  }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  renderSettingDrawer = () => {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
    if (
      process.env.NODE_ENV === 'production' &&
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION !== 'site'
    ) {
      return null;
    }
    return <SettingDrawer />;
  };

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
      isMobile,
      menuData,
      breadcrumbNameMap,
      fixedHeader,
    } = this.props;

    const isTop = PropsLayout === 'topmenu';
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          />
          <Content className={styles.content} style={contentStyle}>
            {children}
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
        <Suspense fallback={null}>{this.renderSettingDrawer()}</Suspense>
      </React.Fragment>
    );
  }
}


const setMenuDataSort=(menuData,serviceMenus)=>{
  menuData.forEach(item=>{
    const serverMenu=serviceMenus.find(serverMenuItem=>item.path===serverMenuItem.url);
    if(serverMenu && (serverMenu.sort || serverMenu.sort===0)){
      item.sort=serverMenu.sort
    }
    if(item.routes && item.routes){
      setMenuDataSort(item.routes,serviceMenus)
    }
    if(item.children && item.children){
      setMenuDataSort(item.children,serviceMenus)
    }
  })
}
const menuDataSort=(menuData)=>{
  menuData.sort((a, b) => {
    if (a.sort < b.sort) {
      return 1;
    }
    if (a.sort > b.sort) {
      return -1;
    }
    return a.name < b.name ? -1 :1;
  });
  menuData.forEach(item=>{
    if(item.children){
      menuDataSort(item.children);
    }
  })
}

const sorted = (menuData, serviceMenus) => {
  if(serviceMenus && serviceMenus.length>0){
    setMenuDataSort(menuData,serviceMenus);
    menuDataSort(menuData,serviceMenus);
  }
  return menuData;
};

export default connect(({ global, setting, menu: menuModel,user }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: sorted(menuModel.menuData,user.serviceMenus),
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
));
