import BirdCard from '../BirdCard'
import greyHeronImage from '@assets/generated_images/grey_heron_species_photo.png'

export default function BirdCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <BirdCard
        id={1}
        commonName="Grey Heron"
        scientificName="Ardea cinerea"
        tamilName="சாம்பல் நாரை"
        image={greyHeronImage}
        status="Migratory"
        size="90-98 cm"
        weight="1-2 kg"
        habitat="Fish, Frogs"
        season="Nov-Mar"
        arModelUrl="https://example.com/ar/grey-heron"
        onARView={() => console.log('AR View clicked')}
        onDetails={() => console.log('Details clicked')}
      />
    </div>
  )
}
