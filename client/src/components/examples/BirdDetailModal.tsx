import BirdDetailModal from '../BirdDetailModal'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import greyHeronImage from '@assets/generated_images/grey_heron_species_photo.png'

export default function BirdDetailModalExample() {
  const [open, setOpen] = useState(false)

  const mockBird = {
    id: 1,
    commonName: "Grey Heron",
    scientificName: "Ardea cinerea",
    tamilName: "சாம்பல் நாரை",
    image: greyHeronImage,
    status: "Migratory" as const,
    size: "90-98 cm",
    weight: "1-2 kg",
    habitat: "Fish, Frogs",
    season: "Nov-Mar",
    arModelUrl: "https://example.com/ar/grey-heron",
    onARView: () => console.log('AR View'),
    onDetails: () => console.log('Details'),
  }

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open Bird Details</Button>
      <BirdDetailModal
        open={open}
        onOpenChange={setOpen}
        bird={mockBird}
        onARView={() => console.log('AR View from detail')}
      />
    </div>
  )
}
