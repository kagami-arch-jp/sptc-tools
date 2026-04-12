import createSharedState from 'react-cross-component-state';

import {helper} from '@/utils/localStorage'

const darkModeHelper=helper('darkMode')

export const darkMode = createSharedState(darkModeHelper.getValue(false));

const originalSetValue=darkMode.setValue
darkMode.setValue=value=>{
  darkModeHelper.setValue(value)
  originalSetValue(value)
}
