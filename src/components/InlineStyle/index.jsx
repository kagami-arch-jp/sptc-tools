import React from 'react';

export default function({ css }) {
  return <div dangerouslySetInnerHTML={{ __html: `<style>${css}</style>` }} />
}
