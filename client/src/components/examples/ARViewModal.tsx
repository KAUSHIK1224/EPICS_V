import ARViewModal from '../ARViewModal'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function ARViewModalExample() {
  const [open, setOpen] = useState(false)

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open AR View</Button>
      <ARViewModal
        open={open}
        onOpenChange={setOpen}
        birdName="Grey Heron"
        arModelUrl="https://example.com/ar/grey-heron.glb"
      />
    </div>
  )
}
