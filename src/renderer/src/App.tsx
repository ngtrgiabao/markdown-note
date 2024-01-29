import { ActionButtonRow, Content, FloatingNoteTitle, NotePreviewList, RootLayout, Sidebar } from '@/components';
import { useRef } from 'react';
import { MarkdownEditor } from './components/MarkdownEditor';

function App() {
  const contentContainerRef = useRef<HTMLDivElement>(null);

  const resetScroll = () => {
    contentContainerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <RootLayout>
      <Sidebar className="p-2 bg-zinc-800">
        <ActionButtonRow className='flex justify-between' />
        <NotePreviewList className="mt-3 space-y-1" onSelect={resetScroll} />
      </Sidebar>
      <Content ref={contentContainerRef} className="border-l bg-zinc-900 border-l-white/20 p-2">
        <FloatingNoteTitle className='pt-2' />
        <MarkdownEditor />
      </Content>
    </RootLayout>
  )
}

export default App
