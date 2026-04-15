import React from 'react';
import MarkdownViewer from '@/components/MarkdownViewer'
import CollapsibleList from './CollapsibleList'
import './index.scss'

export default function CodeFiles({ codeFiles }) {
  return (
    <div className="code-files">
      {(()=>{
        let blocks=[]
        for(const file in codeFiles) {
          const code=(({lang, code})=>{
            return "```"+lang+"\n"+code+"\n```"
          })(codeFiles[file])
          blocks.push({title: file, content: <MarkdownViewer content={code} />})
        }
        return <CollapsibleList contentClassName='code-area' data={blocks} />
      })()}
    </div>
  );
}
