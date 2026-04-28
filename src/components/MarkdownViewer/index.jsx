import React, { useState } from 'react';

export default function(props) {
  const [component, setComponent]=React.useState(null)
  React.useEffect(()=>{
    import('./markdown.jsx').then(({default: Markdown})=>{
      setComponent(<Markdown {...props} />)
    })
  }, [])
  return component
}
