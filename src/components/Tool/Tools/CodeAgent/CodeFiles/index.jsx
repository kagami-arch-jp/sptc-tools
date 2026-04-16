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
          const code=codeFiles[file].map(({startLine, endLine, create, lang, code})=>{
            //console.log({startLine, endLine, create, lang, code})
            return [
              startLine && endLine && `**line=${startLine}-${endLine}**`,
              "```"+lang+"\n"+code+"\n```",
            ].filter(Boolean).join('\n')
          }).join('\n')
          blocks.push({title: file, content: <MarkdownViewer content={code} />})
        }
        return <CollapsibleList contentClassName='code-area' data={blocks} />
      })()}
    </div>
  );
}
