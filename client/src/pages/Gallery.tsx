import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import greyHeronImage from "@assets/generated_images/grey_heron_species_photo.png";
import paintedStorkImage from "@assets/generated_images/painted_stork_species_photo.png";
import pelican from "@assets/generated_images/spot-billed_pelican_species_photo.png";
import ibisImage from "@assets/generated_images/black-headed_ibis_species_photo.png";
import openbillImage from "@assets/generated_images/asian_openbill_species_photo.png";
import cormorantImage from "@assets/generated_images/little_cormorant_species_photo.png";
import heroImage from "@assets/generated_images/wetland_hero_background_image.png";

interface GalleryImage {
  id: string;
  src: string;
  title: string;
  category: string;
  uploadedAt?: string;
}

const defaultImages: GalleryImage[] = [
  { id: "1", src: heroImage, title: "Wetland Habitat", category: "Landscape" },
  { id: "2", src: greyHeronImage, title: "Grey Heron", category: "Birds" },
  { id: "3", src: paintedStorkImage, title: "Painted Stork", category: "Birds" },
  { id: "4", src: pelican, title: "Spot-billed Pelican", category: "Birds" },
  { id: "5", src: ibisImage, title: "Black-headed Ibis", category: "Birds" },
  { id: "6", src: openbillImage, title: "Asian Openbill", category: "Birds" },
  { id: "7", src: cormorantImage, title: "Little Cormorant", category: "Birds" },
];

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(defaultImages);
  const [uploading, setUploading] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState("User Upload");

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch("/api/gallery");
      const data = await response.json();
      setGalleryImages([...defaultImages, ...data.uploadedImages]);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTitle.trim()) {
      alert("Please enter a title for your image");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64 = event.target?.result as string;
        const response = await fetch("/api/gallery/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: uploadTitle,
            category: uploadCategory,
            imageData: base64,
          }),
        });

        if (response.ok) {
          const newImage = await response.json();
          setGalleryImages([...galleryImages, newImage.image]);
          setUploadTitle("");
          setUploadCategory("User Upload");
          e.target.value = "";
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (imageId: string) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await fetch(`/api/gallery/${imageId}`, { method: "DELETE" });
      setGalleryImages(galleryImages.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" data-testid="text-gallery-title">
            Photo Gallery
          </h1>
          <p className="text-muted-foreground" data-testid="text-gallery-subtitle">
            Explore stunning photography from Vedanthangal Bird Sanctuary
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8 bg-muted/50">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h2 className="font-semibold flex items-center gap-2" data-testid="text-upload-title">
                <Upload className="h-5 w-5" />
                Share Your Bird Photos
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="Enter photo title"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  data-testid="input-photo-title"
                  disabled={uploading}
                />
                <Input
                  type="text"
                  placeholder="Category (e.g., Birds, Landscape)"
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  data-testid="input-photo-category"
                  disabled={uploading}
                />
                <label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    disabled={uploading}
                    data-testid="input-file-upload"
                    className="hidden"
                  />
                  <Button
                    asChild
                    disabled={uploading}
                    data-testid="button-upload-image"
                  >
                    <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                  </Button>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image) => (
            <div key={image.id} data-testid={`card-gallery-${image.id}`}>
              <Card className="overflow-hidden group hover-elevate relative">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    data-testid={`img-gallery-${image.id}`}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  {image.uploadedAt && (
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      data-testid={`button-delete-${image.id}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm" data-testid={`text-gallery-title-${image.id}`}>
                      {image.title}
                    </h3>
                    <Badge variant="secondary" data-testid={`badge-category-${image.id}`}>
                      {image.category}
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
