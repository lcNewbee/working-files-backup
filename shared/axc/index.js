import { fromJS } from 'immutable';
import { purviewOptions } from 'shared/config/axc';

export function getActionable(props, moduleName) {
  const purview = props.app.getIn(['login', 'purview']);
  const userType = props.app.getIn(['login', 'usertype']);
  const $$purviewList = fromJS(purview.split(','));
  const curModule = moduleName || props.route.path.split('/')[2];
  const $$curModuleItem = fromJS(purviewOptions).find(
    $$item => $$item.get('module') === curModule,
  );
  let ret = false;
  let curModuleVal = '';

  if ($$curModuleItem) {
    curModuleVal = $$curModuleItem.get('value');
  }

  // admin 或者 分支权限 all的管理员
  if (purview === 'all' || userType === 0) {
    ret = true;

    // 只读管理员
  } else if (userType === 2) {
    ret = false;

    // 分支管理员
  } else {
    $$purviewList.forEach(
      (val, i) => {
        let moduleRet = i;

        if (curModuleVal === val) {
          moduleRet = false;
          ret = true;
        }

        return moduleRet;
      },
    );
  }

  if (props.actionable === false) {
    ret = false;
  }

  return ret;
}

export default {};
