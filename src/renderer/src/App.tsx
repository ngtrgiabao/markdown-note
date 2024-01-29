import { ActionButtonRow, Content, RootLayout, Sidebar } from '@/components'

function App() {
  return (
    <RootLayout>
      <Sidebar className="p-2 text-black">
        <ActionButtonRow className='flex justify-between'/>
      </Sidebar>
      <Content className="border-l bg-zinc-900/85 border-l-white/20 p-2">Content</Content>
    </RootLayout>
  )
}

export default App
