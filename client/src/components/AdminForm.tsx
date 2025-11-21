import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Upload, Check } from "lucide-react";

export default function AdminForm() {
  const [formData, setFormData] = useState({
    commonName: "",
    scientificName: "",
    tamilName: "",
    status: "Resident" as "Migratory" | "Resident" | "Rare",
    size: "",
    weight: "",
    habitat: "",
    season: "",
    arModelUrl: "",
    description: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      console.log('Image uploaded:', file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const testARUrl = () => {
    console.log('Testing AR URL:', formData.arModelUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle data-testid="text-form-title">Add New Bird Species</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="commonName">Common Name</Label>
                <Input
                  id="commonName"
                  value={formData.commonName}
                  onChange={(e) => setFormData({ ...formData, commonName: e.target.value })}
                  placeholder="e.g., Grey Heron"
                  data-testid="input-common-name"
                />
              </div>

              <div>
                <Label htmlFor="scientificName">Scientific Name</Label>
                <Input
                  id="scientificName"
                  value={formData.scientificName}
                  onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                  placeholder="e.g., Ardea cinerea"
                  className="italic"
                  data-testid="input-scientific-name"
                />
              </div>

              <div>
                <Label htmlFor="tamilName">Tamil Name</Label>
                <Input
                  id="tamilName"
                  value={formData.tamilName}
                  onChange={(e) => setFormData({ ...formData, tamilName: e.target.value })}
                  placeholder="e.g., சாம்பல் நாரை"
                  data-testid="input-tamil-name"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "Migratory" | "Resident" | "Rare") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status" data-testid="select-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Migratory">Migratory</SelectItem>
                    <SelectItem value="Resident">Resident</SelectItem>
                    <SelectItem value="Rare">Rare</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="e.g., 90-98 cm"
                  data-testid="input-size"
                />
              </div>

              <div>
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="e.g., 1-2 kg"
                  data-testid="input-weight"
                />
              </div>

              <div>
                <Label htmlFor="habitat">Habitat/Diet</Label>
                <Input
                  id="habitat"
                  value={formData.habitat}
                  onChange={(e) => setFormData({ ...formData, habitat: e.target.value })}
                  placeholder="e.g., Fish, Frogs"
                  data-testid="input-habitat"
                />
              </div>

              <div>
                <Label htmlFor="season">Season</Label>
                <Input
                  id="season"
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  placeholder="e.g., Nov-Mar"
                  data-testid="input-season"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of habitat, behavior, and characteristics..."
              rows={4}
              data-testid="textarea-description"
            />
          </div>

          <div>
            <Label htmlFor="image">Bird Image</Label>
            <div className="mt-2">
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover-elevate">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  data-testid="input-image-upload"
                />
                <label htmlFor="image" className="cursor-pointer">
                  {imagePreview ? (
                    <div className="space-y-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg mx-auto"
                        data-testid="img-preview"
                      />
                      <div className="flex items-center justify-center gap-2 text-sm text-primary">
                        <Check className="h-4 w-4" />
                        <span>Image uploaded</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <div className="text-sm text-muted-foreground">
                        Click to upload bird image
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="arModelUrl">AR Model URL</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="arModelUrl"
                value={formData.arModelUrl}
                onChange={(e) => setFormData({ ...formData, arModelUrl: e.target.value })}
                placeholder="https://example.com/models/bird.glb"
                data-testid="input-ar-url"
              />
              <Button
                type="button"
                variant="outline"
                onClick={testARUrl}
                disabled={!formData.arModelUrl}
                data-testid="button-test-ar"
              >
                Test
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Provide the URL to your AR-enabled 3D model (.glb or .usdz format)
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" data-testid="button-save-bird">
              Save Species
            </Button>
            <Button type="button" variant="outline" className="flex-1" data-testid="button-save-draft">
              Save as Draft
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
