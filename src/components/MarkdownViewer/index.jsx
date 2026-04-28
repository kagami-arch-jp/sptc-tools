import React, { useState } from 'react';

#ifndef IS_NODE_TARGET
import Markdown from './markdown'
#endif

export default function(props) {
  const [Component, setComponent]=React.useState(null)
  React.useEffect(()=>{
    setComponent(<Markdown {...props} />)
  }, [props])
  return Component
}
