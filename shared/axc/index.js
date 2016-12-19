import { fromJS } from 'immutable';
import { purviewOptions } from 'shared/config/axc';

export function getActionable(props) {
  const purview = props.app.getIn(['login', 'purview']);
  const userType = props.app.getIn(['login', 'usertype']);
  const $$purviewList = fromJS(purview.split(','));
  const curModule = props.route.path.split('/')[2];
  const curModuleVal = fromJS(purviewOptions).find(
    $$item => $$item.get('module') === curModule,
  ).get('value');
  let ret = false;

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

  return ret;
}


export default {};
